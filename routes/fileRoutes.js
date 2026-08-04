const express = require("express");
const router = express.Router();
const getUser = require("../middleware/getUser");

const upload = require("../config/multer");

const {
  uploadFile,
  getAllFiles,
  getFileById,
  createFile,
  deleteFile,
} = require("../controllers/fileController");

router.get("/", getUser, getAllFiles);

router.get("/:id", getUser, getFileById);

router.post("/create", getUser, createFile);

router.post("/upload", getUser, upload.single("file"), uploadFile);

router.delete("/:id", getUser, deleteFile);

module.exports = router;
