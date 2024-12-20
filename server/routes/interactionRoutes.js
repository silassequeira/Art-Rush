const express = require('express');
const router = express.Router();
const { ObjectId } = require('../database.js');
const User = require('../models/User.js');


// Route to fetch saved paintings
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, error: 'Invalid user ID' });
        }

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


router.get('/:userId/countSaved', async (req, res) => {
    try {
        const { userId } = req.params; // Get userId from route parameters

        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, error: 'Invalid user ID' });
        }

        const count = await User.countSaved(userId);
        res.json({ success: true, count: parseInt(count, 10) });
    } catch (error) {
        console.error('Error retrieving saved artworks count:', error);
        res.status(500).json({ success: false, error: 'Error retrieving saved artworks count.' });
    }
});

router.get('/:userId/filter', async (req, res) => {
    const { userId } = req.params;
    const { artistDisplayName, artistNationality, objectDate, medium } = req.query;

    try {
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, error: 'Invalid user ID' });
        }

        const userObjectId = new ObjectId(userId);
        const user = await User.getSavedPaintings(userObjectId);

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // Construct filters
        let filters = {
            _id: { $in: user.savedPaintingIds }
        };

        if (artistDisplayName) {
            filters.artistDisplayName = { $regex: artistDisplayName, $options: 'i' };
        }

        if (artistNationality) {
            filters.artistNationality = { $regex: artistNationality, $options: 'i' };
        }

        if (objectDate) {
            filters.objectDate = { $regex: objectDate, $options: 'i' };
        }

        if (medium) {
            filters.medium = { $regex: medium, $options: 'i' };
        }

        const paintings = await Painting.find(filters);

        if (paintings.length === 0) {
            return res.status(404).json({ message: 'No paintings found with the applied filters.' });
        }

        res.status(200).json(paintings);
    } catch (error) {
        console.error('Error applying filters:', error);
        res.status(500).json({ error: 'Error fetching paintings with filters.' });
    }
});


module.exports = router;