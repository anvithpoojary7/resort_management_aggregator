const express = require('express');
const Resort = require('../models/resort');
const fs = require('fs');

module.exports = (gfs, upload, gridfsBucket) => {
  const router = express.Router();

  // POST /api/resorts
  router.post('/', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No image file uploaded.' });
      }

      const { name, location, price, description, amenities, type, ownerId } = req.body;

      let parsedAmenities = [];
      if (amenities) {
        parsedAmenities = JSON.parse(amenities);
      }

      const { filename, path: filePath } = req.file;

      const readStream = fs.createReadStream(filePath);
      const uploadStream = gridfsBucket.openUploadStream(filename);

      readStream.pipe(uploadStream);

     uploadStream.on('finish', async function () {
  const savedFilename = uploadStream.id.toString(); 
  
        const newResort = new Resort({
          name,
          location,
          price,
          image: filename,
          description,
          amenities: parsedAmenities,
          type,
          ownerId,
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const savedResort = await newResort.save();
        res.status(201).json({ message: 'Resort submitted successfully!', resort: savedResort });
      });

      uploadStream.on('error', (err) => {
        console.error('Upload failed:', err);
        fs.unlink(filePath, () => {});
        res.status(500).json({ message: 'Image upload failed.' });
      });
    } catch (err) {
      console.error('Resort add error:', err.message);
      res.status(500).json({ message: 'Server error while adding resort.' });
    }
  });

  // GET all resorts (or filter by status)
  router.get('/', async (req, res) => {
    try {
      const { status } = req.query;
      const query = status ? { status } : {};
      const resorts = await Resort.find(query).sort({ createdAt: -1 });
      res.status(200).json(resorts);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching resorts.' });
    }
  });

  // GET owner has resort
  router.get('/owner/:ownerId/has-resort', async (req, res) => {
    try {
      const { ownerId } = req.params;
      const count = await Resort.countDocuments({ ownerId });
      res.status(200).json({ hasResort: count > 0 });
    } catch (err) {
      res.status(500).json({ message: 'Error checking resorts.' });
    }
  });

  // GET all resorts of a specific owner
  router.get('/owner/:ownerId', async (req, res) => {
    try {
      const resorts = await Resort.find({ ownerId: req.params.ownerId }).sort({ createdAt: -1 });
      res.status(200).json(resorts);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching owner resorts.' });
    }
  });

  // PATCH resort status (approve/reject)
  router.patch('/:id/status', async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status.' });
      }

      const updated = await Resort.findByIdAndUpdate(
        id,
        { status, updatedAt: new Date() },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ message: 'Resort not found.' });
      }

      res.status(200).json({ message: `Resort ${status}.`, resort: updated });
    } catch (err) {
      res.status(500).json({ message: 'Error updating status.' });
    }
  });

  return router;
};
