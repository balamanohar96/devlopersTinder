const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.json());
app.use(cookieParser());
const signInRouter = require("./routes/signInOutUp");
const profileRouter = require("./routes/profile");
const feedRouter = require("./routes/feedConnections");
const requestsRouter = require("./routes/requests");

app.use("/", signInRouter);
app.use("/", profileRouter);
app.use("/", feedRouter);
app.use("/", requestsRouter);

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
