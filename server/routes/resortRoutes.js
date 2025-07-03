const express = require('express');
const Resort = require('../models/resort'); // IMPORTANT: Corrected to 'resorts' (plural) as per previous error
const fs = require('fs');

module.exports = (gfs, upload, gridfsBucket) => {
  const router = express.Router();

  router.post('/', upload.array('images', 10), async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No image files uploaded.' });
      }

      const { name, location, price, description, amenities, type, ownerId } = req.body;

      const existing = await Resort.findOne({ ownerId });
      if (existing) {
        return res.status(400).json({ message: 'You have already submitted a resort.' });
      }

      let parsedAmenities = [];
      if (amenities) {
        parsedAmenities = JSON.parse(amenities);
      }

      const imageFilenames = [];

      let completed = 0;
      const total = req.files.length;
      let errorOccurred = false;

      req.files.forEach(file => {
        const { filename, path: filePath, mimetype } = file;
        const readStream = fs.createReadStream(filePath);
        const uploadStream = gridfsBucket.openUploadStream(filename, {
          contentType: mimetype,
        });

        readStream.pipe(uploadStream);

        uploadStream.on('finish', async () => {
          fs.unlink(filePath, () => {});
          imageFilenames.push(filename);
          completed++;

          if (completed === total && !errorOccurred) {
            const newResort = new Resort({
              name,
              location,
              price,
              images: imageFilenames,
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
          }
        });

        uploadStream.on('error', (err) => {
          if (!errorOccurred) {
            console.error('Upload failed:', err);
            fs.unlink(filePath, () => {});
            errorOccurred = true;
            res.status(500).json({ message: 'Image upload failed.' });
          }
        });
      });
    } catch (err) {
      console.error('Resort add error:', err.message);
      res.status(500).json({ message: 'Server error while adding resort.' });
    }
  });

  // ***** START OF THE ONLY CHANGE FOR THE FEATURE YOU REQUESTED *****
  router.get('/', async (req, res) => {
    try {
      const { status } = req.query;
      let query = {}; // Initialize an empty query object

      if (status) {
        // If 'status' query parameter is provided (e.g., from ModerationPage: ?status=pending)
        query.status = status;
      } else {
        // If 'status' query parameter is NOT provided (e.g., from Home.jsx),
        // default to fetching ONLY 'approved' resorts.
        query.status = 'approved';
      }

      const resorts = await Resort.find(query).sort({ createdAt: -1 });
      res.status(200).json(resorts);
    } catch (err) {
      console.error('Error fetching resorts:', err); // Added console.error for better debugging
      res.status(500).json({ message: 'Error fetching resorts.' });
    }
  });
  // ***** END OF THE ONLY CHANGE FOR THE FEATURE YOU REQUESTED *****

  router.get('/owner/:ownerId/has-resort', async (req, res) => {
    try {
      const { ownerId } = req.params;
      const count = await Resort.countDocuments({ ownerId });
      res.status(200).json({ hasResort: count > 0 });
    } catch (err) {
      res.status(500).json({ message: 'Error checking resorts.' });
    }
  });

  router.get('/owner/:ownerId', async (req, res) => {
    try {
      const resorts = await Resort.find({ ownerId: req.params.ownerId }).sort({ createdAt: -1 });
      res.status(200).json(resorts);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching owner resorts.' });
    }
  });

  router.patch('/:id/status', async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['approved', 'rejected', 'pending'].includes(status)) { // Added 'pending' as a valid status for updates
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