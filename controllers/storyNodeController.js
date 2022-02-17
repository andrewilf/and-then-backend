const express = require("express");
require("dotenv").config();
const StoryNode = require("../models/storyNode");
const Prompt = require("../models/prompt");
const User = require("../models/user");
const Storyline = require("../models/storyline");
const router = express.Router();

///GET routes==================================================================================================

router.get("/all", async (req, res) => {
  console.log("get all story nodes");
  const nodeAll = await StoryNode.find({});
  //returns all nodes, should be an array of objects
  res.send(nodeAll);
});

router.get("/multi/:nodeArrayIDs", async (req, res) => {
  //searc for one node by _id
  try {
    const nodeArrayIDs = req.params.nodeArrayIDs.split(",");
    console.log("search for multiple nodes by _id");
    const nodeGetMany = await StoryNode.find({
      _id: { $in: nodeArrayIDs },
    }).populate("author");
    if (nodeGetMany !== null) {
      //console.log(nodeGetMany)
      const payload = nodeGetMany.map((element) => ({
        _id: element._id,
        text: element.text,
        author: element.author.username,
        authorID: element.author._id,
        updatedAt: element.updatedAt,
      }));
      res.send(payload);
    } else {
      //_id was of the correct format but no node was found
      res.status(404).send("story node not found");
    }
  } catch (error) {
    //likely the nodeID was not a string of 12 bytes or a string of 24 hex characters
    console.error(error);
    res.status(400).send("error when finding story node, bad input");
  }
});

router.get("/:nodeID", async (req, res) => {
  //searc for one node by _id
  try {
    const nodeID = req.params.nodeID;
    console.log("search for node by _id");
    const nodeGetOne = await StoryNode.findOne({ _id: nodeID });
    if (nodeGetOne !== null) {
      //returns one object
      res.send(nodeGetOne);
    } else {
      //_id was of the correct format but no node was found
      res.status(404).send("story node not found");
    }
  } catch (error) {
    //likely the nodeID was not a string of 12 bytes or a string of 24 hex characters
    console.error(error);
    res.status(400).send("error when finding story node, bad input");
  }
});

router.get("/:searchField/:searchValue", async (req, res) => {
  //search multiple nodes by defined field
  try {
    const searchField = req.params.searchField;
    const searchValue = req.params.searchValue;
    console.log(`search nodes by field: ${searchField}`);
    const checkFieldExists = Object.keys(StoryNode.schema.tree).find(
      //checks if the searchField is a valid field for the model
      (element) => element === searchField
    );
    const nodesGet = await StoryNode.find({ [searchField]: searchValue });
    if (nodesGet.length !== 0 && checkFieldExists) {
      //return valid response, should be an array of objects
      res.send(nodesGet);
    } else if (!checkFieldExists) {
      //searchField is not valid
      res.status(400).send(`"${searchField}" is not a valid field`);
    } else {
      //node field exists but no story node was found
      res
        .status(404)
        .send(
          `no story nodes were found with the parameter ${searchField}: ${searchValue}`
        );
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("error when finding story nodes");
  }
});

//POST routes=================================================================================================

router.post("/", async (req, res) => {
  try {
    //create one node
    const nodeCreate = await StoryNode.create(req.body);
    res.send(nodeCreate);
  } catch (error) {
    console.error(error);
    res.status(400).send("error when adding story node, bad input");
  }
});

router.post("/addtostoryline/:nodeID", async (req, res) => {
  try {
    const nodeID = req.params.nodeID;
    //move one proposed node to storyline, delete all proposed from storyline and db

    //add node to storyline storynode
    await Storyline.updateOne(
      { _id: req.body.storyline },
      { $push: { storyNodes: nodeID } }
    );

    const storylineToContinue = await Storyline.findOne({
      _id: req.body.storyline,
    });
    const DeleteNodeIDs = storylineToContinue.proposedNodes;
    DeleteNodeIDs.pop(nodeID);
    //clear proposed nodes from storyline
    await Storyline.updateOne(
      { _id: req.body.storyline },
      { $pull: { proposedNodes: { $in: DeleteNodeIDs } } }
    );
    //delete all other proposed nodes
    await Storyline.deleteMany({
      _id: { $in: DeleteNodeIDs },
    });
    res.send("added successfully to storyline");
  } catch (error) {
    console.error(error);
    res.status(400).send("error when adding story node, bad input");
  }
});

router.post("/sample", async (req, res) => {
  //create a sample node
  const sampleData = {
    text: "<p>hello world </p>",
    author: "62075a212c3cd68e34ad35f2",
    StorylineAttached: "62075a212c3cd68e34ad35f2",
  };
  try {
    const nodeCreate = await StoryNode.create(sampleData);
    res.send(nodeCreate);
  } catch (error) {
    console.error(error);
    res.status(400).send("error when adding story node, bad input");
  }
});

//PUT routes==================================================================================================

router.put("/:nodeID", async (req, res) => {
  //update one node by _id
  console.log("updating one story node, find via _id");

  try {
    const filterID = { _id: req.params.nodeID };
    const update = req.body;
    const nodeFind = await StoryNode.findOne(filterID);
    if (nodeFind !== null) {
      //found the node via _id
      const nodeUpdated = await StoryNode.updateOne(filterID, update);
      res.send(nodeUpdated);
    } else {
      //if story node not found, send 404 status
      res.status(404).send("No story nodes were found with that _id");
    }
  } catch (error) {
    console.error(error);
    //likely the nodeID was not a string of 12 bytes or a string of 24 hex characters
    res.status(400).send("error when updating nodes, bad input");
  }
});

//DELETE routes===============================================================================================

router.delete("/all", async (req, res) => {
  //delete all nodes, use carefully
  try {
    const nodesDelete = await StoryNode.deleteMany({});
    if (nodesDelete.deletedCount !== 0) {
      res.send(nodesDelete);
    } else {
      res
        .status(404)
        .send("No story nodes were found in the db, deletedCount: 0");
    }
  } catch (error) {
    console.error(error);
    res.status(400).send("error when deleting story nodes, bad input");
  }
});

router.delete("/:nodeID", async (req, res) => {
  //delete one story node by _id

  try {
    const nodeID = req.params.nodeID;
    const nodeDelete = await StoryNode.deleteOne({ _id: nodeID });
    if (nodeDelete.deletedCount !== 0) {
      res.send(nodeDelete);
    } else {
      res
        .status(404)
        .send("No story nodes were found with that id, deletedCount: 0");
    }
  } catch (error) {
    console.error(error);
    res.status(400).send("error when deleting story node, bad input");
  }
});

router.delete("/removeproposed/:nodeID", async (req, res) => {
  //delete one story node by _id

  try {
    const nodeID = req.params.nodeID;
    const nodeDelete = await StoryNode.deleteOne({ _id: nodeID });
    if (nodeDelete.deletedCount !== 0) {
      await Storyline.updateOne(
        { _id: req.body.storyline },
        { $pull: { proposedNodes: nodeID } }
      );
      res.send(nodeDelete);
    } else {
      res
        .status(404)
        .send("No story nodes were found with that id, deletedCount: 0");
    }
  } catch (error) {
    console.error(error);
    res.status(400).send("error when deleting story node, bad input");
  }
});

module.exports = router;
