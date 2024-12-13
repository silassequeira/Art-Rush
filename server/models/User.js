const { getDB } = require('../config/database');
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
            fullName: fullname
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
}

module.exports = User;