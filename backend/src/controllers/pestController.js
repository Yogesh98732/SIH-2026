const db = require("../config/db");

exports.uploadPestImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No pest image received"
    });
  }

  const userId = req.body.user_id || null;
  const imagePath = req.file.path;

  const sql = `
    INSERT INTO pest_reports
    (user_id, image_path, status)
    VALUES (?, ?, 'pending')
  `;

  db.query(
    sql,
    [userId, imagePath],
    (err, result) => {
      if (err) {
        console.error("Database Error:", err);

        return res.status(500).json({
          success: false,
          message: "Failed to create pest report",
          error: err.message
        });
      }

      res.status(201).json({
        success: true,
        message: "Pest image uploaded successfully",
        reportId: result.insertId,
        imagePath,
        status: "pending"
      });
    }
  );
};