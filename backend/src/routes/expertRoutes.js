const express = require("express");

const router = express.Router();

const {
  getPendingReports,
  reviewReport
} = require("../controllers/expertController");

router.get("/pending", getPendingReports);

router.post("/review", reviewReport);

module.exports = router;