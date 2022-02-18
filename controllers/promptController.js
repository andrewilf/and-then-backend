const express = require("express");
require("dotenv").config();
const Prompt = require("../models/prompt");
const User = require("../models/user");
const Storyline = require("../models/storyline");
const Node = require("../models/storyNode");
const router = express.Router();
///GET routes==================================================================================================

router.get("/all", async (req, res) => {
  console.log("get all prompts");
  const promptAll = await Prompt.find({});
  //returns all prompt, should be an array of objects
  res.send(promptAll);
});

router.get("/recentcreated", async (req, res) => {
  //get recently added prompts
  try {
    const promptsGet = await Prompt.find({}).sort({ createdAt: -1 }).limit(5);
    if (promptsGet.length !== 0) {
      //return valid response, should be an array of objects
      res.send(promptsGet);
    } else {
      //prompt field exists but no prompt was found
      res.status(404).send(`no prompts were found`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("error when finding prompts");
  }
});

router.get("/recentupdated", async (req, res) => {
  //get recently added prompts
  try {
    const promptsGet = await Prompt.find({}).sort({ updatedAt: -1 }).limit(5);
    if (promptsGet.length !== 0) {
      //return valid response, should be an array of objects
      res.send(promptsGet);
    } else {
      //prompt field exists but no prompt was found
      res.status(404).send(`no prompts were found`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("error when finding prompts");
  }
});

router.get("/random", async (req, res) => {
  //get a random added prompts
  try {
    Prompt.count().exec(function (err, count) {
      // Get a random entry
      const random = Math.floor(Math.random() * count);

      // Again query all users but only fetch one offset by our random #
      Prompt.findOne()
        .skip(random)
        .exec(function (err, result) {
          console.log(result);
          //send _id of random prompt
          res.send(result._id);
        });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("error when finding prompts");
  }
});

router.get("/multi/:promptArrayIDs", async (req, res) => {
  //searc for multiple prompts by _id
  try {
    const promptArrayIDs = req.params.promptArrayIDs.split(",");
    console.log("search for multiple prompts by _id");
    const promptGetMany = await Prompt.find({
      _id: { $in: promptArrayIDs },
    });
    if (promptGetMany !== null) {
      //console.log(nodeGetMany)
      res.send(promptGetMany);
    } else {
      //_id was of the correct format but no node was found
      res.status(404).send("prompts not found");
    }
  } catch (error) {
    //likely the promptID was not a string of 12 bytes or a string of 24 hex characters
    console.error(error);
    res.status(400).send("error when finding prompts, bad input");
  }
});

router.get("/search/:page", async (req, res) => {
  //search for prompt by search fields
  try {
    const genre = req.query.genre || null;
    const rating = req.query.rating || null;
    const status = req.query.status || null;
    const title = req.query.title || null;
    const page = req.params.page || 1;
    const options = {
      page: page,
      limit: 9,
      populate: "storyline",
      sort: { updatedAt: -1}
    };
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
    const searchPrompts = await Prompt.paginate(
      searchObj.length === 0 ? {} : { $and: searchObj },
      options
    ); //.populate("storyline")
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
    const promptGetOne = await Prompt.findOne({ _id: promptID }).populate(
      "storyline"
    );
    console.log(promptGetOne);
    if (promptGetOne !== null) {
      try {
        const userGetOne = await User.findOne({ _id: promptGetOne.owner });
        // const getNodes = await User.findOne({ _id: promptGetOne.owner });
        const payload = {
          additionalInfo: promptGetOne.additionalInfo,
          bannerURL: promptGetOne.bannerURL,
          createdAt: promptGetOne.createdAt,
          followers: promptGetOne.followers,
          genre: promptGetOne.genre,
          owner: promptGetOne.owner,
          username: userGetOne.username,
          promptText: promptGetOne.promptText,
          rating: promptGetOne.rating,
          status: promptGetOne.status,
          storyline: promptGetOne.storyline,
          title: promptGetOne.title,
          updatedAt: promptGetOne.updatedAt,
          _id: promptGetOne._id,
        };
        //payload.username = userGetOne.username;
        res.send(payload);
      } catch {
        console.log("cannot find owner of prompt");
        res.status(500).send("error when finding prompt, db error");
      }
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

router.post("/withstoryline", async (req, res) => {
  try {
    //create one prompt
    const storylineCreate = await Storyline.create({ owner: req.body.owner });
    console.log(storylineCreate);
    req.body.storyline = storylineCreate._id;
    const promptCreate = await Prompt.create(req.body);
    await Storyline.updateOne(
      { _id: storylineCreate._id },
      { prompt: promptCreate._id }
    );
    await User.updateOne(
      { _id: promptCreate.owner },
      { $push: { ownedPrompts: promptCreate._id } }
    );
    res.send(promptCreate);
  } catch (error) {
    console.error(error);
    res.status(400).send("error when adding prompt with storyline, bad input");
  }
});

// router.post("/sample", async (req, res) => {
//   //create a sample prompt
//   const sampleData = {
//     title: "letter runner",
//     promptText: "asdasdasd",
//     additionalInfo: "asdasdasd",
//     owner: "62075a212c3cd68e34ad35f2",
//     storyline: ["62075a212c3cd68e34ad35f2", "62075a212c3cd68e34ad35f2"],
//     rating: "Everyone",
//     genre: "Thriller",
//     bannerURL:
//       "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80",
//   };
//   try {
//     const promptCreate = await Prompt.create(sampleData);
//     res.send(promptCreate);
//   } catch (error) {
//     console.error(error);
//     res.status(400).send("error when adding prompt, bad input");
//   }
// });

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

router.put("/follow/:promptID", async (req, res) => {
  //toggle follow status
  console.log("updating one prompt, find via _id");

  try {
    const filterID = { _id: req.params.promptID };
    const followStatus = req.body.followStatus;
    const userID = req.body.userID;
    console.log(followStatus)
    if (followStatus == "true") {
      console.log("following")
      const promptUpdate = await Prompt.updateOne(
        { _id: filterID },
        {
          $push: { followers: userID },
        }
      );
      const userUpdate = await User.updateOne(
        { _id: userID },
        {
          $push: { followedPrompts: filterID },
        }
      );
      res.send({promptUpdate, userUpdate});
    } else {
      console.log("unfollowing")
      const promptUpdate = await Prompt.updateOne(
        { _id: filterID },
        {
          $pull: { followers: userID },
        }
      );
      const userUpdate = await User.updateOne(
        { _id: userID },
        {
          $pull: { followedPrompts: filterID },
        }
      );
      res.send({promptUpdate, userUpdate});
    }
  } catch (error) {
    console.error(error);
    //likely the promptID was not a string of 12 bytes or a string of 24 hex characters
    res.status(400).send("error when updating follow status, bad input");
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

router.delete("/withstoryline", async (req, res) => {
  try {
    //delete one prompt with storyline and all associated nodes
    await Node.deleteMany({
      _id: { $in: req.body.storyline[0].storyNodes },
    });
    await User.updateMany(
      {},
      {
        $pull: { ownedPrompts: req.body._id },
      }
    );
    await User.updateMany(
      {},
      {
        $pull: { followedPrompts: req.body._id },
      }
    );
    await Node.deleteMany({
      _id: { $in: req.body.storyline[0].proposedNodes },
    });
    await Storyline.deleteOne({
      _id: req.body.storyline[0]._id,
    });
    const promptDelete = await Prompt.deleteOne({ _id: req.body._id });
    await User.updateOne(
      { _id: req.body.owner },
      { $pull: { ownedPrompts: req.body._id } }
    );
    res.send(promptDelete);
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .send("error when deleting prompt with storyline, bad input");
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
