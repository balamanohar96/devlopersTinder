const express = require("express");
const adminAuth = require("./middleware/auth");
const connectDB = require("./config/database");
const UserCollectionModel = require("./models/user");
const app = express();
app.use(express.json());
const {
  validateNewUser,
  validateUserCredentials,
} = require("./utils/validateUserInfo");
const bcrypt = require("bcrypt");

app.get("/feed", async (req, res) => {
  try {
    const users = await UserCollectionModel.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send("Cannot get feed data " + err.message);
  }
});

app.get("/user", async (req, res) => {
  const firstName = req.body.firstName;
  try {
    if (!firstName) {
      throw new Error("Please enter firstName");
    }
    const users = await UserCollectionModel.find({ firstName: firstName });
    res.send(users);
  } catch (err) {
    res.status(500).send("Cannot get user data. " + err.message);
  }
});

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

app.post("/login", async (req, res) => {
  const userCredentials = req.body;
  try {
    const { password, emailId } = userCredentials;
    validateUserCredentials(userCredentials);
    const user = await UserCollectionModel.findOne({ emailID: emailId });
    console.log(user);
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    console.log(isPasswordCorrect);
    if (!isPasswordCorrect) {
      throw new Error("Invalid credentials");
    }
    res.send("login successful");
  } catch (err) {
    res.status(500).send("ERR. " + err.message);
  }
});

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

app.get("/bala/:id", (req, res) => {
  console.log(req.params);
  res.send({ id: req.params.id, city: "guntur" });
});

app.get("/bala", (req, res) => {
  if (req.query?.brand) {
    res.send({ firstName: "bala", lastName: "manohar", laptop: req.query });
  } else {
    res.send([{ firstName: "bala", lastName: "manohar" }]);
  }
});

app.get("/admin", adminAuth, (req, res) => {
  res.send("admin");
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("something went wrong");
  }
});

connectDB()
  .then(() => {
    console.log("DB connected");
    app.listen(3000, () => {
      console.log("server started at 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
