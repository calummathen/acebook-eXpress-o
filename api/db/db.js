const mongoose = require("mongoose");
const Grid = require('gridfs-stream');

let gfs;

async function connectToDatabase() {
  const mongoDbUrl = process.env.MONGODB_URL;

  if (!mongoDbUrl) {
    console.error(
      "No MongoDB url provided. Make sure there is a MONGODB_URL environment variable set. See the README for more details."
    );
    throw new Error("No connection string provided");
  }

  // Connect to MongoDB
  const connection = await mongoose.connect(mongoDbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  connection.connection.once("open", () => {
    gfs = Grid(connection.connection.db, mongoose.mongo);
    gfs.collection("uploads"); // Use 'uploads' as the collection name
    if (process.env.NODE_ENV !== "test") {
      console.log("GridFS is ready");
    }
  });

  if (process.env.NODE_ENV !== "test") {
    console.log("Successfully connected to MongoDB");
  }
}

// Getter for GridFS instance
function getGfs() {
  if (!gfs) {
    throw new Error("GridFS is not initialized. Ensure the database is connected first.");
  }
  return gfs;
}

module.exports = { connectToDatabase,  getGfs };
