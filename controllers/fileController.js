const pool = require("../config/db");
const path = require("path");

const allowedExtensions = {
  ".js": "javascript",
  ".ts": "typescript",
  ".java": "java",
  ".py": "python",
  ".cpp": "cpp",
  ".c": "c",
  ".cs": "csharp",
};

// Helper function to fetch user id using email

const uploadFile = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded.",
      });
    }

    const extension = path.extname(req.file.originalname).toLowerCase();

    const language = allowedExtensions[extension];

    if (!language) {
      return res.status(400).json({
        success: false,
        message: "Unsupported file type.",
      });
    }

    const filename = req.file.originalname;
    const content = req.file.buffer.toString("utf8");

    const existing = await pool.query(
      `SELECT file_id
   FROM documents
   WHERE filename = $1
   AND id = $2`,
      [filename, userId],
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "File already exists.",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO documents (filename, language, content, id)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `,
      [filename, language, content, userId],
    );

    return res.status(201).json({
      success: true,
      message: "File uploaded successfully.",
      file: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getAllFiles = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT
          file_id,
          filename,
          language,
          created_at
      FROM documents
      WHERE id = $1
      ORDER BY created_at DESC;
      `,
      [userId],
    );

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      files: result.rows,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch files.",
    });
  }
};

const getFileById = async (req, res) => {
  try {
    const userId = req.user.id;

    const { id: fileId } = req.params;

    const result = await pool.query(
      `
      SELECT
          file_id,
          filename,
          language,
          content,
          created_at,
          updated_at
      FROM documents
      WHERE file_id = $1
      AND id = $2;
      `,
      [fileId, userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "File not found.",
      });
    }

    return res.status(200).json({
      success: true,
      file: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch file.",
    });
  }
};

const createFile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { filename } = req.body;

    if (!filename) {
      return res.status(400).json({
        success: false,
        message: "Filename is required.",
      });
    }

    const extension = path.extname(filename).toLowerCase();

    const language = allowedExtensions[extension];

    if (!language) {
      return res.status(400).json({
        success: false,
        message: "Unsupported file type.",
      });
    }

    const existing = await pool.query(
      `
      SELECT file_id
      FROM documents
      WHERE filename = $1
      AND id = $2;
      `,
      [filename, userId],
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "File already exists.",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO documents (filename, language, content, id)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `,
      [filename, language, "", userId],
    );

    return res.status(201).json({
      success: true,
      file: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create file.",
    });
  }
};

const deleteFile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { id: fileId } = req.params;

    const result = await pool.query(
      `
      DELETE FROM documents
      WHERE file_id = $1
      AND id = $2
      RETURNING *;
      `,
      [fileId, userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "File not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "File deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete file.",
    });
  }
};

module.exports = {
  uploadFile,
  getAllFiles,
  getFileById,
  createFile,
  deleteFile,
};
