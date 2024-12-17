const { getDB } = require('../database');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');

class User {

    static async create(username, password, fullname) {
        const db = getDB();
        const usersCollection = db.collection('users');

        // Check if user exists
        const userExists = await usersCollection.findOne({ username });
        if (userExists) {
            throw new Error('User already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const newUser = {
            username,
            password: hashedPassword,
            fullName: fullname,
            interactions: []
        };

        await usersCollection.insertOne(newUser);
        return newUser;
    }

    static async findByUsername(username) {
        const db = getDB();
        return await db.collection('users').findOne({ username });
    }

    static async updateProfile(username, updates) {
        const db = getDB();
        const usersCollection = db.collection('users');

        // If password is being updated, hash it
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        return await usersCollection.findOneAndUpdate(
            { username },
            { $set: updates },
            { returnDocument: 'after' }
        );
    }

    static async deleteAccount(username) {
        const db = getDB();
        return await db.collection('users').deleteOne({ username });
    }

    static async addInteraction(userId, paintingId, saved) {
        const db = getDB();
        const usersCollection = db.collection('users');
        const paintingsCollection = db.collection('paintings');

        try {
            const painting = await paintingsCollection.findOne({ _id: new ObjectId(paintingId) });
            if (!painting) {
                throw new Error('Painting not found');
            }

            const interaction = {
                paintingId: painting._id,
                saved: saved
            };

            const result = await usersCollection.updateOne(
                { _id: new ObjectId(userId) },
                { $push: { interactions: interaction } }
            );

            console.log("Database update result:", result);
            return result;
        } catch (error) {
            console.error("Error in addInteraction:", error);
            throw error;
        }
    }

    static async updateInteraction(userId, paintingId, saved) {
        const db = getDB();
        const usersCollection = db.collection('users');
        const paintingsCollection = db.collection('paintings');

        try {
            const painting = await paintingsCollection.findOne({ _id: new ObjectId(paintingId) });
            if (!painting) {
                throw new Error('Painting not found');
            }

            const result = await usersCollection.updateOne(
                { _id: new ObjectId(userId), "interactions.paintingId": new ObjectId(paintingId) },
                { $set: { "interactions.$.saved": saved } }
            );

            console.log("Database update result:", result);
            return result;
        } catch (error) {
            console.error("Error in updateInteraction:", error);
            throw error;
        }
    }
}

module.exports = User;