const { MongoClient } = require('mongodb');

let db;

const url = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'art_rush';

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
        const usersCount = await usersCollection.countDocuments();
        if (usersCount === 0) {
            await usersCollection.insertOne({ _id: 'dummy' });
            await usersCollection.deleteOne({ _id: 'dummy' });
            console.log("Collection 'users' created.");
        } else {
            console.log("Collection 'users' already exists.");
        }

        const usersIndexes = await usersCollection.listIndexes().toArray();
        const hasUsernameIndex = usersIndexes.some(index => index.key && index.key.username === 1);

        if (!hasUsernameIndex) {
            await usersCollection.createIndex({ username: 1 }, { unique: true });
            console.log("Index created on 'username'");
        } else {
            console.log("Index on 'username' already exists");
        }

        // Ensure 'paintings' collection and indexes
        const paintingsCollection = database.collection('paintings');
        const paintingsCount = await paintingsCollection.countDocuments();
        if (paintingsCount === 0) {
            await paintingsCollection.insertOne({ _id: 'dummy' });
            await paintingsCollection.deleteOne({ _id: 'dummy' });
            console.log("Collection 'paintings' created.");
        } else {
            console.log("Collection 'paintings' already exists.");
        }

        const paintingsIndexes = await paintingsCollection.listIndexes().toArray();
        const hasPaintingIndex = paintingsIndexes.some(index => index.key && index.key.objectID === 1);

        if (!hasPaintingIndex) {
            await paintingsCollection.createIndex({ objectID: 1 }, { unique: true });
            console.log("Index created on 'objectID'");
        } else {
            console.log("Index on 'objectID' already exists");
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