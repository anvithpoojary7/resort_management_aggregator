const express = require("express");
const router=express.Router();
const Resort=require('../models/resort');

 router.get('/', async (req, res) => {
    try {
      const { status } = req.query;
      let query = {}; 

      if (status) {
        
        query.status = status;
      } else {
       
        query.status = 'approved';
      }
  
      const resorts = await Resort.find(query).sort({ createdAt: -1 });
      res.status(200).json(resorts);
    } catch (err) {
      console.error('Error fetching resorts:', err); 
      res.status(500).json({ message: 'Error fetching resorts.' });
    }
  });


  router.patch('/:id/status', async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['approved', 'rejected', 'pending'].includes(status)) { 
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

      res.status(200).json({ message: `Resort ${status}`, resort: updated });
    } catch (err) {
      res.status(500).json({ message: 'Error updating status.' });
    }
  });
  






module.exports = router;