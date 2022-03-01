# And-Then-Backend

To read more about the full application, navigate to the frontend repo linked below and click on the demo link which can be found there.  
[Frontend Repo](https://github.com/andrewilf/and-then)

## Introduction

This Backend application was created to manage the logic for the application: And Then. The application is a proof of concept collaborative writing app.
For more details on the general project, view the readme file on frontend's github repo: https://github.com/andrewilf/and-then

## Features

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
  - Top 3 trending prompts
- A specialised endpoint was also created for browsing the prompt catalog.
  - The search can be refined by: Genre, Status, Rating, and match by string in name
  - Endpoint also uses pagination of up to 9 prompts per search. Page number can be added to search query

## Technologies

- CORS
- Bcryptjs
- Mongoose/MongoDB
- Mongoose Paginate V2
- Json Web Token
- Node.js

## Running the server locally

If you wish to clone and run this server on your local machine:

- you need to configure some config variables. The npm library, dotenv is included in the package.json file so you can edit the included file "dotenv"(remember to rename it .env) and write the configurations you desire the app to use.
- Run the following commands inside your AND-THEN-BACKEND folder: npm install, npm start.
