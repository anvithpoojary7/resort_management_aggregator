

const express = require('express');
const router = express.Router();
const Resort = require('../models/resort');

router.get('/', async (req, res) => {
    try {
        
        const resorts = await Resort.find({}).populate('ownerId', 'name');
        res.status(200).json(resorts);
    } catch (error) {
        console.error("Error fetching all resorts for admin:", error);
        res.status(500).json({ message: "Server error while fetching resorts" });
    }
});

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

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // CHANGE basePrice to price here
    const { name, location, price } = req.body;

    // UPDATE validation to check for price
    if (!name || !location || price === undefined) {
      return res.status(400).json({ message: "Missing required fields: name, location, price" });
    }

    const updatedResort = await Resort.findByIdAndUpdate(
      id,
      // CHANGE basePrice to price in the $set object
      { $set: { name, location, price } },
      { new: true }
    );

    if (!updatedResort) {
      return res.status(404).json({ message: "Resort not found" });
    }
    
    res.status(200).json({ message: "Resort updated successfully ✅", resort: updatedResort });

  } catch (error) {
    console.error("Error updating resort:", error);
    res.status(500).json({ message: "Failed to update resort ❌" });
  }
});

module.exports=router;