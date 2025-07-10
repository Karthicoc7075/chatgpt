const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI || "YOUR_MONGODB_URI_HERE";

const client = new MongoClient(uri);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");
    return client.db("chatgpt_clone");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
}

module.exports = connectToDatabase;
