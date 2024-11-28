const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionModel = require("../models/connections");
const UserModel = require("../models/user");
const router = express.Router();

// Send connection request API
router.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const fromUserId = user._id;
    const { toUserId, status } = req.params;
    // check1
    const allowedStatus = ["interested", "ignored"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).send("invalid status " + status);
    }
    //check2
    if (fromUserId.toString() === toUserId.toString()) {
      return res.status(400).send("cannot send request to self");
    }
    //check3
    if (toUserId.length !== 24) {
      return res.status(400).send("invalid userID");
    }
    //check4
    const genuineId = await UserModel.findById(toUserId);
    if (!genuineId) {
      return res.status(400).send("user Id is incorrect");
    }

    //check5
    const existingConnection = await ConnectionModel.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    if (existingConnection) {
      return res.status(400).send("connection already exists");
    }

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

// Review a pending connection request
router.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    const { status, requestId } = req.params;
    const user = req.user;
    try {
      //check1
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).send("invalid status");
      }
      //check2
      if (requestId.length !== 24) {
        return res.status(400).send("invalid requestID");
      }
      //check3
      const genuineId = await ConnectionModel.findById(requestId);
      if (!genuineId) {
        return res
          .status(400)
          .send("No connection present with this requestID");
      }

      const existingDocument = await ConnectionModel.findOne({
        status: "interested", //check4
        toUserId: user._id, //check5
        _id: requestId,
      });

      if (!existingDocument) {
        return res.status(400).json({
          message: "connection request not found",
        });
      }

      existingDocument.status = status;
      const data = await existingDocument.save();
      res.json({ message: "connection request accepted successfully", data });
    } catch (error) {
      res.status(500).send("Err. " + error.message);
    }
  }
);
module.exports = router;
