const { connectToMongoDB, getDB } = require('./database');
const userRoutes = require('./Routes/userRoutes');
const paintingRoutes = require('./Routes/paintings');
const express = require('express');
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

const buildPath = path.join(__dirname, '../frontend/build');
app.use(express.static(buildPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

// Middleware to handle 404 errors
app.use((req, res, next) => {
    res.status(404).json({ message: 'Resource not found' });
});

// Function to start the server
async function startServer() {
    try {
        // Ensure we use connectToMongoDB instead of manual connection
        await connectToMongoDB();

        const db = getDB(); // This should now work reliably
        console.log('Database connection established:', db.databaseName);

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