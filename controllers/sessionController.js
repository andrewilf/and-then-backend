const express = require("express");
require("dotenv").config();
const User = require("../models/user");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    res.status(400).send("token not found");
  } else {
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        res.send("failed to authenticate");
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  }
};

//GET routes=================================================================================================

router.get("/check", verifyJWT, async (req, res) => {
  res.send("you are authenticated");
});

//POST routes=================================================================================================

router.post("/", async (req, res) => {
  try {
    console.log(`user trying to login`);
    const userEmail = req.body.email;
    const userPassword = req.body.password;
    const userAccountSearch = await User.findOne({ email: userEmail });
    if (userAccountSearch.length === 0) {
      console.log("email does not exist");
      res.status(400).send("error logging into account");
    } else if (!bcrypt.compareSync(userPassword, userAccountSearch.password)) {
      console.log("password incorrect");
      res.status(400).send("error logging into account");
    } else {
      console.log("login successful, creating token");
      const payload = {
        _id: userAccountSearch._id,
      };
      const token = jwt.sign(payload, process.env.SECRET, {
        expiresIn: "5m",
      });
      //const refreshToken = jwt.sign();
      //req.session.currentUser = userAccountSearch[0];
      //console.log("current user:", req.session.currentUser);
      //res.send(req.session.currentUser);
      res.json({ token: token, payload: payload });
    }
  } catch (error) {
    console.error(error);
    res.status(400).send("error when adding session");
  }
});

//DELETE routes===============================================================================================

// router.delete("/", async (req, res) => {
//   req.session.destroy(() => {
//     res.send("deleted session");
//   });
// });

module.exports = router;
