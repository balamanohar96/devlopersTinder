const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userCollectionSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 30,
      trim: true,
    },
    lastName: {
      type: String,
      maxLength: 30,
      trim: true,
    },
    emailID: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      maxLength: 50,
      lowercase: true,
      validate(value) {
        const isValid = validator.isEmail(value);
        if (!isValid) {
          throw new Error("Invalid emailId");
        }
      },
    },
    password: {
      type: String,
      required: true,
      maxLength: 70,
      trim: true,
      validate(value) {
        const isStrong = validator.isStrongPassword(value);
        if (!isStrong) {
          throw new Error("Enter strong password");
        }
      },
    },
    age: {
      type: Number,
      required: true,
      min: 15,
      max: 120,
    },
    gender: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      validate(value) {
        const validOptions = ["male", "female"];
        const isValid = validOptions.includes(value);
        if (!isValid) {
          throw new Error("Please enter valid gender");
        }
      },
    },
    skills: {
      type: [],
      default: [],
      validate(arr) {
        if (arr.length > 10) {
          throw new Error("Cannot add more than 10 skills");
        }
      },
    },
    mobile: {
      type: Number,
      validate(value) {
        if (value.toString().length != 10) {
          throw new Error("Please provide a valid mobile number");
        }
      },
    },
    about: {
      type: String,
      maxLength: 30,
      trim: true,
    },
  },
  { timestamps: true }
);

userCollectionSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ userId: user._id }, "DEVTINDER@96", {
    expiresIn: "7d",
  });
  return token;
};

userCollectionSchema.methods.comparePassword = async function (userPassword) {
  const user = this;
  const hashPassword = user.password;
  const isPasswordCorrect = await bcrypt.compare(userPassword, hashPassword);
  return isPasswordCorrect;
};

const UserCollectionModel = mongoose.model("user", userCollectionSchema);
//  !                                 "collection name" => (lowerCase, Singular pronounce)
// ! In MongoDB the collection names are plural pronounced automatically. => "s" is added to given collection name.

module.exports = UserCollectionModel;
