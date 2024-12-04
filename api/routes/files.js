const express = require("express");
const { uploadFile, getFile } = require("../controllers/files");

const router = express.Router();

router.post("/files/upload", uploadFile); // Route for uploading files
router.get("/files", getFile); // Route for retrieving files

module.exports = router;
