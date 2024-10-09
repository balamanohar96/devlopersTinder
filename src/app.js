const express = require("express");
const adminAuth = require("./middleware/auth");
const connectDB = require("./config/database");
const UserCollectionModel = require("./models/user");
const app = express();

app.post("/signup", async (req, res) => {
  const newUserInfo = {
    age: 4,
    firstName: "sai",
    emailID: "sai@gmail.com",
    mobile: 76545456,
  };
  const newDocument = new UserCollectionModel(newUserInfo);

  try {
    await newDocument.save();
    res.send("user created successfully");
  } catch (err) {
    res.status(500).send("connection to database failed");
  }
});

app.get("/user/:id", (req, res) => {
  console.log(req.params);
  res.send({ id: req.params.id, city: "guntur" });
});

app.get("/user", (req, res) => {
  if (req.query.brand) {
    console.log(req.query);
    res.send({ firstName: "bala", lastName: "manohar", laptop: req.query });
  } else {
    res.send({ firstName: "bala", lastName: "manohar" });
  }
});

app.get("/admin", adminAuth, (req, res) => {
  res.send("admin");
});

app.post("/user", (req, res) => {
  res.send("user created successfully");
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
