const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
//const session = require("express-session");
//const CORS_WHITELIST = process.env.CORS_WHITELIST.split(",");

const db = mongoose.connection;
const PORT = process.env.PORT;
const DATABASE = process.env.DATABASE;
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_BASE_URL = process.env.MONGO_BASE_URL;
const MONGO_URL = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_BASE_URL}/${DATABASE}?retryWrites=true&w=majority`;

//--------------------------------------------middleware--------------------------------------------
app.use(express.json());
app.use(
  cors() //for now will just allow all CORS request through, when frontend url confirmed can use the whitelist variable
  //{origin: CORS_WHITELIST,}
);

// app.use(
//   session({
//     secret: process.env.SECRET, //a random string do not copy this value or your stuff will get hacked
//     resave: false, // default more info: https://www.npmjs.com/package/express-session#resave
//     saveUninitialized: false, // default  more info: https://www.npmjs.com/package/express-session#resave
//   })
// );

//--------------------------------------------controllers--------------------------------------------


const userController = require("./controllers/userController");
const bannerController = require("./controllers/bannerImageController");

app.use("/user", userController);
app.use("/banner", bannerController);

mongoose.connect(MONGO_URL).then(async () => {
  console.log("database connected");
  app.listen(PORT, () => {
    console.log("listening on", PORT);
  });
});

db.on("error", (err) => console.log(err.message + " is Mongod not running?"));
db.on("connected", () => console.log("mongo connected"));
db.on("disconnected", () => console.log("mongo disconnected"));
