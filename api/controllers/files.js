const multer = require("multer");
const {GridFsStorage} = require("multer-gridfs-storage");
const { getGfs } = require("../db/db");


// Multer-GridFS Storage Setup
const storage = new GridFsStorage({
  url: process.env.MONGODB_URL,
  options: { useUnifiedTopology: true },
  file: (req, file) => {
    return {
      filename: file.originalname,
      bucketName: "uploads", // Files collection name
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
    res.status(201).json({ message: "File uploaded successfully", file: req.file });
  });
}

// Controller: Retrieve File
async function getFile(req, res) {    // To fetch a file 
  try {
    const gfs = getGfs(); //to get the GridFS instance for file operations
    const file = await gfs.files.findOne({ filename: req.params.filename });

    if (!file || file.length === 0) {
      return res.status(404).json({ error: "No file exists" });
    }

    // Create a read stream and pipe to the response
    const readStream = gfs.createReadStream(file.filename);
    readStream.pipe(res);
  } catch (err) {
    console.error("File retrieval error:", err);
    res.status(500).json({ error: "Failed to retrieve file" });
  }
}

module.exports = { uploadFile, getFile };
