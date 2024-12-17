const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        // Construct the full file path
        const filePath = path.join('C:', 'Users', 'silas', 'Web-Development', 'server', 'paintings.json');

        // Read the file contents
        const fileContents = await fs.readFile(filePath, 'utf8');

        // Parse the JSON content
        const paintings = JSON.parse(fileContents);

        // Optional: Add filtering or pagination logic
        const { page = 1, limit = 10, artist } = req.query;

        // Basic filtering by artist if query parameter is provided
        let filteredPaintings = paintings;
        if (artist) {
            filteredPaintings = paintings.filter(painting =>
                painting.artistDisplayName.toLowerCase().includes(artist.toLowerCase())
            );
        }

        // Basic pagination
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const paginatedPaintings = filteredPaintings.slice(startIndex, endIndex);

        res.json({
            success: true,
            total: filteredPaintings.length,
            page: parseInt(page),
            limit: parseInt(limit),
            data: paginatedPaintings
        });
    } catch (error) {
        console.error('Error retrieving paintings:', error);

        // Determine appropriate error response
        if (error.code === 'ENOENT') {
            res.status(404).json({
                success: false,
                error: 'Paintings file not found',
                statusCode: 404
            });
        } else {
            res.status(500).json({
                success: false,
                error: 'Failed to retrieve paintings',
                details: error.message,
                statusCode: 500
            });
        }
    }
});

// Optional: Route to get a specific painting by ID
router.get('/:id', async (req, res) => {
    try {
        const filePath = path.join('C:', 'Users', 'silas', 'Web-Development', 'server', 'paintings.json');
        const fileContents = await fs.readFile(filePath, 'utf8');
        const paintings = JSON.parse(fileContents);

        const painting = paintings.find(p => p.ObjectId === parseInt(req.params.id));

        if (!painting) {
            return res.status(404).json({
                success: false,
                error: 'Painting not found',
                statusCode: 404
            });
        }

        res.json({
            success: true,
            data: painting
        });
    } catch (error) {
        console.error('Error retrieving painting:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve painting',
            details: error.message,
            statusCode: 500
        });
    }
});

module.exports = router;