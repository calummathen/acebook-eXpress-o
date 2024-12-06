const multer = require("multer");
const {GridFsStorage} = require("multer-gridfs-storage");
const { getGfs } = require("../db/gfs");
const { generateToken } = require("../lib/token");
const mongoose = require('mongoose');


// Multer-GridFS Storage Setup
const storage = new GridFsStorage({
  url: process.env.MONGODB_URL,
  options: { useUnifiedTopology: true },
  file: (req, file) => {
    return {
      filename: file.originalname,
      bucketName: "uploads", // Files collection name
      metadata: { uploadedBy: req.username },
    };
  },
});

const upload = multer({ storage }).single("file");

// Controller: Upload File
async function uploadFile(req, res) { // Handles file uploads.
  upload(req, res, (err) => {         // Executes the upload middleware to process the incoming file
    if (err) {
      console.error("File upload error:", err);
      return res.status(500).json({ error: "File upload failed" });
    }
    // Generate a new token
  const token = generateToken(req.user_id, req.username);

    res.status(201).json({ 
      message: "File uploaded successfully", 
      file: req.file });
  });
}

// Controller: Retrieve File
async function getFile(req, res) {
  try {
    const gfs = getGfs(); // Get the GridFSBucket instance
    const db = mongoose.connection.db;
    const file = await db.collection("uploads.files").findOne({ filename: req.params.filename }); // Correct file lookup
    console.log("Requested filename:", req.params.filename);
    console.log("Retrieved file:", file);

    if (!file) {
      return res.status(404).json({ error: "No file exists" });
    }

    // Authorization check: ensure the file belongs to the user
    if (file.metadata?.uploadedBy !== req.username) {
      return res.status(403).json({ error: "You are not authorized to access this file" });
    }

    // Generate a new token (if needed for response purposes)
    const token = generateToken(req.user_id, req.username);

    // Create a read stream for the file
    const readStream = gfs.openDownloadStream(file._id); // Use openDownloadStream with the file ID
    res.set("Content-Type", file.contentType);
    readStream.pipe(res); // Pipe the file to the response
  } catch (err) {
    console.error("File retrieval error:", err);
    res.status(500).json({ error: "Failed to retrieve file" });
  }
}
const PostsController = {
  uploadFile: uploadFile,
  getFile:getFile,
};

module.exports = { uploadFile, getFile };
