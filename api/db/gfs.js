const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

let gfs;

mongoose.connection.once("open", () => {
  gfs = new GridFSBucket(mongoose.connection.db, {
    bucketName: "uploads", // Match your bucketName in GridFsStorage
  });
  console.log("GridFSBucket initialized!");
});

function getGfs() {
  if (!gfs) {
    throw new Error("GridFSBucket is not initialized. Ensure the database connection is open.");
  }
  return gfs;
}

module.exports = { getGfs };