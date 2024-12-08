const express = require('express')
const fetch = require('node-fetch')
const fs = require('fs')
const path = require('path')

const server = express()

async function fetchCats() {
    const response = await fetch('https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=11&limit=1000')
    const data = await response.json()
    const objectIDs = data.objectIDs.slice(0, 390) // Limit to 80 objects

    const records = []

    for (const objectID of objectIDs) {
        const objectResponse = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`)
        const objectData = await objectResponse.json()

        if (objectData.objectName === 'Painting') {
            const record = {
                primaryImage: objectData.primaryImage,
                primaryImageSmall: objectData.primaryImageSmall,
                isHighlight: objectData.isHighlight,
                objectName: objectData.objectName,
                title: objectData.title,
                artistDisplayName: objectData.artistDisplayName,
                artistDisplayBio: objectData.artistDisplayBio,
                artistNationality: objectData.artistNationality,
                objectDate: objectData.objectDate,
                medium: objectData.medium,
            }

            records.push(record)
        }
    }

    fs.writeFileSync('collection.json', JSON.stringify(records, null, 2))

    console.log("Fetched all data")
}

server.listen(3000, () => {
    console.log('Server is running on port 3000')
    fetchCats()
})