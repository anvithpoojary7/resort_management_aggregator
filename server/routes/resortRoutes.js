const express = require("express");
const fs = require("fs");
// Multer is already passed in, no need to require it here again
const Resort = require("../models/resort");
const Room = require("../models/room");

module.exports = (gfs, upload, gridfsBucket) => {
  const router = express.Router();

  const uploadMw = upload.any(); // Allow multiple fields/files

  router.post("/", uploadMw, async (req, res) => {
    const files = req.files || [];
    const { name, location, price, description, amenities, type, ownerId, rooms } = req.body;

    // Log received files and body for debugging
    // console.log("Received Files:", files);
    // console.log("Received Body:", req.body);

    try {
      if (await Resort.findOne({ ownerId })) {
        return res.status(409).json({ message: "You have already submitted a resort." });
      }

      // Find main resort image (optional check based on field name)
      const resortImageFile = files.find(f => f.fieldname === "resortImage");
      if (!resortImageFile) return res.status(400).json({ message: "Main resort image required." });

      // Create a promise for the main resort image upload
      const uploadMainImagePromise = new Promise((resolve, reject) => {
        const { filename, path: tmpPath, mimetype } = resortImageFile;
        fs.createReadStream(tmpPath)
          .pipe(gridfsBucket.openUploadStream(filename, { contentType: mimetype }))
          .on("error", (err) => {
            fs.unlink(tmpPath, () => {}); // Clean up temp file
            reject(new Error("Resort image upload failed: " + err.message));
          })
          .on("finish", () => {
            fs.unlink(tmpPath, () => {}); // Clean up temp file
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
        image: mainImageFilename, // Use the filename from the promise
        ownerId,
      });

      // Parse room metadata
      const roomMeta = rooms ? JSON.parse(rooms) : [];

      // Array to hold promises for room image uploads and room creation
      const roomCreationPromises = [];

      roomMeta.forEach((roomData, roomIndex) => {
        const roomImagesToUpload = files.filter(
          (f) => f.fieldname.startsWith(`roomImage_${roomIndex}_`)
        );

        if (roomImagesToUpload.length < 2 || roomImagesToUpload.length > 5) {
          // This check is already done on the frontend, but good to have a backend safeguard
          console.warn(`Room ${roomIndex + 1} has an invalid number of images (${roomImagesToUpload.length}). Skipping.`);
          return; // Skip this room if it doesn't meet image requirements
        }

        const currentRoomImages = [];
        const imageUploadPromises = roomImagesToUpload.map((imageFile) => {
          return new Promise((resolve, reject) => {
            const { filename, path: tmp, mimetype } = imageFile;
            fs.createReadStream(tmp)
              .pipe(gridfsBucket.openUploadStream(filename, { contentType: mimetype }))
              .on("error", (err) => {
                fs.unlink(tmp, () => {}); // Clean up temp file
                reject(new Error(`Room image upload failed for ${filename}: ${err.message}`));
              })
              .on("finish", () => {
                fs.unlink(tmp, () => {}); // Clean up temp file
                currentRoomImages.push(filename);
                resolve();
              });
          });
        });

        // Add a promise to the main array that waits for all images of the current room
        // to be uploaded, and then creates the room document.
        roomCreationPromises.push(
          Promise.all(imageUploadPromises)
            .then(async () => {
              await Room.create({
                resortId: resortDoc._id,
                roomName: roomData.roomName,
                roomPrice: roomData.roomPrice,
                roomDescription: roomData.roomDescription,
                roomImages: currentRoomImages, // Use the collected filenames
              });
            })
            .catch((err) => {
              console.error(`Error processing room ${roomIndex + 1}:`, err);
              // Depending on your error handling, you might want to re-throw or handle differently
              // For now, we'll just log and continue with other rooms if possible.
            })
        );
      });

      // Wait for all room processing to complete
      await Promise.all(roomCreationPromises);

      res.status(201).json({ message: "Resort submitted!", resort: resortDoc });

    } catch (err) {
      console.error("Submit resort error:", err);
      // Ensure any uploaded files are cleaned up in case of an overall error
      files.forEach(file => fs.unlink(file.path, () => {}));
      res.status(500).json({ message: "Server error while submitting resort." });
    }
  });

  // --- Existing routes (no changes needed for these based on the image issue) ---

  router.get("/owner/:ownerId", async (req, res) => {
    try {
      const { ownerId } = req.params;
      const resort = await Resort.findOne({ ownerId });
      res.json(resort ?? null);
    } catch {
      res.status(500).json({ message: "Server error." });
    }
  });

  // Add this to your resort route file
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

  router.get("/admin/resorts", async (req, res) => {
    try {
      // It looks like this route is meant for approved resorts for the admin dashboard.
      // If it's for admin to review all resorts (pending, approved, rejected), then remove { status: "approved" }
      const resorts = await Resort.find({ status: "approved" }).populate("ownerId", "name email");
      res.json(resorts);
    } catch (err) {
      console.error("Error fetching approved resorts:", err);
      res.status(500).json({ message: "Server error fetching resorts" });
    }
  });

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