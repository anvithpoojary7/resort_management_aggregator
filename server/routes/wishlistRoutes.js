// server/routes/wishlistRoutes.js
const express = require('express');
const mongoose = require('mongoose'); // Needed for mongoose.Types.ObjectId.isValid
const User = require('../models/users'); // Path to your consolidated User model
const Resort = require('../models/resort'); // Path to your Resort model


const { protect } = require('../middleware/authMiddleware'); // Assuming this path is correct

const router = express.Router();

// @desc    Get user's wishlist IDs (for frontend to check initial favorite status)
// @route   GET /api/wishlist/status
// @access  Private
router.get('/status', protect, async (req, res) => {
    try {
        // Use req.user._id as per how your authMiddleware attaches the user
        const user = await User.findById(req.user._id).select('wishlist');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        // Return array of ObjectIds. Mongoose will automatically convert them to strings for JSON response
        res.status(200).json(user.wishlist);
    } catch (error) {
        console.error('Error fetching wishlist status for user %s: %s', req.user._id, error.message);
        res.status(500).json({ message: 'Failed to fetch wishlist status.', error: error.message });
    }
});

// @desc    Get user's full wishlist (populated with resort details)
// @route   GET /api/wishlist
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        // Use req.user._id
        // Populate the wishlist array with actual Resort documents
        // Using .lean() for faster query if you don't need Mongoose document methods
        const user = await User.findById(req.user._id).populate({
            path: 'wishlist',
            model: 'Resort' // Explicitly define the model if 'ref' is not enough
        }).lean(); // .lean() converts Mongoose documents to plain JavaScript objects

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Filter out any null resorts (if a resort was deleted but its ID remained in wishlist)
        const validWishlist = user.wishlist.filter(item => item !== null);

        res.status(200).json(validWishlist);
    } catch (error) {
        console.error('Error fetching user wishlist for user %s: %s', req.user._id, error.message);
        res.status(500).json({ message: 'Failed to fetch wishlist.', error: error.message });
    }
});

// @desc    Add a resort to wishlist
// @route   POST /api/wishlist/:resortId
// @access  Private
router.post('/:resortId', protect, async (req, res) => {
    try {
        const { resortId } = req.params;

        // Validate resortId format
        if (!mongoose.Types.ObjectId.isValid(resortId)) {
            return res.status(400).json({ message: 'Invalid resort ID format.' });
        }

        // Check if the resort actually exists and is approved (good check!)
        const resortExists = await Resort.findById(resortId);
        if (!resortExists || resortExists.status !== 'approved') {
            return res.status(404).json({ message: 'Resort not found or not available for wishlisting.' });
        }

        // Use req.user._id
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Add to wishlist if not already present
        // Convert existing wishlist IDs to string for reliable comparison
        if (!user.wishlist.map(id => id.toString()).includes(resortId)) {
            user.wishlist.push(resortId);
            await user.save();
            // Return the updated list of IDs, or a success message
            return res.status(200).json({ message: 'Resort added to wishlist.', wishlist: user.wishlist.map(id => id.toString()) });
        } else {
            // If already in wishlist, still return success but inform
            return res.status(200).json({ message: 'Resort already in wishlist.', wishlist: user.wishlist.map(id => id.toString()) });
        }

    } catch (error) {
        console.error('Error adding resort %s to wishlist for user %s: %s', req.params.resortId, req.user._id, error.message);
        res.status(500).json({ message: 'Failed to add resort to wishlist.', error: error.message });
    }
});

// @desc    Remove a resort from wishlist
// @route   DELETE /api/wishlist/:resortId
// @access  Private
router.delete('/:resortId', protect, async (req, res) => {
    try {
        const { resortId } = req.params;

        // Use req.user._id
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Filter out the resortId
        const initialLength = user.wishlist.length;
        user.wishlist = user.wishlist.filter(id => id.toString() !== resortId);
        
        if (user.wishlist.length < initialLength) { // Only save if a change occurred
            await user.save();
            return res.status(200).json({ message: 'Resort removed from wishlist.', wishlist: user.wishlist.map(id => id.toString()) });
        } else {
            // If not found in wishlist, still return success but inform
            return res.status(200).json({ message: 'Resort not found in wishlist.', wishlist: user.wishlist.map(id => id.toString()) });
        }

    } catch (error) {
        console.error('Error removing resort %s from wishlist for user %s: %s', req.params.resortId, req.user._id, error.message);
        res.status(500).json({ message: 'Failed to remove resort from wishlist.', error: error.message });
    }
});

module.exports = router;