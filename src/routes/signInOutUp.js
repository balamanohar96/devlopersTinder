const express = require("express");
const {
  validateNewUser,
  validateUserCredentials,
} = require("../utils/validateUserInfo");
const UserModel = require("../models/user");
const router = express.Router();
const bcrypt = require("bcrypt");

// Signup API
router.post("/signup", async (req, res) => {
  const newUserInfo = req.body;
  const {
    password,
    emailId,
    firstName,
    lastName,
    gender,
    age,
    about,
    mobile,
    skills,
  } = newUserInfo;

  try {
    validateNewUser(newUserInfo);

    const passwordHash = await bcrypt.hash(password, 10);

    const newDocument = new UserModel({
      emailID: emailId,
      password: passwordHash,
      firstName,
      lastName,
      gender,
      age,
      about,
      mobile,
      skills,
    });

    await newDocument.save();
    res.send("user created successfully");
  } catch (err) {
    res.status(500).send("ERR. " + err.message);
  }
});

// Login API
router.post("/login", async (req, res) => {
  const userCredentials = req.body;
  try {
    const { password, emailId } = userCredentials;
    validateUserCredentials(userCredentials);

    const user = await UserModel.findOne({ emailID: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new Error("Invalid credentials");
    }

    const token = await user.getJWT();
    res.cookie("token", token);
    res.send("login successful ");
  } catch (err) {
    res.status(500).send("ERR. " + err.message);
  }
});

// Logout API
router.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("logout success");
});

module.exports = router;
