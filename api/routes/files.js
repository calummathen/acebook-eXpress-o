const express = require("express");
const router = express.Router();
const FilesController = require("../controllers/files");

router.post("/upload", FilesController.uploadFile);

module.exports = router;
