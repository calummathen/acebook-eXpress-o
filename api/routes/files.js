const express = require("express");
const { uploadFile, getFile } = require("../controllers/files");

const router = express.Router();

router.post("/upload", uploadFile); // Route for uploading files
router.get("/files/:filename", getFile); // Route for retrieving files

module.exports = router;
