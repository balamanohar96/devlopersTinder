const express = require("express");
const { userAuth } = require("../middleware/auth");
const UserModel = require("../models/user");
const router = express.Router();

// Profile API
router.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.json({
      message: "profile details has been fetched successfully",
      data: user,
    });
  } catch (err) {
    res.status(500).send("ERR. " + err.message);
  }
});

// update the profile API
router.patch("/profile/edit", userAuth, async (req, res) => {
  const reqObj = req.body;
  const userId = req.user._id;
  const allowedUpdates = [
    "about",
    "skills",
    "age",
    "gender",
    "mobile",
    "lastName",
    "password",
  ];
  const isUpdateAllowed = Object.keys(reqObj).every((each) =>
    allowedUpdates.includes(each)
  );
  try {
    if (!isUpdateAllowed) {
      throw new Error("Some of the entries cannot be updated!");
    }
    await UserModel.findByIdAndUpdate(userId, reqObj);
    res.send("User updated successfully.");
  } catch (err) {
    res
      .status(500)
      .send("Something went wrong while updating the user. " + err.message);
  }
});

module.exports = router;
