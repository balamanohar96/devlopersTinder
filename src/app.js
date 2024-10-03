const express = require("express");
const app = express();

app.use("/", (req, res) => {
  res.send("hello bala manohar");
});

app.listen(3000, () => {
  console.log("server started at 3000");
});
