const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("file");

async function uploadFile(req, res) {
  upload(req, res, (err) => {
    console.log(req.file);
  });
}

const FilesController = {
  uploadFile: uploadFile,
};

module.exports = FilesController;
