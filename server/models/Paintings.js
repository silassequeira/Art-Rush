const { getDB } = require('../database');

class Painting {

    static cache = {
        data: null,
        timestamp: null,
    };

    static fetchedPaintings = new Set(); // Track fetched painting IDs

    // Function to fetch all paintings for the infinite scroll 
    static async getAllPaintingsWithPagination({ page = 1, limit = 10, excludeIds = [] }) {
        const db = getDB();
        const paintingsCollection = db.collection('paintings');
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        // Calculate the number of documents to skip
        const skipNumber = (pageNumber - 1) * limitNumber;

        // Check if the cache is valid (within the last hour)
        const now = new Date();
        if (Painting.cache.timestamp && (now - Painting.cache.timestamp) < 1800000) { // 30 minutes in milliseconds
            // Cache is valid, return the cached data
            const cachedData = Painting.cache.data.slice(skipNumber, skipNumber + limitNumber);
            return { total: Painting.cache.data.length, page: pageNumber, limit: limitNumber, data: cachedData };
        }

        // Cache is invalid, fetch new data and randomize
        const total = await paintingsCollection.countDocuments();
        const paintings = await paintingsCollection.aggregate([
            { $match: { _id: { $nin: excludeIds.map(id => new ObjectId(id)) } } }, // Exclude already fetched paintings
            { $sample: { size: total } }, // Randomize all paintings
        ]).toArray();

        // Update the cache
        Painting.cache.data = paintings;
        Painting.cache.timestamp = now;

        // Track fetched painting IDs
        paintings.forEach(painting => Painting.fetchedPaintings.add(painting._id));

        // Return the paginated data
        const paginatedData = paintings.slice(skipNumber, skipNumber + limitNumber);
        return { total, page: pageNumber, limit: limitNumber, data: paginatedData };
    }

    static async getPaintingById(id) {
        try {
            const db = getDB();
            const paintingsCollection = db.collection('paintings'); // Ensure getCollection is implemented to return the paintings collection
            const painting = await paintingsCollection.findOne({ _id: new ObjectId(id) });

            if (!painting) {
                throw new Error('Painting not found');
            }

            return painting; // Return the painting data to the caller
        } catch (error) {
            throw new Error(`Failed to retrieve painting by ID: ${error.message}`);
        }
    }
}


module.exports = Painting;