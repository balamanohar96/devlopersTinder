const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionModel = require("../models/connections");
const UserModel = require("../models/user");
const router = express.Router();

// Send connection request API
router.post("/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const fromUserId = user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    // check1
    const allowedStatus = ["interested", "ignored"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).send("invalid status " + status);
    }
    //check2
    const existingConnection = await ConnectionModel.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    if (existingConnection) {
      return res.status(400).send("connection already exists");
    }
    //check3
    const genuineId = await UserModel.findById(toUserId);
    if (!genuineId) {
      return res.status(400).send("user Id is incorrect");
    }
    //check4
    if (fromUserId == toUserId) {
      return res.status(400).send("cannot send request to self");
    }
    console.log(typeof fromUserId, typeof toUserId);
    const newDocument = new ConnectionModel({
      fromUserId,
      toUserId,
      status,
    });
    const data = await newDocument.save();
    res.json({
      message: `You have sent ${status} connection`,
      data,
    });
  } catch (err) {
    res.status(500).send("Err. " + err.message);
  }
});

module.exports = router;
