const { connectToMongoDB, getDB } = require('./database');
const userRoutes = require('./Routes/userRoutes');
const paintingRoutes = require('./Routes/paintingRoutes');
const interactionRoutes = require('./Routes/interactionRoutes');
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

// Middleware
const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173', // Vite default port
    credentials: true
}));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/paintings', paintingRoutes);
app.use('/api/interactions', interactionRoutes);

const buildPath = path.join(__dirname, '../frontend/build');
app.use(express.static(buildPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

app.use((req, res, next) => {
    res.status(404).json({ message: 'Resource not found' });
});

// Function to start the server
async function startServer() {
    try {
        const filePath = path.join(__dirname, 'paintings.json');
        const fileContents = await fs.readFile(filePath, 'utf8');
        const paintings = JSON.parse(fileContents);

        // Connect to MongoDB
        await connectToMongoDB();

        const db = getDB(); // Get the database connection
        const collection = db.collection('paintings');

        // Check if the collection already has data
        const existingCount = await collection.countDocuments();
        if (existingCount > 0) {
            console.log('Paintings already exist in the collection. Skipping upload.');
        } else {
            // Insert the paintings data into the collection
            await collection.insertMany(paintings);
            console.log('Paintings data inserted into the collection.');
        }

        // Start the server
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Server started on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();