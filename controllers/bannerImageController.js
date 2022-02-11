const express = require("express");
require("dotenv").config();
const router = express.Router();
const path = require("path");
const fs = require("fs");

///GET routes==================================================================================================

router.get("/all", async (req, res) => {
  //get array of all the banner images stored on server
  console.log("get all banner images");
  const files = fs.readdirSync(__dirname.replace("controllers", "bannerImgs"));
  files.forEach((element, index) => {
    files[index] = element.slice(0, -4);
  });
  console.log(files);
  res.send(files);
});

router.get("/:name", async (req, res) => {
  console.log("retreiving banner image");
  //return the banner image file when invoked
  const name = req.params.name;
  const folderPath = __dirname.replace("controllers", "");
  res.sendFile(path.resolve(`${folderPath}/bannerImgs/${name}.png`));
});

module.exports = router;
