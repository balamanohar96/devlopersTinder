const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const token = cookies.token;
    if (!token) {
      throw new Error("Please login");
    }
    const decodedMsg = await jwt.verify(token, "DEVTINDER@96");
    const userId = decodedMsg.userId;
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(500).send("Err. " + err.message);
  }
};

module.exports = { userAuth };
