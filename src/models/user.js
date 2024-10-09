const mongoose = require("mongoose");

const userCollectionSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  emailID: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
  mobile: {
    type: Number,
  },
});

const UserCollectionModel = mongoose.model("user", userCollectionSchema);
//  !                      "collection name" (No caps) (singular pronounce)
//  In MongoDB the collection names are plural pronounced automatically. => "s" is added to given collection name.

module.exports = UserCollectionModel;
