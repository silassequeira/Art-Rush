const Paintings = require('../models/Paintings.js');
const express = require('express');

const router = express.Router();

// GET /paintings - Fetch all paintings
router.get('/paintings', async (req, res) => {
    try {
        // Use the findPaintings method from the Paintings model
        const paintings = await Paintings.findPaintings();
        res.status(200).json({
            message: 'Paintings fetched successfully',
            paintings,
        });
    } catch (error) {
        console.error('Error fetching paintings:', error);
        res.status(500).json({ error: 'Failed to fetch paintings' });
    }
});

// GET /paintings/:objectId - Fetch a specific painting by ID
router.get('/paintings/:objectId', async (req, res) => {
    try {
        const objectId = req.params.objectId;
        const painting = await Paintings.findPaintingById(objectId);

        if (!painting) {
            return res.status(404).json({ error: 'Painting not found' });
        }

        res.status(200).json({
            message: 'Painting fetched successfully',
            painting,
        });
    } catch (error) {
        console.error('Error fetching painting:', error);
        res.status(500).json({ error: 'Failed to fetch painting' });
    }
});

// POST /paintings - Add a new painting
router.post('/paintings', async (req, res) => {
    console.log('Request received at POST /paintings with body:', req.body);
    try {
        const newPainting = req.body;

        // Validate required fields
        if (!newPainting.ObjectId || !newPainting.title || !newPainting.medium) {
            console.error('Validation failed for new painting:', newPainting);
            return res.status(400).json({ error: 'Missing required painting fields' });
        }

        // Use the createPainting method from the Paintings model
        const result = await Paintings.createPainting(newPainting);

        console.log('Painting created with result:', result);
        res.status(201).json({
            message: 'Painting added successfully',
            painting: newPainting,
            insertedId: result.insertedId,
        });
    } catch (error) {
        console.error('Error in POST /paintings route:', error);
        res.status(500).json({ error: 'Failed to add painting' });
    }
});

module.exports = router;