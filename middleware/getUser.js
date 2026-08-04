const pool = require("../config/db");

const getUser = async (req, res, next) => {
  try {
    const email = req.headers.email;

    if (!email) {
      return res.status(401).json({
        success: false,
        message: "Email is required.",
      });
    }

    const result = await pool.query(
      "SELECT id, email, full_name FROM users WHERE email = $1",
      [email],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    req.user = result.rows[0];

    next();
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to authenticate user.",
    });
  }
};

module.exports = getUser;
