const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017'; // Database URL
const dbName = 'art_rush'; // Database name

let db;

async function connectToMongoDB() {
    try {
        const client = new MongoClient(url);

        // Connect to the MongoDB server
        await client.connect();
        console.log('Connected to MongoDB!');

        // Select the database
        db = client.db(dbName);

        // Check and setup indexes only if they are missing
        await ensureIndexes(db);

        return db;
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    }
}

async function ensureIndexes(database) {
    try {
        // Ensure 'users' collection and indexes
        const usersCollection = database.collection('users');
        const usersIndexes = await usersCollection.listIndexes().toArray();
        const hasUsernameIndex = usersIndexes.some(index => index.key && index.key.username === 1);

        if (!hasUsernameIndex) {
            await usersCollection.createIndex({ username: 1 }, { unique: true });
            console.log("Index created on 'username'");
        } else {
            console.log("Index on 'username' already exists");
        }

        // Ensure 'paintings' collection and indexes
        const collections = await database.listCollections({ name: 'paintings' }).toArray();
        let paintingsCollection;

        if (collections.length === 0) {
            paintingsCollection = await database.createCollection('paintings');
            console.log("Paintings collection created");
        } else {
            paintingsCollection = database.collection('paintings');
        }

        // Ensure indexes for 'paintings'
        const paintingsIndexes = await paintingsCollection.listIndexes().toArray();
        const hasObjectIdIndex = paintingsIndexes.some(index => index.key && index.key.ObjectId === 1);

        if (!hasObjectIdIndex) {
            await paintingsCollection.createIndex({ ObjectId: 1 }, { unique: true });
            console.log("Unique index created on 'ObjectId' for paintings");
        } else {
            console.log("Index on 'ObjectId' already exists");
        }

        const hasTextIndex = paintingsIndexes.some(index => index.key && index.key._fts === 'text');

        if (!hasTextIndex) {
            await paintingsCollection.createIndex(
                { title: 'text', artist: 'text' },
                {
                    name: 'title_artist_text_index',
                    weights: { title: 3, artist: 2 },
                }
            );
            console.log("Text index created on 'title' and 'artist'");
        } else {
            console.log("Text index already exists");
        }
    } catch (error) {
        console.error("Error ensuring indexes:", error);
    }
}

function getDB() {
    if (!db) {
        throw new Error('Database not initialized. Call connectToMongoDB first.');
    }
    return db;
}

module.exports = {
    connectToMongoDB,
    getDB
};