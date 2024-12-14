const { getDB } = require('../database');
const fs = require('fs').promises;
const path = require('path');
const { ObjectId } = require('mongodb');

class Paintings {
    constructor() {
        this.collectionName = 'paintings';
        this.paintingsPath = path.join(__dirname, '../paintings.json');
    }

    async initializeCollection() {
        try {
            const db = await getDB();

            // Check if collection exists
            const collections = await db.listCollections({ name: this.collectionName }).toArray();

            if (collections.length === 0) {
                console.log(`Creating collection: ${this.collectionName}`);

                // Resolve the correct path to paintings.json
                this.paintingsPath = path.resolve(__dirname, '..', 'paintings.json');
                console.log('Resolved path to paintings.json:', this.paintingsPath);

                // Check if the file exists
                const exists = await fs.access(this.paintingsPath).then(() => true).catch(() => false);
                if (!exists) {
                    throw new Error(`File not found: ${this.paintingsPath}`);
                }

                // Read and parse JSON
                const rawData = await fs.readFile(this.paintingsPath, 'utf-8');
                let paintingsData;

                try {
                    paintingsData = JSON.parse(rawData);
                    if (!Array.isArray(paintingsData)) {
                        throw new Error('Paintings data must be an array');
                    }
                } catch (error) {
                    throw new Error(`Error parsing JSON: ${error.message}`);
                }

                // Create collection and insert data
                const collection = db.collection(this.collectionName);
                if (paintingsData.length > 0) {
                    await collection.insertMany(paintingsData);
                    console.log(`Inserted ${paintingsData.length} documents into the paintings collection`);
                } else {
                    console.log('No paintings data found in JSON file');
                }
            } else {
                console.log('Paintings collection already exists');
            }
        } catch (error) {
            console.error('Error initializing paintings collection:', error.message);
            throw error;
        }
    }

    async findPaintings(query = {}, options = {}) {
        console.log('Finding paintings with query:', query, 'and options:', options);
        try {
            const db = await getDB();
            const collection = db.collection(this.collectionName);
            const results = await collection.find(query, options).toArray();
            console.log('Found paintings:', results);
            return results;
        } catch (error) {
            console.error('Error in findPaintings:', error);
            throw error;
        }
    }

    async findPaintingById(id) {
        try {
            const db = await getDB();
            const collection = db.collection(this.collectionName);

            // Handle different ID formats
            const filter = typeof id === 'number'
                ? { ObjectId: id }
                : { _id: new ObjectId(id) };

            return await collection.findOne(filter);
        } catch (error) {
            console.error('Error finding painting by ID:', error);
            throw error;
        }
    }

    async createPainting(paintingData) {
        try {
            const db = await getDB();
            const collection = db.collection(this.collectionName);

            // Ensure ObjectId is unique
            const existingPainting = await collection.findOne({ ObjectId: paintingData.ObjectId });
            if (existingPainting) {
                throw new Error('A painting with this ObjectId already exists');
            }

            return await collection.insertOne(paintingData);
        } catch (error) {
            console.error('Error creating painting:', error);
            throw error;
        }
    }
}

module.exports = new Paintings();