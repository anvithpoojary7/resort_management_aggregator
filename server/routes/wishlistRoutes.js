
const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/users'); 
const Resort = require('../models/resort'); 


const { protect } = require('../middleware/authMiddleware'); 

const router = express.Router();


router.get('/status', protect, async (req, res) => {
    try {
        
        const user = await User.findById(req.user._id).select('wishlist');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
    
        res.status(200).json(user.wishlist);
    } catch (error) {
        console.error('Error fetching wishlist status for user %s: %s', req.user._id, error.message);
        res.status(500).json({ message: 'Failed to fetch wishlist status.', error: error.message });
    }
});


router.get('/', protect, async (req, res) => {
    try {

        const user = await User.findById(req.user._id).populate({
            path: 'wishlist',
            model: 'Resort' 
        }).lean(); 

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        
        const validWishlist = user.wishlist.filter(item => item !== null);

        res.status(200).json(validWishlist);
    } catch (error) {
        console.error('Error fetching user wishlist for user %s: %s', req.user._id, error.message);
        res.status(500).json({ message: 'Failed to fetch wishlist.', error: error.message });
    }
});

router.post('/:resortId', protect, async (req, res) => {
    try {
        const { resortId } = req.params;

        
        if (!mongoose.Types.ObjectId.isValid(resortId)) {
            return res.status(400).json({ message: 'Invalid resort ID format.' });
        }

        
        const resortExists = await Resort.findById(resortId);
        if (!resortExists || resortExists.status !== 'approved') {
            return res.status(404).json({ message: 'Resort not found or not available for wishlisting.' });
        }

        
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        
        if (!user.wishlist.map(id => id.toString()).includes(resortId)) {
            user.wishlist.push(resortId);
            await user.save();

            return res.status(200).json({ message: 'Resort added to wishlist.', wishlist: user.wishlist.map(id => id.toString()) });
        } else {
            
            return res.status(200).json({ message: 'Resort already in wishlist.', wishlist: user.wishlist.map(id => id.toString()) });
        }

    } catch (error) {
        console.error('Error adding resort %s to wishlist for user %s: %s', req.params.resortId, req.user._id, error.message);
        res.status(500).json({ message: 'Failed to add resort to wishlist.', error: error.message });
    }
});


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
        
        if (user.wishlist.length < initialLength) {
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