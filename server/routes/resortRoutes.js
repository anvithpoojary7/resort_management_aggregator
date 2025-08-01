const express = require("express");
const fs = require("fs");
const Resort = require("../models/resort");
const Room = require("../models/room");
const Notification = require("../models/notification");
const User = require("../models/users");

module.exports = (gfs, upload, gridfsBucket) => {
  const router = express.Router();
  const uploadMw = upload.any(); // Allow multiple fields/files

  // ------------------------------
  // POST: Add new resort (Admin)
  // ------------------------------
  router.post("/", uploadMw, async (req, res) => {
    const files = req.files || [];
    const { name, location, price, description, amenities, type, rooms } = req.body;

    try {
      // ✅ Required field validation
      if (!name || !location || !price || !type) {
        return res.status(400).json({ message: "Required fields missing." });
      }

      // ✅ Find main resort image
      const resortImageFile = files.find(f => f.fieldname === "resortImage");
      if (!resortImageFile) {
        return res.status(400).json({ message: "Main resort image required." });
      }

      // ✅ Upload main resort image
      const uploadMainImagePromise = new Promise((resolve, reject) => {
        const { filename, path: tmpPath, mimetype } = resortImageFile;
        fs.createReadStream(tmpPath)
          .pipe(gridfsBucket.openUploadStream(filename, { contentType: mimetype }))
          .on("error", (err) => {
            fs.unlink(tmpPath, () => {});
            reject(new Error("Resort image upload failed: " + err.message));
          })
          .on("finish", () => {
            fs.unlink(tmpPath, () => {});
            resolve(filename);
          });
      });

      const mainImageFilename = await uploadMainImagePromise;

      // ✅ Create resort document (NO ownerId now)
      const resortDoc = await Resort.create({
        name,
        location,
        price,
        description,
        amenities: amenities ? JSON.parse(amenities) : [],
        type,
        image: mainImageFilename,
        status: "approved",
      });

      // 📌 Send notifications to all users about new resort
      try {
        const users = await User.find({}, "_id");
        if (users.length > 0) {
          const notifications = users.map(user => ({
            userId: user._id,
            message: `A new resort "${name}" has been added in ${location}.`,
            type: "resort"
          }));
          await Notification.insertMany(notifications);
        }
      } catch (notifyErr) {
        console.error("Failed to create notifications for new resort:", notifyErr);
      }

      // ✅ Parse and upload room images
      const roomMeta = rooms ? JSON.parse(rooms) : [];
      const roomCreationPromises = [];

      roomMeta.forEach((roomData, roomIndex) => {
        const roomImagesToUpload = files.filter(
          (f) => f.fieldname.startsWith(`roomImage_${roomIndex}_`)
        );

        if (roomImagesToUpload.length < 2 || roomImagesToUpload.length > 5) {
          console.warn(`Room ${roomIndex + 1} has an invalid number of images (${roomImagesToUpload.length}). Skipping.`);
          return;
        }

        const currentRoomImages = [];
        const imageUploadPromises = roomImagesToUpload.map((imageFile) => {
          return new Promise((resolve, reject) => {
            const { filename, path: tmp, mimetype } = imageFile;
            fs.createReadStream(tmp)
              .pipe(gridfsBucket.openUploadStream(filename, { contentType: mimetype }))
              .on("error", (err) => {
                fs.unlink(tmp, () => {});
                reject(new Error(`Room image upload failed for ${filename}: ${err.message}`));
              })
              .on("finish", () => {
                fs.unlink(tmp, () => {});
                currentRoomImages.push(filename);
                resolve();
              });
          });
        });

        roomCreationPromises.push(
          Promise.all(imageUploadPromises)
            .then(async () => {
              await Room.create({
                resortId: resortDoc._id,
                roomName: roomData.roomName,
                roomPrice: roomData.roomPrice,
                roomDescription: roomData.roomDescription,
                roomImages: currentRoomImages,
              });
            })
            .catch((err) => {
              console.error(`Error processing room ${roomIndex + 1}:`, err);
            })
        );
      });

      await Promise.all(roomCreationPromises);

      res.status(201).json({ message: "Resort submitted!", resort: resortDoc });

    } catch (err) {
      console.error("Submit resort error:", err);
      files.forEach(file => fs.unlink(file.path, () => {}));
      res.status(500).json({ message: "Server error while submitting resort." });
    }
  });

  // ------------------------------
  // GET: Resort details by ID
  // ------------------------------
  router.get("/:id/details", async (req, res) => {
    try {
      const { id } = req.params;
      const resort = await Resort.findById(id);
      if (!resort) return res.status(404).json({ message: "Resort not found" });

      const rooms = await Room.find({ resortId: id });
      res.json({ resort, rooms });
    } catch (err) {
      console.error("Error fetching resort details:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

 
  router.get("/allresorts", async (req, res) => {
    try {
      const resorts = await Resort.find({}).sort({ createdAt: -1 });
      res.json(resorts);
    } catch {
      res.status(500).json({ message: "Error fetching resorts." });
    }
  });

  // ------------------------------
  // GET: Approved resorts for admin
  // ------------------------------
  router.get("/admin/resorts", async (req, res) => {
    try {
      const resorts = await Resort.find({ status: "approved" }).populate("ownerId", "name email");
      res.json(resorts);
    } catch (err) {
      console.error("Error fetching approved resorts:", err);
      res.status(500).json({ message: "Server error fetching resorts" });
    }
  });

  // ------------------------------
  // GET: Rooms by resort ID
  // ------------------------------
  router.get("/rooms/byresort/:resortId", async (req, res) => {
    try {
      const rooms = await Room.find({ resortId: req.params.resortId });
      res.json(rooms);
    } catch (err) {
      res.status(500).json({ message: "Error fetching rooms" });
    }
  });

  // ------------------------------
  // PATCH: Update resort status
  // ------------------------------
  router.patch("/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!["approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status." });
      }

      const updated = await Resort.findByIdAndUpdate(id, {
        status,
        updatedAt: new Date(),
      }, { new: true });

      if (!updated) {
        return res.status(404).json({ message: "Resort not found." });
      }

      res.json({ message: `Resort ${status}.`, resort: updated });
    } catch (err) {
      res.status(500).json({ message: "Error updating status." });
    }
  });

  return router;
};
