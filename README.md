# And-Then-Backend

To read more about the full application, navigate to the frontend repo linked below and click on the demo link which can be found there.  
[Frontend Repo](https://github.com/andrewilf/and-then)

## Introduction

This Backend application was created to manage the logic for the application: And Then. The application is a proof of concept collaborative writing app.
For more details on the general project, view the readme file on the frontend's github repo.

# Features

- Express server to serve API calls for the frontend application.
- Communication with a MongoDB database through Mongoose.
- 5 Different schemas: Users, Prompts, Storylines, Story Nodes, and Trending (Used to track which prompts are "trending").
- Full CRUD operations for the 5 schemas.
- JWT for user authentication.
- Bcryptjs used to hash passwords sent to the backend for user account creation and login verification.
- Unique endpoints used by the frontend application to find out:
  - Most recently added prompts
  - Most recently updated prompts (unused in the final application)
  - A random prompt
  - Personal user infographics such as favourite genre, total followers for owned prompts, owned prompts list, and followed promtps list
  - Top 3 trending prompts
- A specialised endpoint was also created for browsing the prompt catalog.
  - The search can be refined by: Genre, Status, Rating, and match by string in name
  - Endpoint also uses pagination of up to 9 prompts per search. Page number can be added to search query

## Technologies

- Bcryptjs
- Mongoose/MongoDB
- Mongoose Paginate V2
- Json Web Token
- Node.js

# Deeper Explaination on certain features

## Trending prompts

When a new prompt is created, a seperate Trending object is also created in the database. This object has 2 parameters: The corresponding prompt ID and the trending score. A newly made Trending object starts with a trending score of 3. Every time the full prompt is loaded in by an API call, this trending score is incremented by 1.
To ensure the prompt is considered "trending", the server also does a decrement of all prompt score by 1 every 5 minutes if the score is more than 0(These score weights were used for testing, in a production environment they should be tweaked).

Whenever the trending prompts endpoint is called, the Trending objects are sorted by trending score and the top 3 are chosen. Using the corresponding prompt IDs found, another query is done on the database to retreive the prompts information and return it as the payload.

The Trending object must also be deleted when its corresponding prompt is also deleted.

## User profile endpoint

The return payload of the user profile page has 3 parameters: followed prompts, owned prompts, and favourite genre. The prompt IDs for followed and owned prompts are stored as arrays in the user object. The prompt data with all its information is first retreived according to the prompt IDs. The most common genre according to these prompts is then calculated and added to the payload. If the user has no followed or owned prompts, the payload just has "none" in the favourite genre parameter.

## Prompt search endpoint

This endpoint is the most complicated. It has 5 possible fields to filter by, 3 of those fields are arrays.

![search fields](https://github.com/andrewilf/and-then-backend/blob/main/readme_img/Search%20fields%20image.png?raw=true)

As shown in the example above, the fields are:

- Search by name (string)
- genre (array of strings)
- rating (array of strings)
- status (array of strings)
- search page number (string)

The first four fields are optional queries sent with the GET request. If they are present, they are added as array elements to the "$AND" find for prompts. Because of this, not having any query added will return all prompts in the database. by making then AND terms, the search is inclusive of all elements in each field array but are exclusive between different fields.

This means you can get all genres found in the genre array such as horror, adventure, and fantasy but by adding a search by rating of teen, this means only teen rated prompts of the 3 queried genres will be found as oppose to returning all prompts with the 3 genres and all teen rated prompts which will defeat the purpose of a search function.

To accomadate the possibility of having a large number of prompts (especially when no filters are applied and all prompts are returned), the results are also paginated. The last field is page number. To acheive pagination, the "mongoose-paginate-v2" package was used. By default, the page number of 1 is used, depending how many pages of 9 prompts are created by the endpoints payload, the max number of pages is determined by the frontend.

# To-do list

- Add a JWT refresh token mechanism. Currently the login JWT expires in 50 minutes and does not auto refresh thus requiring another login.
- Add checks to the more important endpoint CRUD features.
- More robust trending prompt calculations.
- Add ability to have multiple genres tied to a story.
- Add more search prompt endpoint options such as sort by, and number of prompts per page.
- Potentially expand the ability to add more storylines and branch them. Needs more thought from the user POV first.

## Running the server locally

If you wish to clone and run this server on your local machine:

- you need to configure some config variables. The npm library, dotenv is included in the package.json file so you can edit the included file "dotenv"(remember to rename it .env) and write the configurations you desire the app to use.
- Run the following commands inside your AND-THEN-BACKEND folder: npm install, npm start.

## Links

[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/andrewianfaulkner/)