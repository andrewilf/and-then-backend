const express = require("express");
require("dotenv").config();
const Storyline = require("../models/storyline");
const router = express.Router();

///GET routes==================================================================================================

router.get("/all", async (req, res) => {
  console.log("get all storylines");
  const storylineAll = await Storyline.find({});
  //returns all storyline, should be an array of objects
  res.send(storylineAll);
});

router.get("/:storylineID", async (req, res) => {
  //searc for one storyline by _id
  try {
    const storylineID = req.params.storylineID;
    console.log("search for storyline by _id");
    const storylineGetOne = await Storyline.findOne({ _id: storylineID });
    if (storylineGetOne !== null) {
      //returns one object
      res.send(storylineGetOne);
    } else {
      //_id was of the correct format but no storyline was found
      res.status(404).send("storyline not found");
    }
  } catch (error) {
    //likely the storylineID was not a string of 12 bytes or a string of 24 hex characters
    console.error(error);
    res.status(400).send("error when finding storyline, bad input");
  }
});

router.get("/:searchField/:searchValue", async (req, res) => {
  //search multiple storylines by defined field
  try {
    const searchField = req.params.searchField;
    const searchValue = req.params.searchValue;
    console.log(`search storylines by field: ${searchField}`);
    const checkFieldExists = Object.keys(Storyline.schema.tree).find(
      //checks if the searchField is a valid field for the model
      (element) => element === searchField
    );
    const storylinesGet = await Storyline.find({ [searchField]: searchValue });
    if (storylinesGet.length !== 0 && checkFieldExists) {
      //return valid response, should be an array of objects
      res.send(storylinesGet);
    } else if (!checkFieldExists) {
      //searchField is not valid
      res.status(400).send(`"${searchField}" is not a valid field`);
    } else {
      //storyline field exists but no storyline was found
      res
        .status(404)
        .send(
          `no storylines were found with the parameter ${searchField}: ${searchValue}`
        );
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("error when finding storylines");
  }
});

//POST routes=================================================================================================

router.post("/", async (req, res) => {
  try {
    //create one storyline
    const storylineCreate = await Storyline.create(req.body);
    res.send(storylineCreate);
  } catch (error) {
    console.error(error);
    res.status(400).send("error when adding storyline, bad input");
  }
});

router.post("/sample", async (req, res) => {
  //create a sample storyline
  const sampleData = {
    prompt: "62075a212c3cd68e34ad35f2",
    storyNodes: ["62075a212c3cd68e34ad35f2", "62075a212c3cd68e34ad35f2"],
    followers: ["62075a212c3cd68e34ad35f2", "62075a212c3cd68e34ad35f2"],
  };
  try {
    const storylineCreate = await Storyline.create(sampleData);
    res.send(storylineCreate);
  } catch (error) {
    console.error(error);
    res.status(400).send("error when adding storyline, bad input");
  }
});

//PUT routes==================================================================================================

router.put("/:storylineID", async (req, res) => {
  //update one storyline by _id
  console.log("updating one storyline, find via _id");

  try {
    const filterID = { _id: req.params.storylineID };
    const update = req.body;
    const storylineFind = await Storyline.findOne(filterID);
    if (storylineFind !== null) {
      //found the storyline via _id
      const storylineUpdated = await Storyline.updateOne(filterID, update);
      res.send(storylineUpdated);
    } else {
      //if storyline not found, send 404 status
      res.status(404).send("No storylines were found with that _id");
    }
  } catch (error) {
    console.error(error);
    //likely the storylineID was not a string of 12 bytes or a string of 24 hex characters
    res.status(400).send("error when updating storylines, bad input");
  }
});

//DELETE routes===============================================================================================

router.delete("/all", async (req, res) => {
  //delete all storylines, use carefully
  try {
    const storylinesDelete = await Storyline.deleteMany({});
    if (storylinesDelete.deletedCount !== 0) {
      res.send(storylinesDelete);
    } else {
      res
        .status(404)
        .send("No storylines were found in the db, deletedCount: 0");
    }
  } catch (error) {
    console.error(error);
    res.status(400).send("error when deleting storylines, bad input");
  }
});

router.delete("/:storylineID", async (req, res) => {
  //delete one storyline by _id

  try {
    const storylineID = req.params.storylineID;
    const storylineDelete = await Storyline.deleteOne({ _id: storylineID });
    if (storylineDelete.deletedCount !== 0) {
      res.send(storylineDelete);
    } else {
      res
        .status(404)
        .send("No storylines were found with that id, deletedCount: 0");
    }
  } catch (error) {
    console.error(error);
    res.status(400).send("error when deleting storyline, bad input");
  }
});

module.exports = router;
