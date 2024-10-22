const mongoose = require("mongoose");

const connectDB = async () => {
  // ! DB names are case sensitive
  // if a DB already exits with the same name then it will insert a new document into given/mentioned collection.
  // if DB with given name is not found then a 'new DB' is created and 'new collection' is created and document is inserted into it.

  await mongoose.connect(
    "mongodb+srv://balamanohar:tM0Sg3H35u4XHSp6@balacluster.7ljzw.mongodb.net/firstDataBAse"
    // !                                                                       / DB name
  );
  console.log("DB connected");
};

module.exports = connectDB;
