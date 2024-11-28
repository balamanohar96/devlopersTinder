const express = require("express");
const { userAuth } = require("../middleware/auth");
const UserModel = require("../models/user");
const ConnectionModel = require("../models/connections");
const router = express.Router();
const SHARE_USER_DATA_FIELDS = "firstName lastName gender skills about age";

// feed API - get all the users
router.get("/feed", userAuth, async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send("Cannot get feed data " + err.message);
  }
});

// get all pending connections
router.get("/requests/received", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const connections = await ConnectionModel.find({
      toUserId: userId,
      status: "interested",
    }).populate("fromUserId", SHARE_USER_DATA_FIELDS);
    res.json({ data: connections });
  } catch (err) {
    res.status(500).send("Err. " + err.message);
  }
});

// get all accepted connections
router.get("/connections", userAuth, async (req, res) => {
  try {
    const loggedUser=req.user
    const userId = loggedUser._id;
    const connections = await ConnectionModel.find({
      $or: [
        { toUserId: userId, status: "accepted" },
        { fromUserId: userId, status: "accepted" },
      ],
    })
      .populate("fromUserId", SHARE_USER_DATA_FIELDS)
      .populate("toUserId", SHARE_USER_DATA_FIELDS);

    const data = connections.map((eachDocument) => {
      if (eachDocument.fromUserId._id.toString() === loggedUser._id.toString()) {
        return eachDocument.toUserId;
      }
      return eachDocument.fromUserId;
    });
    res.json({ data });
  } catch (err) {
    res.status(500).send("Err. " + err.message);
  }
});

module.exports = router;
