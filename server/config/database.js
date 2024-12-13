const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017'; // Changed to default MongoDB port
const dbName = 'art_rush';

let db;

async function connectToMongoDB() {
    try {
        const client = new MongoClient(url);

        await client.connect();
        console.log('Connected to MongoDB!');

        db = client.db(dbName);

        // Setup indexes
        await setupIndexes(db);

        return db;
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    }
}

async function setupIndexes(database) {
    try {
        const usersCollection = database.collection('users');
        await usersCollection.createIndex({ username: 1 }, { unique: true });
        console.log("Index created on 'username'");
    } catch (error) {
        console.error("Error creating index:", error);
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