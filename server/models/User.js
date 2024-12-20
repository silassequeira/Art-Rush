const { getDB, ObjectId } = require('../database');
const bcrypt = require('bcryptjs');

class User {

    // Function to create a new user
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
        };

        await usersCollection.insertOne(newUser);
        return newUser;
    }

    static async findByUsername(username) {
        const db = getDB();
        return await db.collection('users').findOne({ username });
    }

    // Function to update the user profile 
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

    // Function that adds the interaction for saving paintings
    static async addInteraction(userId, paintingId, saved) {
        const db = getDB();
        const usersCollection = db.collection('users');
        const paintingsCollection = db.collection('paintings');

        try {
            const painting = await paintingsCollection.findOne({ _id: new ObjectId(paintingId) });
            if (!painting) {
                throw new Error('Painting not found');
            }

            // Set the painting data directly using paintingId as the key
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

    // Function that updates if the painting is saved or not
    static async updateInteraction(userId, paintingId, saved) {
        const db = getDB();
        const usersCollection = db.collection('users');
        const paintingsCollection = db.collection('paintings');

        try {
            const painting = await paintingsCollection.findOne({ _id: new ObjectId(paintingId) });
            if (!painting) {
                throw new Error('Painting not found');
            }

            // Update the painting data directly using paintingId as the key
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

    // Function that retrieves all of the saved paintings
    static async getSavedPaintings(userId) {
        const db = getDB();
        const usersCollection = db.collection('users');
        const paintingsCollection = db.collection('paintings');

        // Convert userId to ObjectId
        const userObjectId = new ObjectId(userId);

        // Fetch the user
        const user = await usersCollection.findOne({ _id: userObjectId });
        if (!user) {
            throw new Error('User not found');
        }

        // Extract and validate saved painting IDs
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
            return []; // Return an empty array if there are no saved paintings
        }

        // Fetch only the paintings that match the IDs exactly
        const savedPaintings = await paintingsCollection
            .find({ _id: { $in: savedPaintingIds } })
            .toArray();

        const filteredPaintings = savedPaintings.filter(painting =>
            savedPaintingIds.some(id => id.equals(painting._id))
        );

        return filteredPaintings;
    }

    // Function that counts the number of saved paintings
    static async countSaved(userId) {
        const db = getDB();
        const usersCollection = db.collection('users');

        // Validate and convert userId to ObjectId
        if (!ObjectId.isValid(userId)) {
            throw new Error('Invalid user ID');
        }
        const userObjectId = new ObjectId(userId);

        // Fetch the user
        const user = await usersCollection.findOne({ _id: userObjectId });
        if (!user) {
            throw new Error('User not found');
        }

        // Extract and validate saved painting IDs
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
            return 0; // Return 0 if there are no saved paintings
        }

        // Count the number of matching paintings in the database
        const paintingsCollection = db.collection('paintings');
        const count = await paintingsCollection.countDocuments({
            _id: { $in: savedPaintingIds },
        });

        console.log(`User ${userId} has ${count} saved paintings.`);
        return count;
    }

}

module.exports = User;