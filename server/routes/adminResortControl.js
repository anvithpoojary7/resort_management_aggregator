// routes/adminResortControl.js

const express = require('express');
const router = express.Router();
const Resort = require('../models/resort');

// PATCH route to toggle visibility
router.patch('/visibility/:resortId', async (req, res) => {
  const { resortId } = req.params;
  const { isVisible } = req.body;

  try {
    const updatedResort = await Resort.findByIdAndUpdate(
      resortId,
      { isVisible },
      { new: true }
    );

    if (!updatedResort) {
      return res.status(404).json({ message: 'Resort not found' });
    }

    res.status(200).json({ message: 'Visibility updated', resort: updatedResort });
  } catch (err) {
    console.error('Error updating visibility:', err);
    res.status(500).json({ message: 'Server error while updating visibility' });
  }
});

module.exports = router;
