const URL =
  "mongodb+srv://balamanohar:tM0Sg3H35u4XHSp6@balacluster.7ljzw.mongodb.net/";

const { MongoClient } = require("mongodb");
const client = new MongoClient(URL);

const dbName = "firstDataBAse";
const collectionName = "User";

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  // the following code examples can be pasted here...

  // read
  const findResult = await collection.find({}).toArray();
  console.log(findResult);

  return "done.";
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());
