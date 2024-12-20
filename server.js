const { connectToMongoDB, getDB } = require('./database.js');
const userRoutes = require('./Routes/userRoutes.js');
const paintingRoutes = require('./Routes/paintingRoutes.js');
const interactionRoutes = require('./Routes/interactionRoutes.js');
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');


const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
}));


app.use('/api/users', userRoutes);
app.use('/api/paintings', paintingRoutes);
app.use('/api/interactions', interactionRoutes);

const buildPath = path.join(__dirname, './frontend/build');
app.use(express.static(buildPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './frontend/build', 'index.html'));
});

app.use((req, res, next) => {
    res.status(404).json({ message: 'Resource not found' });
});


async function startServer() {
    try {
        const filePath = path.join(__dirname, 'paintings.json');
        const fileContents = await fs.readFile(filePath, 'utf8');
        const paintings = JSON.parse(fileContents);

        
        await connectToMongoDB();

        const db = getDB(); 
        const collection = db.collection('paintings');

        const existingCount = await collection.countDocuments();
        if (existingCount > 0) {
            console.log('Paintings already exist in the collection. Skipping upload.');
        } else {
            
            await collection.insertMany(paintings);
            console.log('Paintings data inserted into the collection.');
        }

        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Server started on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}


module.exports = { startServer };
