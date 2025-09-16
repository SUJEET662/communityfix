const express = require("express");
const Issue = require("../models/Issue");
const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.priority) filter.priority = req.query.priority;

    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const issues = await Issue.find(filter)
      .populate("reportedBy", "username avatar")
      .populate("assignedTo", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Issue.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: issues.length,
      total,
      data: issues,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate("reportedBy", "username avatar")
      .populate("assignedTo", "name")
      .populate("upvotes", "username")
      .populate("downvotes", "username");

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    res.status(200).json({
      success: true,
      data: issue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.post("/", protect, upload.array("images", 5), async (req, res) => {
  try {
    req.body.reportedBy = req.user.id;

    if (req.files) {
      req.body.images = req.files.map(
        (file) => `/uploads/issues/${file.filename}`
      );
    }

    const issue = await Issue.create(req.body);


    await issue.populate("reportedBy", "username avatar");

    res.status(201).json({
      success: true,
      data: issue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
router.post('/:id/note', protect, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    issue.departmentNotes.push({
      user: req.user.id,
      note: req.body.note
    });

    await issue.save();
    
    res.status(200).json({
      success: true,
      data: issue
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.post("/:id/vote", protect, async (req, res) => {
  try {
    const { voteType } = req.body;
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    const hasUpvoted = issue.upvotes.includes(req.user.id);
    const hasDownvoted = issue.downvotes.includes(req.user.id);

    if (voteType === "upvote") {
      if (hasUpvoted) {
        issue.upvotes.pull(req.user.id);
      } else {
        issue.upvotes.push(req.user.id);
        if (hasDownvoted) {
          issue.downvotes.pull(req.user.id);
        }
      }
    } else if (voteType === "downvote") {
      if (hasDownvoted) {
        issue.downvotes.pull(req.user.id);
      } else {
        issue.downvotes.push(req.user.id);
        if (hasUpvoted) {
          issue.upvotes.pull(req.user.id);
        }
      }
    }

    await issue.save();

    res.status(200).json({
      success: true,
      data: issue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
