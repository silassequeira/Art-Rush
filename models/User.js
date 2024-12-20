const { getDB, ObjectId } = require('../database');
const bcrypt = require('bcryptjs');

class User {

    static async create(username, password, fullname) {
        const db = getDB();
        const usersCollection = db.collection('users');

        const userExists = await usersCollection.findOne({ username });
        if (userExists) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            username,
            password: hashedPassword,
            fullName: fullname,
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

            const result = await usersCollection.updateOne(
                { _id: new ObjectId(userId) },
                {
                    $set: {
                        [paintingId]: {
                            paintingId: painting._id,
                            saved: saved
                        }
                    }
                }
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
                { _id: new ObjectId(userId) },
                {
                    $set: {
                        [`${paintingId}.saved`]: saved
                    }
                }
            );

            console.log("Database update result:", result);
            return result;
        } catch (error) {
            console.error("Error in updateInteraction:", error);
            throw error;
        }
    }

    static async getSavedPaintings(userId) {
        const db = getDB();
        const usersCollection = db.collection('users');
        const paintingsCollection = db.collection('paintings');

        const userObjectId = new ObjectId(userId);

        const user = await usersCollection.findOne({ _id: userObjectId });
        if (!user) {
            throw new Error('User not found');
        }

        const savedPaintingIds = Object.keys(user)
            .filter(key => user[key].saved === true)
            .map(key => {
                const paintingId = user[key].paintingId;
                if (!ObjectId.isValid(paintingId)) {
                    throw new Error(`Invalid painting ID: ${paintingId}`);
                }
                return new ObjectId(paintingId);
            });

        if (savedPaintingIds.length === 0) {
            console.log('No saved paintings found.');
            return []; 
        }

        const savedPaintings = await paintingsCollection
            .find({ _id: { $in: savedPaintingIds } })
            .toArray();

        const filteredPaintings = savedPaintings.filter(painting =>
            savedPaintingIds.some(id => id.equals(painting._id))
        );

        return filteredPaintings;
    }

    static async countSaved(userId) {
        const db = getDB();
        const usersCollection = db.collection('users');

        if (!ObjectId.isValid(userId)) {
            throw new Error('Invalid user ID');
        }
        const userObjectId = new ObjectId(userId);

        const user = await usersCollection.findOne({ _id: userObjectId });
        if (!user) {
            throw new Error('User not found');
        }

        const savedPaintingIds = Object.keys(user)
            .filter(key => user[key].saved === true)
            .map(key => {
                if (!ObjectId.isValid(user[key].paintingId)) {
                    throw new Error(`Invalid painting ID: ${user[key].paintingId}`);
                }
                return new ObjectId(user[key].paintingId);
            });

        if (savedPaintingIds.length === 0) {
            console.log('No saved paintings found.');
            return 0; 
        }

        const paintingsCollection = db.collection('paintings');
        const count = await paintingsCollection.countDocuments({
            _id: { $in: savedPaintingIds },
        });

        console.log(`User ${userId} has ${count} saved paintings.`);
        return count;
    }

}

module.exports = User;