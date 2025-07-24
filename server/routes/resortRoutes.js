const express = require("express");
const fs = require("fs");
const Resort = require("../models/resort");
const Room = require("../models/room");

module.exports = (gfs, upload, gridfsBucket) => {
  const router = express.Router();
  const uploadMw = upload.any();

  // 👇 PATCH: Toggle Active/Inactive status for resorts
  router.patch("/:id/active", async (req, res) => {
    try {
      const { id } = req.params;
      const { visible } = req.body;

      const updated = await Resort.findByIdAndUpdate(
        id,
        { visible, updatedAt: new Date() },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ message: "Resort not found." });
      }

      const msg = visible
        ? "Resort is now active and visible to users."
        : "Resort is now inactive and hidden from users.";

      res.json({ message: msg, resort: updated });
    } catch (err) {
      console.error("Visibility toggle error:", err);
      res.status(500).json({ message: "Server error while toggling resort status." });
    }
  });

  // 🏨 POST: Submit new resort
  router.post("/", uploadMw, async (req, res) => {
    const files = req.files || [];
    const { name, location, price, description, amenities, type, ownerId, rooms } = req.body;

    try {
      if (await Resort.findOne({ ownerId })) {
        return res.status(409).json({ message: "You have already submitted a resort." });
      }

      const resortImageFile = files.find(f => f.fieldname === "resortImage");
      if (!resortImageFile) return res.status(400).json({ message: "Main resort image required." });

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

      const resortDoc = await Resort.create({
        name,
        location,
        price,
        description,
        amenities: amenities ? JSON.parse(amenities) : [],
        type,
        image: mainImageFilename,
        ownerId,
      });

      const roomMeta = rooms ? JSON.parse(rooms) : [];
      const roomCreationPromises = [];

      roomMeta.forEach((roomData, roomIndex) => {
        const roomImagesToUpload = files.filter(
          (f) => f.fieldname.startsWith(`roomImage_${roomIndex}_`)
        );

        if (roomImagesToUpload.length < 2 || roomImagesToUpload.length > 5) {
          console.warn(`Room ${roomIndex + 1} has invalid number of images (${roomImagesToUpload.length}). Skipping.`);
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
            .then(() => Room.create({
              resortId: resortDoc._id,
              roomName: roomData.roomName,
              roomPrice: roomData.roomPrice,
              roomDescription: roomData.roomDescription,
              roomImages: currentRoomImages,
            }))
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

  // 🌐 GET resorts for user-facing list (✅ Updated Here)
  router.get("/", async (req, res) => {
    try {
      const resorts = await Resort.find({ status: "approved", visible: true });
      res.status(200).json(resorts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching resorts", error });
    }
  });

  // 🌐 GET by owner
  router.get("/owner/:ownerId", async (req, res) => {
    try {
      const { ownerId } = req.params;
      const resort = await Resort.findOne({ ownerId });
      res.json(resort ?? null);
    } catch {
      res.status(500).json({ message: "Server error." });
    }
  });

  // 📦 GET resort + rooms by ID
  router.get("/:id/details", async (req, res) => {
    try {
      const { id } = req.params;
      // Fetch the resort, ensuring it's approved and visible
      const resort = await Resort.findOne({ _id: id, status: "approved", visible: true });
      
      if (!resort) {
        // If not found, or not approved/visible, return 404
        return res.status(404).json({ message: "Resort not found or is not available." });
      }

      const rooms = await Room.find({ resortId: id });
      res.json({ resort, rooms });
    } catch (err) {
      console.error("Error fetching resort details:", err);
      // If it's a cast error (invalid ID format), return 400
      if (err.name === 'CastError') {
        return res.status(400).json({ message: "Invalid Resort ID." });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  // 🧾 GET all resorts (admin use)
  router.get("/allresorts", async (req, res) => {
    try {
      const resorts = await Resort.find({}).sort({ createdAt: -1 });
      res.json(resorts);
    } catch {
      res.status(500).json({ message: "Error fetching resorts." });
    }
  });

  // 🧠 GET approved resorts for admin panel
  router.get("/admin/resorts", async (req, res) => {
    try {
      const resorts = await Resort.find({ status: "approved" }).populate("ownerId", "name email");
      res.json(resorts);
    } catch (err) {
      console.error("Error fetching approved resorts:", err);
      res.status(500).json({ message: "Server error fetching resorts" });
    }
  });

  // 🛏️ GET rooms by resort
  router.get("/rooms/byresort/:resortId", async (req, res) => {
    try {
      const rooms = await Room.find({ resortId: req.params.resortId });
      res.json(rooms);
    } catch (err) {
      res.status(500).json({ message: "Error fetching rooms" });
    }
  });

  // 🔁 PATCH status (admin approve/reject)
  router.patch("/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!["approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status." });
      }

      const updated = await Resort.findByIdAndUpdate(
        id,
        { status, updatedAt: new Date() },
        { new: true }
      );

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
