const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const CORS_WHITELIST = process.env.CORS_WHITELIST.split(",");
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

//--------------------------------------------controllers--------------------------------------------


const userController = require("./controllers/userController");
const sessionController = require("./controllers/sessionController");
const promptController = require("./controllers/promptController");
const storylineController = require("./controllers/storylineController");
const storyNodeController = require("./controllers/storyNodeController");

app.use("/user", userController);
app.use("/session", sessionController);
app.use("/prompt", promptController);
app.use("/storyline", storylineController);
app.use("/node", storyNodeController);

mongoose.connect(MONGO_URL).then(async () => {
  console.log("database connected");
  app.listen(PORT, () => {
    console.log("listening on", PORT);
  });
});

db.on("error", (err) => console.log(err.message + " is Mongod not running?"));
db.on("connected", () => console.log("mongo connected"));
db.on("disconnected", () => console.log("mongo disconnected"));
