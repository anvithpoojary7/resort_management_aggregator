const express  = require("express");
const fs       = require("fs");
const multer   = require("multer");
const Resort   = require("../models/resort");


module.exports = (gfs, upload, gridfsBucket) => {
  const router = express.Router();

  /* single‑file upload: field "image" */
  const uploadImage = upload.single("image");

  const uploadMw = (req,res,next) => {
    uploadImage(req,res,err=>{
      if (err instanceof multer.MulterError) {
        if (err.code==="LIMIT_UNEXPECTED_FILE")
          return res.status(400).json({ message:`Unexpected file field "${err.field}". Expected "image".` });
        return res.status(400).json({ message:err.message });
      }
      if (err) return res.status(500).json({ message:"Upload error", error:err });
      next();
    });
  };

  /* POST /api/resorts */
  router.post("/", uploadMw, async (req,res)=>{
    if (!req.file) return res.status(400).json({ message:"No image file uploaded." });

    const { name, location, price, description, amenities, type, ownerId } = req.body;

    try {
      if (await Resort.findOne({ ownerId }))
        return res.status(409).json({ message:"You have already submitted a resort." });

      /* push file to GridFS */
      const { filename, path:tmp, mimetype } = req.file;
      fs.createReadStream(tmp)
        .pipe(gridfsBucket.openUploadStream(filename,{ contentType:mimetype }))
        .on("error",()=>{ fs.unlink(tmp,()=>{}); res.status(500).json({ message:"Image upload failed." }); })
        .on("finish", async ()=>{
          fs.unlink(tmp,()=>{});
          const resort = await Resort.create({
            name, location, price, description,
            amenities: amenities ? JSON.parse(amenities):[],
            type, image: filename, ownerId
          });
          res.status(201).json({ message:"Resort submitted!", resort });
        });
    } catch(err){
      console.error(err); res.status(500).json({ message:"Server error while adding resort." });
    }
  });
  /* --------------------------------------------------
        C. GET /api/resorts          – list resorts
     -------------------------------------------------- */
  router.get("/", async (req, res) => {
    try {
      const { status } = req.query;               // optional filter
      const query      = status ? { status } : {};
      const resorts    = await Resort.find(query).sort({ createdAt: -1 });
      res.json(resorts);
    } catch {
      res.status(500).json({ message: "Error fetching resorts." });
    }
  });

  /* --------------------------------------------------
        D. GET /api/resorts/owner/:ownerId
     -------------------------------------------------- */
  router.get("/owner/:ownerId", async (req, res) => {
     console.log("🔴 /owner/:ownerId received:", req.params.ownerId);
    const { ownerId } = req.params;
    try {
      const resort = await Resort.findOne({ ownerId });
      res.json(resort ?? null);
    } catch {
      res.status(500).json({ message: "Server error." });
    }
  });

  /* --------------------------------------------------
        E. PATCH /api/resorts/:id/status   (admin)
     -------------------------------------------------- */
  router.patch("/:id/status", async (req, res) => {
    try {
      const { id }     = req.params;
      const { status } = req.body; // "approved" | "rejected"

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
