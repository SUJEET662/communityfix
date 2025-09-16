const express = require("express");
const { protect } = require("../middleware/auth");
const router = express.Router();


router.get("/", (req, res) => {
  res.json({ message: "Comments endpoint" });
});

router.post("/", protect, (req, res) => {
  res.json({ message: "Create comment endpoint" });
});

module.exports = router;
