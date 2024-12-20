const express = require('express');
const Painting = require('../models/Paintings.js');

const router = express.Router();

router.get('/', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const response = await Painting.getAllPaintingsWithPagination({ page, limit });
        res.status(200).json({
            success: true,
            ...response,
        });
    } catch (error) {
        console.error('Error fetching paintings with pagination:', error);
        res.status(500).json({
            success: false,
            error: 'Error fetching paintings with pagination.',
        });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params; // Use 'id' to match the parameter name in the route

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
