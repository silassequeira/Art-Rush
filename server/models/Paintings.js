const { getDB } = require('../database');

class Painting {

    // Function to fetch all paintings for the infinite scroll 
    static async getAllPaintingsWithPagination({ page = 1, limit = 10 }) {
        const db = getDB();
        const paintingsCollection = db.collection('paintings');
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        const paintings = await paintingsCollection
            .find()
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber)
            .toArray();

        const total = await paintingsCollection.countDocuments();

        return { total, page: pageNumber, limit: limitNumber, data: paintings };
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