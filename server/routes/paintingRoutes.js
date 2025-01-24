const Painting = require('../models/Paintings.js');
const express = require('express');

const router = express.Router();

// Route for fetching all paintings
router.get('/', async (req, res) => {
    const { page = 1, limit = 8 } = req.query;

    const response = await Painting.getAllPaintingsWithPagination({ page, limit });
    res.status(200).json({
        success: true,
        ...response,
    });
});

// Route for fetching a single painting
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const painting = await Painting.getPaintingById(id);
        res.status(200).json({
            success: true,
            data: painting,
        });
    } catch (error) {
        console.error('Error fetching painting:', error);

        if (error.message === 'Painting not found') {
            return res.status(404).json({
                success: false,
                error: 'Painting not found.',
            });
        }

        res.status(500).json({
            success: false,
            error: 'Error fetching painting.',
        });
    }
});

module.exports = router;
