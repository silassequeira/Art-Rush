# The Metropolitan Museum of Art Collection API

[text](https://metmuseum.github.io/)

## Access to the API

At this time, we do not require API users to Signup or obtain an API key to use the service. Please limit request rate to 80 requests per second.

## Database Setup mongodb

paintings

{
"ObjectId": "ObjectId",
"title": "String",
"medium": "String",
"objectDate": "Number",
"primaryImage": "String",
"primaryImageSmall": "String",
"artistDisplayName": "String",
"artistDisplayBio": "String",
"artistNationality": "String"
}

users

{
"ObjectId": "ObjectId",
"username": "String",
"password": "String",
"fullName": "String"
}

saved_painting

{
"id": "ObjectId",
"users.id": "ObjectId",
"paintings.id": "ObjectId",
"rating": "Number",
"favorite": "Boolean"
}
