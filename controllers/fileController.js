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

const uploadFile = async (req, res) => {
  try {
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

    const query = `
      INSERT INTO files (filename, language, content)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    const values = [filename, language, content];

    const result = await pool.query(query, values);

    res.status(201).json({
      success: true,
      message: "File uploaded successfully.",
      file: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getAllFiles = async (req, res) => {
  try {
    const query = `
            SELECT id,
                   filename,
                   language,
                   created_at
            FROM files
            ORDER BY created_at DESC;
        `;

    const result = await pool.query(query);

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
    const { id } = req.params;

    const query = `
      SELECT id,
             filename,
             language,
             content,
             created_at
      FROM files
      WHERE id = $1;
    `;

    const result = await pool.query(query, [id]);

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
      "SELECT id FROM files WHERE filename = $1",
      [filename],
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "File already exists.",
      });
    }

    const result = await pool.query(
      `INSERT INTO files(filename, language, content)
       VALUES($1,$2,$3)
       RETURNING *`,
      [filename, language, ""],
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
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM files WHERE id = $1 RETURNING *",
      [id],
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
