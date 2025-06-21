const express = require('express');
const router = express.Router();

// Sample dummy data or fetch from DB
router.get('/', async (req, res) => {
  res.json([
    { name: 'Palm Paradise', location: 'Goa', rating: 4.7 },
    { name: 'Himalayan Haven', location: 'Manali', rating: 4.9 }
  ]);
});

module.exports = router;
