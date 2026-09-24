const express = require("express");

const router = express.Router();

const upload = require("../middleware/pestUploadMiddleware");

const {
  uploadPestImage
} = require("../controllers/pestController");

router.post(
  "/upload",
  upload.single("image"),
  uploadPestImage
);

module.exports = router;