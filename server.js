const express = require('express')
const fetch = require('node-fetch')
const fs = require('fs')
const path = require('path')

const server = express()

async function fetchCats() {
    const response = await fetch('https://cataas.com/api/cats?limit=500')
    const data = await response.json()

    fs.writeFileSync('catData.json', JSON.stringify(data, null, 2))

    console.log("Fetched cat data")
}


function getFatCat() {
    const fileData = fs.readFileSync('catData.json', 'utf8');
    const allCats = JSON.parse(fileData)

    let fatCat = allCats.reduce((prev, current) =>
        (prev.size > current.size) ? prev : current)

    return fatCat._id
}


function getAllCatsIds() {
    const fileData = fs.readFileSync('catData.json', 'utf8');
    const allCats = JSON.parse(fileData)

    return allCats
}



function getCuteFatCat() {
    const fileData = fs.readFileSync('catData.json', 'utf8')
    const allCats = JSON.parse(fileData)

    let onlyCuteCats = allCats.filter(cat =>
        cat.tags && cat.tags.length === 1 && cat.tags[0] === 'cute')

    let fatCuteCat = onlyCuteCats.reduce((largest, current) =>
        (current.size > largest.size) ? current : largest)

    let totalFat = onlyCuteCats.reduce((sum, cat) => sum + cat.size, 0)

    return fatCuteCat._id, totalFat
}

function getThreeBestTagsFatCats() {
    const fileData = fs.readFileSync('catData.json', 'utf8')
    const allCats = JSON.parse(fileData)

    let tagCounts = allCats.flatMap(cat => cat.tags)
        .reduce((counts, tag) => {
            counts[tag] = (counts[tag] || 0) + 1
            return counts
        }, {})

    let topThreeTags = Object.entries(tagCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([tag, count]) => ({ tag, count }))

    let fatCatsTopTags = topThreeTags.map(({ tag }) => {
        let catsWithTag = allCats.filter(cat => cat.tags.includes(tag))

        let fatCat = catsWithTag.reduce((largest, current) =>
            current.size > largest.size ? current : largest)

        return fatCat._id
    })

    console.log(topThreeTags)

    return { topThreeTags, fatCatsTopTags }
}

server.all('/cutest-cat', (req, res) => {
    let catPic = getCuteFatCat()
    let catImageUrl = `https://cataas.com/cat/${catPic[0]}`
    let html =
        `<h1>The Most Cute and Fat Cat</h1> 
    <img src="${catImageUrl}" alt="Random Cat" />
    <p>Weight of All Cute Cats: ${catPic[1]}</p>`
    res.send(html)
})


server.all('/fattest-cat', (req, res) => {
    let biggestCat = getFatCat()
    let fatCatImageUrl = `https://cataas.com/cat/${biggestCat}`
    let html = `<h1>Top Fat Cat</h1> <img src="${fatCatImageUrl}" alt="Biggest Cat"/>`
    res.send(html)
})


server.all('/top-cats', (req, res) => {
    let catData = getThreeBestTagsFatCats()
    let html =
        `<h1>Top Three Fat Cats in each category</h1> 
      <h2>(they may be to fat to be displayed)</h2>
      <p>In 1st Place :  ${catData.topThreeTags[0].tag} with ${catData.topThreeTags[0].count} </p> 
      <img src="https://cataas.com/cat/${catData.fatCatsTopTags[0]}" alt="1st Place Cat"/>
      <p>In 2nd Place : ${catData.topThreeTags[1].tag} with ${catData.topThreeTags[1].count} </p>
      <img src="https://cataas.com/cat/${catData.fatCatsTopTags[1]}" alt="2st Place Cat"/>
      <p>In 3rd Place : ${catData.topThreeTags[2].tag} with ${catData.topThreeTags[2].count} </p>
      <img src="https://cataas.com/cat/${catData.fatCatsTopTags[2]}" alt="3rd Place Cat"/> `
    res.send(html)
})


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