const express = require('express');
const cors = require('cors');
const { connectToMongoDB } = require('./config/database');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Your React app's URL
    credentials: true
}));

// Routes
app.use('/api/users', userRoutes);

// Connect to MongoDB before starting the server
async function startServer() {
    try {
        // Connect to MongoDB
        await connectToMongoDB();

        // Start the server
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();