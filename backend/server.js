const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/database");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ ADD DEBUG LOGGING HERE
console.log("🔍 Starting to mount routes...");

try {
  console.log("🔄 Loading auth routes...");
  app.use("/api/auth", require("./routes/auth"));
  console.log("✅ Auth routes mounted successfully");
} catch (error) {
  console.error("❌ ERROR loading auth routes:", error.message);
}

try {
  console.log("🔄 Loading issues routes...");
  app.use("/api/issues", require("./routes/issues"));
  console.log("✅ Issues routes mounted successfully");
} catch (error) {
  console.error("❌ ERROR loading issues routes:", error.message);
}

try {
  console.log("🔄 Loading comments routes...");
  app.use("/api/comments", require("./routes/comments"));
  console.log("✅ Comments routes mounted successfully");
} catch (error) {
  console.error("❌ ERROR loading comments routes:", error.message);
}

try {
  console.log("🔄 Loading departments routes...");
  app.use("/api/departments", require("./routes/departments"));
  console.log("✅ Departments routes mounted successfully");
} catch (error) {
  console.error("❌ ERROR loading departments routes:", error.message);
}

console.log("🔍 All routes mounting attempted");

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
  });
});

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
