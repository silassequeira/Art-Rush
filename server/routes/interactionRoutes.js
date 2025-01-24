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

// Route for fetching saved paintings
router.get('/:userId/favorite', async (req, res) => {
    const { userId } = req.params;

    if (!ObjectId.isValid(userId)) {
        return res.status(400).json({ success: false, error: 'Invalid user ID' });
    }

    const favoritePaintings = await User.getFavoritePaintings(userId);

    res.status(200).json({
        success: true,
        data: favoritePaintings,
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

// Route for saved paintings count
router.get('/:userId/countFavorite', async (req, res) => {
    const { userId } = req.params; // Get userId from route parameters

    if (!ObjectId.isValid(userId)) {
        return res.status(400).json({ success: false, error: 'Invalid user ID' });
    }

    const count = await User.countFavorite(userId);
    res.json({ success: true, count: parseInt(count, 10) });
});

// Route for saved paintings count
router.get('/:userId/countSavedArtists', async (req, res) => {
    const { userId } = req.params; // Get userId from route parameters

    if (!ObjectId.isValid(userId)) {
        return res.status(400).json({ success: false, error: 'Invalid user ID' });
    }

    const count = await User.countSavedArtists(userId);
    res.json({ success: true, count: parseInt(count, 10) });
});

// Route for checking if a painting is saved
router.get('/:userId/:paintingId/checkSaved', async (req, res) => {
    const { userId, paintingId } = req.params; // Get userId and paintingId from route parameters

    // Validate userId and paintingId
    if (!ObjectId.isValid(userId) || !ObjectId.isValid(paintingId)) {
        return res.status(400).json({ success: false, error: 'Invalid user ID or painting ID' });
    }

    try {
        const saved = await User.checkSavedState(userId, paintingId); // Call checkSaved with both parameters
        res.json({ success: true, saved });
    } catch (error) {
        console.error('Error checking if painting is saved:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Route for checking if a painting is favorite
router.get('/:userId/:paintingId/checkFavorite', async (req, res) => {
    const { userId, paintingId } = req.params; // Get userId and paintingId from route parameters

    // Validate userId and paintingId
    if (!ObjectId.isValid(userId) || !ObjectId.isValid(paintingId)) {
        return res.status(400).json({ success: false, error: 'Invalid user ID or painting ID' });
    }

    try {
        const favorite = await User.checkFavoriteState(userId, paintingId); // Call checkFavorite with both parameters
        res.json({ success: true, favorite });
    } catch (error) {
        console.error('Error checking if painting is favorite:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Route to get distinct nationalities of the saved paintings
router.get('/:userId/nationalities', async (req, res) => {
    const { userId } = req.params;

    try {
        const nationalities = await User.filterSavedNationalities(userId);
        res.status(200).json({ success: true, nationalities });
    } catch (error) {
        console.error('Error fetching saved nationalities:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Route to get distinct mediums of the saved paintings
router.get('/:userId/mediums', async (req, res) => {
    const { userId } = req.params;

    try {
        const mediums = await User.filterSavedMediums(userId);
        res.status(200).json({ success: true, mediums });
    } catch (error) {
        console.error('Error fetching saved mediums:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Route to get distinct artists of the saved paintings
router.get('/:userId/artists', async (req, res) => {
    const { userId } = req.params;

    try {
        const artists = await User.filterSavedArtists(userId);
        res.status(200).json({ success: true, artists });
    } catch (error) {
        console.error('Error fetching saved artists:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});


module.exports = router;