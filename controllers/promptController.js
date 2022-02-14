const express = require("express");
require("dotenv").config();
const Prompt = require("../models/prompt");
const router = express.Router();

///GET routes==================================================================================================

router.get("/all", async (req, res) => {
  console.log("get all prompts");
  const promptAll = await Prompt.find({});
  //returns all prompt, should be an array of objects
  res.send(promptAll);
});

router.get("/search", async (req, res) => {
  //search for prompt by search fields
  try {
    const genre = req.query.genre || null;
    const rating = req.query.rating || null;
    const status = req.query.status || null;
    const title = req.query.title || null;
    console.log("search for prompts with fields");
    const searchObj = [];
    if (genre) {
      searchObj.push({ genre: { $in: genre.split(",") } });
    }
    if (rating) {
      searchObj.push({ rating: { $in: rating.split(",") } });
    }
    if (status) {
      searchObj.push({ status: { $in: status.split(",") } });
    }
    if (title) {
      searchObj.push({ title: { $regex: title, $options: "i" } });
    }
    console.log(searchObj);
    const searchPrompts = await Prompt.find(
      searchObj.length === 0 ? {} : { $and: searchObj }
    );
    console.log("number: ", searchPrompts.length);
    res.send(searchPrompts);
  } catch (error) {
    console.error(error);
    res.status(400).send("error when finding prompts, bad input");
  }
});

router.get("/:promptID", async (req, res) => {
  //search for one prompt by _id
  try {
    const promptID = req.params.promptID;
    console.log("search for prompt by _id");
    const promptGetOne = await Prompt.findOne({ _id: promptID });
    if (promptGetOne !== null) {
      //returns one object
      res.send(promptGetOne);
    } else {
      //_id was of the correct format but no prompt was found
      res.status(404).send("prompt not found");
    }
  } catch (error) {
    //likely the promptID was not a string of 12 bytes or a string of 24 hex characters
    console.error(error);
    res.status(400).send("error when finding prompt, bad input");
  }
});

router.get("/:searchField/:searchValue", async (req, res) => {
  //search multiple prompts by defined field
  try {
    const searchField = req.params.searchField;
    const searchValue = req.params.searchValue;
    console.log(`search prompts by field: ${searchField}`);
    const checkFieldExists = Object.keys(Prompt.schema.tree).find(
      //checks if the searchField is a valid field for the model
      (element) => element === searchField
    );
    const promptsGet = await Prompt.find({ [searchField]: searchValue });
    if (promptsGet.length !== 0 && checkFieldExists) {
      //return valid response, should be an array of objects
      res.send(promptsGet);
    } else if (!checkFieldExists) {
      //searchField is not valid
      res.status(400).send(`"${searchField}" is not a valid field`);
    } else {
      //prompt field exists but no prompt was found
      res
        .status(404)
        .send(
          `no prompts were found with the parameter ${searchField}: ${searchValue}`
        );
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("error when finding prompts");
  }
});

//POST routes=================================================================================================

router.post("/", async (req, res) => {
  try {
    //create one prompt
    const promptCreate = await Prompt.create(req.body);
    res.send(promptCreate);
  } catch (error) {
    console.error(error);
    res.status(400).send("error when adding prompt, bad input");
  }
});

router.post("/sample", async (req, res) => {
  //create a sample prompt
  const sampleData = {
    title: "letter runner",
    promptText: "asdasdasd",
    additionalInfo: "asdasdasd",
    owner: "62075a212c3cd68e34ad35f2",
    storyline: ["62075a212c3cd68e34ad35f2", "62075a212c3cd68e34ad35f2"],
    rating: "Everyone",
    genre: "Thriller",
    bannerURL:
      "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80",
  };
  try {
    const promptCreate = await Prompt.create(sampleData);
    res.send(promptCreate);
  } catch (error) {
    console.error(error);
    res.status(400).send("error when adding prompt, bad input");
  }
});

//PUT routes==================================================================================================

router.put("/:promptID", async (req, res) => {
  //update one prompt by _id
  console.log("updating one prompt, find via _id");

  try {
    const filterID = { _id: req.params.promptID };
    const update = req.body;
    const promptFind = await Prompt.findOne(filterID);
    if (promptFind !== null) {
      //found the prompt via _id
      const promptUpdated = await Prompt.updateOne(filterID, update);
      res.send(promptUpdated);
    } else {
      //if prompt not found, send 404 status
      res.status(404).send("No prompts were found with that _id");
    }
  } catch (error) {
    console.error(error);
    //likely the promptID was not a string of 12 bytes or a string of 24 hex characters
    res.status(400).send("error when updating prompts, bad input");
  }
});

//DELETE routes===============================================================================================

router.delete("/all", async (req, res) => {
  //delete all prompts, use carefully
  try {
    const promptsDelete = await Prompt.deleteMany({});
    if (promptsDelete.deletedCount !== 0) {
      res.send(promptsDelete);
    } else {
      res.status(404).send("No prompts were found in the db, deletedCount: 0");
    }
  } catch (error) {
    console.error(error);
    res.status(400).send("error when deleting prompts, bad input");
  }
});

router.delete("/:promptID", async (req, res) => {
  //delete one prompt by _id

  try {
    const promptID = req.params.promptID;
    const promptDelete = await Prompt.deleteOne({ _id: promptID });
    if (promptDelete.deletedCount !== 0) {
      res.send(promptDelete);
    } else {
      res
        .status(404)
        .send("No prompts were found with that id, deletedCount: 0");
    }
  } catch (error) {
    console.error(error);
    res.status(400).send("error when deleting prompt, bad input");
  }
});

module.exports = router;
