const db = require("../config/db");

exports.getPendingReports = (req, res) => {
  const sql = `
    SELECT
      id,
      user_id,
      image_path,
      disease_name,
      confidence,
      status,
      created_at
    FROM disease_reports
    WHERE status = 'pending'
    ORDER BY created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database Error:", err);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch pending reports",
        error: err.message
      });
    }

    res.json({
      success: true,
      reports: results
    });
  });
};

exports.reviewReport = (req, res) => {
  const {
    report_id,
    expert_id,
    decision,
    comments
  } = req.body;

  if (!report_id || !expert_id || !decision) {
    return res.status(400).json({
      success: false,
      message: "report_id, expert_id and decision are required"
    });
  }

  if (!["verified", "rejected"].includes(decision)) {
    return res.status(400).json({
      success: false,
      message: "Decision must be verified or rejected"
    });
  }

  const checkExpertSql = `
    SELECT id
    FROM users
    WHERE id = ? AND role = 'expert'
  `;

  db.query(
    checkExpertSql,
    [expert_id],
    (expertError, expertResults) => {
      if (expertError) {
        return res.status(500).json({
          success: false,
          message: "Failed to verify expert"
        });
      }

      if (expertResults.length === 0) {
        return res.status(403).json({
          success: false,
          message: "User is not a valid expert"
        });
      }

      const checkReportSql = `
        SELECT id, status
        FROM disease_reports
        WHERE id = ?
      `;

      db.query(
        checkReportSql,
        [report_id],
        (reportError, reports) => {
          if (reportError) {
            return res.status(500).json({
              success: false,
              message: "Failed to check disease report"
            });
          }

          if (reports.length === 0) {
            return res.status(404).json({
              success: false,
              message: "Disease report not found"
            });
          }

          if (reports[0].status !== "pending") {
            return res.status(400).json({
              success: false,
              message: "This report has already been reviewed"
            });
          }

          const insertReviewSql = `
            INSERT INTO expert_reviews
            (report_id, expert_id, decision, comments)
            VALUES (?, ?, ?, ?)
          `;

          db.query(
            insertReviewSql,
            [
              report_id,
              expert_id,
              decision,
              comments || null
            ],
            (reviewError, result) => {
              if (reviewError) {
                console.error("Review Error:", reviewError);

                return res.status(500).json({
                  success: false,
                  message: "Failed to save expert review",
                  error: reviewError.message
                });
              }

              const updateReportSql = `
                UPDATE disease_reports
                SET status = ?
                WHERE id = ?
              `;

              db.query(
                updateReportSql,
                [decision, report_id],
                (updateError) => {
                  if (updateError) {
                    return res.status(500).json({
                      success: false,
                      message:
                        "Review saved but report status update failed"
                    });
                  }

                  return res.json({
                    success: true,
                    message:
                      "Expert review submitted successfully",
                    reviewId: result.insertId,
                    reportId: report_id,
                    decision
                  });
                }
              );
            }
          );
        }
      );
    }
  );
};