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

            // Toggle the saved status of the painting
            const result = await usersCollection.updateOne(
                { _id: new ObjectId(userId) },
                {
                    $set: {
                        [`${paintingId}.saved`]: saved,
                        [`${paintingId}.favorite`]: saved
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

    static async addFavoriteInteraction(userId, paintingId, favorite) {
        const db = getDB();
        const usersCollection = db.collection('users');
        const paintingsCollection = db.collection('paintings');

        try {
            // Validate that the painting exists
            const painting = await paintingsCollection.findOne({ _id: new ObjectId(paintingId) });
            if (!painting) {
                throw new Error('Painting not found');
            }

            // Update the user's document to set the favorite status
            const result = await usersCollection.updateOne(
                { _id: new ObjectId(userId) },
                {
                    $set: {
                        [paintingId]: {
                            paintingId: painting._id,
                            saved: favorite,
                            favorite: favorite
                        }
                    }
                }
            );

            console.log("Database update result for favorite:", result);
            return result;
        } catch (error) {
            console.error("Error in addFavoriteInteraction:", error);
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
            .filter(key => user[key].saved === true || user[key].favorite === true)
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

    // Function that retrieves all of the saved paintings
    static async getFavoritePaintings(userId) {
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
        const favoritePaintingIds = Object.keys(user)
            .filter(key => user[key].favorite === true)
            .map(key => {
                const paintingId = user[key].paintingId;
                if (!ObjectId.isValid(paintingId)) {
                    throw new Error(`Invalid painting ID: ${paintingId}`);
                }
                return new ObjectId(paintingId);
            });

        if (favoritePaintingIds.length === 0) {
            console.log('No favorite paintings found.');
            return []; // Return an empty array if there are no saved paintings
        }

        // Fetch only the paintings that match the IDs exactly
        const favoritePaintings = await paintingsCollection
            .find({ _id: { $in: favoritePaintingIds } })
            .toArray();

        const filteredPaintings = favoritePaintings.filter(painting =>
            favoritePaintingIds.some(id => id.equals(painting._id))
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
            .filter(key => user[key].saved === true || user[key].favorite === true)
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

    // Function that counts the number of saved paintings
    static async countFavorite(userId) {
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
        const favoritePaintingIds = Object.keys(user)
            .filter(key => user[key].favorite === true)
            .map(key => {
                if (!ObjectId.isValid(user[key].paintingId)) {
                    throw new Error(`Invalid painting ID: ${user[key].paintingId}`);
                }
                return new ObjectId(user[key].paintingId);
            });

        if (favoritePaintingIds.length === 0) {
            console.log('No favorite paintings found.');
            return 0; // Return 0 if there are no saved paintings
        }

        // Count the number of matching paintings in the database
        const paintingsCollection = db.collection('paintings');
        const count = await paintingsCollection.countDocuments({
            _id: { $in: favoritePaintingIds },
        });

        console.log(`User ${userId} has ${count} favorite paintings.`);
        return count;
    }

    // Function that counts the number artists of the saved paintings
    static async countSavedArtists(userId) {
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
            .filter(key => user[key].saved === true || user[key].favorite === true)
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

        // Fetch the paintings to get artistDisplayName
        const savedPaintings = await paintingsCollection
            .find({ _id: { $in: savedPaintingIds } })
            .toArray();

        // Extract unique artistDisplayNames
        const uniqueArtists = new Set();
        savedPaintings.forEach(painting => {
            if (painting.artistDisplayName) {
                uniqueArtists.add(painting.artistDisplayName);
            }
        });

        if (uniqueArtists.length === 0) {
            console.log('No saved Artists found.');
            return 0; // Return 0 if there are no saved paintings
        }

        console.log(`User ${userId} has ${count} saved paintings by ${uniqueArtists.size} unique artists.`);

        return uniqueArtists.size;
    }

    // Function that counts the number of saved paintings
    static async checkSavedState(userId, paintingId) {
        const db = getDB();
        const usersCollection = db.collection('users');

        // Validate and convert userId and paintingId to ObjectId
        if (!ObjectId.isValid(userId)) {
            throw new Error('Invalid user ID');
        }
        if (!ObjectId.isValid(paintingId)) {
            throw new Error('Invalid painting ID');
        }
        const userObjectId = new ObjectId(userId);
        const paintingObjectId = new ObjectId(paintingId);

        // Fetch the user
        const user = await usersCollection.findOne({ _id: userObjectId });
        if (!user) {
            throw new Error('User not found');
        }

        // Extract and validate saved painting IDs
        const savedPaintingIds = Object.keys(user)
            .filter(key => user[key].saved !== undefined) // Ensure the key has a saved property
            .filter(key => user[key].saved === true || false) // Ensure the key has a saved property
            .map(key => {
                //console.log(`Processing key: ${key}`); // Debugging log
                //console.log(`Painting ID: ${key}`); // Debugging log
                if (!ObjectId.isValid(key)) {
                    throw new Error(`Invalid painting ID: ${key}`);
                }
                return new ObjectId(key);
            });

        // Log savedPaintingIds and paintingObjectId
        // console.log('Saved Painting IDs:', savedPaintingIds);
        // console.log('Painting ID:', paintingObjectId);

        // Check if the painting is in the saved paintings
        const isPaintingSaved = savedPaintingIds.some(id => id.equals(paintingObjectId));

        if (isPaintingSaved) {
            //console.log('Painting added and true');
            return true; // Return true if the painting is saved
        } else {
            //console.log('Painting not added');
            return false; // Return false if the painting is not saved
        }
    }

    // Function that checks if a painting is marked as favorite
    static async checkFavoriteState(userId, paintingId) {
        const db = getDB();
        const usersCollection = db.collection('users');

        // Validate and convert userId and paintingId to ObjectId
        if (!ObjectId.isValid(userId)) {
            throw new Error('Invalid user ID');
        }
        if (!ObjectId.isValid(paintingId)) {
            throw new Error('Invalid painting ID');
        }
        const userObjectId = new ObjectId(userId);
        const paintingObjectId = new ObjectId(paintingId);

        // Fetch the user
        const user = await usersCollection.findOne({ _id: userObjectId });
        if (!user) {
            throw new Error('User not found');
        }

        // Extract and validate favorite painting IDs
        const favoritePaintingIds = Object.keys(user)
            .filter(key => user[key].favorite !== undefined) // Ensure the key has a favorite property
            .filter(key => user[key].favorite === true) // Ensure the painting is marked as favorite
            .map(key => {
                //console.log(`Processing key: ${key}`); // Debugging log
                //console.log(`Painting ID: ${key}`); // Debugging log
                if (!ObjectId.isValid(key)) {
                    throw new Error(`Invalid painting ID: ${key}`);
                }
                return new ObjectId(key);
            });

        // Check if the painting is in the favorite paintings
        const isPaintingFavorite = favoritePaintingIds.some(id => id.equals(paintingObjectId));

        if (isPaintingFavorite) {
            //console.log('Painting is marked as favorite');
            return true; // Return true if the painting is marked as favorite
        } else {
            //console.log('Painting is not marked as favorite');
            return false; // Return false if the painting is not marked as favorite
        }
    }

    // Function that retrieves distinct nationalities of the saved paintings
    static async filterSavedNationalities(userId) {
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
            .filter(key => user[key].saved === true || user[key].favorite === true)
            .map(key => {
                if (!ObjectId.isValid(user[key].paintingId)) {
                    throw new Error(`Invalid painting ID: ${user[key].paintingId}`);
                }
                return new ObjectId(user[key].paintingId);
            });

        if (savedPaintingIds.length === 0) {
            console.log('No saved paintings found.');
            return []; // Return an empty array if there are no saved paintings
        }

        // Access the paintings collection
        const paintingsCollection = db.collection('paintings');

        // Fetch the paintings matching the saved IDs
        const savedPaintings = await paintingsCollection
            .find({ _id: { $in: savedPaintingIds } })
            .toArray();

        if (savedPaintings.length === 0) {
            console.log('No saved paintings found in the database.');
            return []; // Return an empty array if no matching paintings are found
        }

        // Extract unique artist nationalities
        const uniqueNationalities = new Set();
        savedPaintings.forEach(painting => {
            if (painting.artistNationality) {
                uniqueNationalities.add(painting.artistNationality);
            }
        });

        // Convert the set to an array and return
        const nationalitiesArray = Array.from(uniqueNationalities);
        console.log(`User ${userId} has paintings by artists from the following nationalities: ${nationalitiesArray.join(', ')}`);
        return nationalitiesArray;
    }

    // Function that retrieves distinct mediums of the saved paintings
    static async filterSavedMediums(userId) {
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
            .filter(key => user[key].saved === true || user[key].favorite === true)
            .map(key => {
                if (!ObjectId.isValid(user[key].paintingId)) {
                    throw new Error(`Invalid painting ID: ${user[key].paintingId}`);
                }
                return new ObjectId(user[key].paintingId);
            });

        if (savedPaintingIds.length === 0) {
            console.log('No saved paintings found.');
            return []; // Return an empty array if there are no saved paintings
        }

        // Access the paintings collection
        const paintingsCollection = db.collection('paintings');

        // Fetch the paintings matching the saved IDs
        const savedPaintings = await paintingsCollection
            .find({ _id: { $in: savedPaintingIds } })
            .toArray();

        if (savedPaintings.length === 0) {
            console.log('No saved paintings found in the database.');
            return []; // Return an empty array if no matching paintings are found
        }

        // Extract unique artist mediums
        const uniqueMediums = new Set();
        savedPaintings.forEach(painting => {
            if (painting.medium) {
                uniqueMediums.add(painting.medium);
            }
        });

        // Convert the set to an array and return
        const mediumsArray = Array.from(uniqueMediums);
        console.log(`User ${userId} has paintings with these mediums: ${mediumsArray.join(', ')}`);
        return mediumsArray;
    }

    // Function that retrieves distinct mediums of the saved paintings
    static async filterSavedArtists(userId) {
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
            .filter(key => user[key].saved === true || user[key].favorite === true)
            .map(key => {
                if (!ObjectId.isValid(user[key].paintingId)) {
                    throw new Error(`Invalid painting ID: ${user[key].paintingId}`);
                }
                return new ObjectId(user[key].paintingId);
            });

        if (savedPaintingIds.length === 0) {
            console.log('No saved paintings found.');
            return []; // Return an empty array if there are no saved paintings
        }

        // Access the paintings collection
        const paintingsCollection = db.collection('paintings');

        // Fetch the paintings matching the saved IDs
        const savedPaintings = await paintingsCollection
            .find({ _id: { $in: savedPaintingIds } })
            .toArray();

        if (savedPaintings.length === 0) {
            console.log('No saved paintings found in the database.');
            return []; // Return an empty array if no matching paintings are found
        }

        // Extract unique artist artists
        const uniqueArtists = new Set();
        savedPaintings.forEach(painting => {
            if (painting.artistDisplayName) {
                uniqueArtists.add(painting.artistDisplayName);
            }
        });

        // Convert the set to an array and return
        const artistsArray = Array.from(uniqueArtists);
        console.log(`User ${userId} has paintings with these artists: ${artistsArray.join(', ')}`);
        return artistsArray;
    }



}

module.exports = User;