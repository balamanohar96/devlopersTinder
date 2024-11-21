const express = require("express");
const { userAuth } = require("../middleware/auth");
const UserModel = require("../models/user");
const router = express.Router();

// feed API - get all the users
router.get("/feed", userAuth, async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send("Cannot get feed data " + err.message);
  }
});

module.exports = router;
