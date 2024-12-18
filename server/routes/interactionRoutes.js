const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Assuming you have a User model

// Route to fetch saved paintings
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const savedPaintings = await User.getSavedPaintings(userId);

        res.status(200).json({
            success: true,
            data: savedPaintings,
        });
    } catch (error) {
        console.error('Error fetching saved paintings:', error);

        if (error.message === 'User not found') {
            return res.status(404).json({
                success: false,
                error: 'User not found',
            });
        }

        res.status(500).json({
            success: false,
            error: 'Server error',
        });
    }
});

module.exports = router;