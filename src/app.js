const express = require("express");
const app = express();

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

const adminAuth = require("../middleware/auth");

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

app.listen(3000, () => {
  console.log("server started at 3000");
});
