const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const diseaseRoutes = require("./routes/diseaseRoutes");
const expertRoutes = require("./routes/expertRoutes");
const pestRoutes = require("./routes/pestRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/disease", diseaseRoutes);
app.use("/api/expert", expertRoutes);
app.use("/api/pest", pestRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Crop Health System API Running"
  });
});

module.exports = app;