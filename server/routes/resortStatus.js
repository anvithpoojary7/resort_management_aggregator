// server/routes/resortStatus.js
const express = require('express');
const router = express.Router();
const Resort = require('../models/resort'); // adjust the path if needed

// PATCH /api/admin/resorts/visibility/:id
router.patch('/visibility/:id', async (req, res) => {
  const { id } = req.params;
  const { isVisible } = req.body;

  try {
    const resort = await Resort.findById(id);
    if (!resort) return res.status(404).json({ message: 'Resort not found' });

    resort.visible = isVisible;
    await resort.save();

    res.json({ message: 'Visibility updated successfully', resort });
  } catch (error) {
    console.error('Error updating visibility:', error);
    res.status(500).json({ message: 'Server error while updating visibility' });
  }
});

module.exports = router;
