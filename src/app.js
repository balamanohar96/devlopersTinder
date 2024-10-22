const express = require("express");
const connectDB = require("./config/database");
const UserCollectionModel = require("./models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();
const {
  validateNewUser,
  validateUserCredentials,
} = require("./utils/validateUserInfo");
app.use(express.json());
app.use(cookieParser());
const { userAuth } = require("./middleware/auth");

// Signup API
app.post("/signup", async (req, res) => {
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
    const newDocument = new UserCollectionModel({
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
app.post("/login", async (req, res) => {
  const userCredentials = req.body;
  try {
    const { password, emailId } = userCredentials;
    validateUserCredentials(userCredentials);

    const user = await UserCollectionModel.findOne({ emailID: emailId });
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

// Profile API
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(500).send("ERR. " + err.message);
  }
});

// Send connection request API
app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  res.send(user.firstName + " sent request");
});

// feed API - get all the users
app.get("/feed", userAuth, async (req, res) => {
  try {
    const users = await UserCollectionModel.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send("Cannot get feed data " + err.message);
  }
});

// get user by emailId
app.get("/user", async (req, res) => {
  const emailId = req.body.emailId;
  try {
    if (!emailId) {
      throw new Error("Please enter emailID");
    }
    validateUserCredentials({ emailId });
    const user = await UserCollectionModel.find({ emailID: emailId });
    res.send(user);
  } catch (err) {
    res.status(500).send("Cannot get user data. " + err.message);
  }
});

// nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn
app.patch("/user/:userID", async (req, res) => {
  const reqObj = req.body;
  const userId = req.params.userID;
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
    await UserCollectionModel.findByIdAndUpdate(userId, reqObj);
    res.send("User updated successfully.");
  } catch (err) {
    res
      .status(500)
      .send("Something went wrong while updating the user. " + err.message);
  }
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("something went wrong");
  }
});

connectDB()
  .then(() => {
    app.listen(3000, () => {
      console.log("server started at 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
