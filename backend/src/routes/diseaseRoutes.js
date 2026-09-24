const express = require("express");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const db = require("../config/db");

router.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No image file received"
    });
  }

  const userId = req.body.user_id || null;
  const imagePath = req.file.path;

  // Step 1: Create a pending report
  const insertSql = `
    INSERT INTO disease_reports
    (user_id, image_path, status)
    VALUES (?, ?, 'pending')
  `;

  db.query(insertSql, [userId, imagePath], async (dbError, result) => {
    if (dbError) {
      console.error("Database Insert Error:", dbError);

      return res.status(500).json({
        success: false,
        message: "Failed to create disease report",
        error: dbError.message
      });
    }

    const reportId = result.insertId;

    try {
      // Step 2: Send image to Python AI service
      const form = new FormData();

      form.append(
        "image",
        fs.createReadStream(imagePath),
        {
          filename: req.file.originalname,
          contentType: req.file.mimetype
        }
      );

      const aiResponse = await axios.post(
        "http://127.0.0.1:5001/predict",
        form,
        {
          headers: form.getHeaders(),
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          timeout: 120000
        }
      );

      const {
        disease,
        confidence
      } = aiResponse.data;

      // Step 3: Update MySQL with AI result
      const updateSql = `
        UPDATE disease_reports
        SET disease_name = ?,
            confidence = ?,
            status = 'pending'
        WHERE id = ?
      `;

      db.query(
        updateSql,
        [disease, confidence, reportId],
        (updateError) => {
          if (updateError) {
            console.error("Database Update Error:", updateError);

            return res.status(500).json({
              success: false,
              message: "AI prediction completed but database update failed",
              reportId
            });
          }

          // Step 4: Return final result
          return res.status(201).json({
            success: true,
            message: "Disease detection completed",
            reportId,
            disease,
            confidence,
            status: "pending"
          });
        }
      );

    } catch (aiError) {
      console.error(
        "AI Service Error:",
        aiError.response?.data || aiError.message
      );

      return res.status(202).json({
        success: false,
        message: "Image uploaded, but AI prediction failed",
        reportId,
        status: "pending"
      });
    }
  });
});

module.exports = router;