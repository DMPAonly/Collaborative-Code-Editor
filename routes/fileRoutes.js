const express = require("express");
const router = express.Router();

const upload = require("../config/multer");

const {
  uploadFile,
  getAllFiles,
  getFileById,
  createFile,
  deleteFile,
} = require("../controllers/fileController");

router.get("/workspace", getAllFiles);

router.get("/:id", getFileById);

router.post("/create", createFile);

router.post("/upload", upload.single("file"), uploadFile);

router.delete("/:id", deleteFile);

module.exports = router;
