// server/routes/wishlistRoutes.js
const express = require('express');
const mongoose = require('mongoose'); // Needed for mongoose.Types.ObjectId.isValid
const User = require('../models/users'); // Path to your consolidated User model
const Resort = require('../models/resort'); // Path to your Resort model

// CORRECT IMPORT: Destructure 'protect' function. 'authMiddleware' variable no longer exists.
const { protect } = require('../middleware/authMiddleware'); 

const router = express.Router();

// GET user's wishlist IDs (for frontend to check initial favorite status)
// This will return an array of resort IDs currently in the user's wishlist
// CHANGE: Use 'protect' instead of 'authMiddleware'
router.get('/status', protect, async (req, res) => { // <--- CHANGED THIS LINE
    try {
        const user = await User.findById(req.user.id).select('wishlist');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json(user.wishlist); // Return array of ObjectIds
    } catch (error) {
        console.error('Error fetching wishlist status for user %s: %s', req.user.id, error.message);
        res.status(500).json({ message: 'Failed to fetch wishlist status.', error: error.message });
    }
});

// GET user's full wishlist (populated with resort details)
// This will return the actual resort objects for a dedicated wishlist page
// CHANGE: Use 'protect' instead of 'authMiddleware'
router.get('/', protect, async (req, res) => { // <--- CHANGED THIS LINE
    try {
        // Populate the wishlist array with actual Resort documents
        // Using .lean() for faster query if you don't need Mongoose document methods
        const user = await User.findById(req.user.id).populate({
            path: 'wishlist',
            model: 'Resort' // Explicitly define the model if 'ref' is not enough
        }).lean();
        
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json(user.wishlist);
    } catch (error) {
        console.error('Error fetching user wishlist for user %s: %s', req.user.id, error.message);
        res.status(500).json({ message: 'Failed to fetch wishlist.', error: error.message });
    }
});

// POST to add a resort to wishlist
// CHANGE: Use 'protect' instead of 'authMiddleware'
router.post('/:resortId', protect, async (req, res) => { // <--- CHANGED THIS LINE
    try {
        const { resortId } = req.params;

        // Validate resortId format
        if (!mongoose.Types.ObjectId.isValid(resortId)) {
            return res.status(400).json({ message: 'Invalid resort ID format.' });
        }

        // Check if the resort actually exists and is approved
        const resortExists = await Resort.findById(resortId);
        if (!resortExists || resortExists.status !== 'approved') {
            return res.status(404).json({ message: 'Resort not found or not available for wishlisting.' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Add to wishlist if not already present
        // Convert to string for comparison to avoid ObjectId vs string issues
        if (!user.wishlist.map(id => id.toString()).includes(resortId)) {
            user.wishlist.push(resortId);
            await user.save();
            return res.status(200).json({ message: 'Resort added to wishlist.', wishlist: user.wishlist });
        } else {
            return res.status(200).json({ message: 'Resort already in wishlist.', wishlist: user.wishlist });
        }

    } catch (error) {
        console.error('Error adding resort %s to wishlist for user %s: %s', req.params.resortId, req.user.id, error.message);
        res.status(500).json({ message: 'Failed to add resort to wishlist.', error: error.message });
    }
});

// DELETE to remove a resort from wishlist
// CHANGE: Use 'protect' instead of 'authMiddleware'
router.delete('/:resortId', protect, async (req, res) => { // <--- CHANGED THIS LINE
    try {
        const { resortId } = req.params;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Filter out the resortId
        const initialLength = user.wishlist.length;
        user.wishlist = user.wishlist.filter(id => id.toString() !== resortId);
        
        if (user.wishlist.length < initialLength) { // Only save if a change occurred
            await user.save();
            return res.status(200).json({ message: 'Resort removed from wishlist.', wishlist: user.wishlist });
        } else {
            return res.status(200).json({ message: 'Resort not found in wishlist.', wishlist: user.wishlist });
        }

    } catch (error) {
        console.error('Error removing resort %s from wishlist for user %s: %s', req.params.resortId, req.user.id, error.message);
        res.status(500).json({ message: 'Failed to remove resort from wishlist.', error: error.message });
    }
});

module.exports = router;