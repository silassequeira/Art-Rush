const { ObjectId } = require('../database.js');
const User = require('../models/User.js');
const express = require('express');
const router = express.Router();


// Route for fetching saved paintings
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    if (!ObjectId.isValid(userId)) {
        return res.status(400).json({ success: false, error: 'Invalid user ID' });
    }

    const savedPaintings = await User.getSavedPaintings(userId);

    res.status(200).json({
        success: true,
        data: savedPaintings,
    });
});

// Route for saved paintings count
router.get('/:userId/countSaved', async (req, res) => {
    const { userId } = req.params; // Get userId from route parameters

    if (!ObjectId.isValid(userId)) {
        return res.status(400).json({ success: false, error: 'Invalid user ID' });
    }

    const count = await User.countSaved(userId);
    res.json({ success: true, count: parseInt(count, 10) });
});

module.exports = router;