const express = require('express')
const fetch = require('node-fetch')
const fs = require('fs')
const path = require('path')

const server = express()

async function fetchCats() {
    const response = await fetch('https://collectionapi.metmuseum.org/public/collection/v1/objects/[isHighlight]?limit=80')
    const data = await response.json()

    fs.writeFileSync('catData.json', JSON.stringify(data, null, 2))

    console.log("Fetched cat data")
}

function getAllCatsIds() {
    const fileData = fs.readFileSync('catData.json', 'utf8');
    const allCats = JSON.parse(fileData)

    return allCats
}

server.use(express.static(path.join(__dirname, 'public')));

server.all('/cat-data', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;

    const catData = getAllCatsIds(limit, offset);
    let html = '';

    catData.forEach(cat => {
        html += `
            <img 
                src="https://cataas.com/cat/${cat._id}" 
                alt="Cat Image" 
                style="width: 100%; height: auto; display: block; margin-bottom: 1em;" 
                loading="lazy"
            />
        `;
    });

    const nextPage = catData.length === limit ? page + 1 : null;

    res.json({
        html,
        nextPage
    });
});


server.all('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

server.listen(3000, () => {
    console.log('Server is running on port 3000')
    fetchCats()
})