const Issue = require("../models/Issue");
const User = require("../models/User");
const Department = require("../models/Department");

exports.getAllIssues = async (req, res) => {
  try {
    let filter = {};


    if (req.user.role.startsWith("department_")) {
      filter.assignedToDepartment = req.user.department;
    }

    else if (req.user.role === "public") {
      filter.submittedBy = req.user._id;
    }


    const issues = await Issue.find(filter)
      .populate("submittedBy", "username email")
      .populate("assignedToDepartment", "name category")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      results: issues.length,
      data: {
        issues,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate("submittedBy", "username email")
      .populate(
        "assignedToDepartment",
        "name category contactEmail contactPhone"
      );

    if (!issue) {
      return res.status(404).json({
        status: "error",
        message: "Issue not found",
      });
    }

    if (
      req.user.role === "public" &&
      !issue.submittedBy._id.equals(req.user._id)
    ) {
      return res.status(403).json({
        status: "error",
        message: "Access denied. You can only view your own issues.",
      });
    }

    if (
      req.user.role.startsWith("department_") &&
      (!issue.assignedToDepartment ||
        !issue.assignedToDepartment._id.equals(req.user.department))
    ) {
      return res.status(403).json({
        status: "error",
        message:
          "Access denied. You can only view issues assigned to your department.",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        issue,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.createIssue = async (req, res) => {
  try {
    const { title, description, category, address, location, images } =
      req.body;

    let assignedDepartment = null;
    if (category) {
      const department = await Department.findOne({
        category: { $regex: new RegExp(category, "i") },
      });
      assignedDepartment = department ? department._id : null;
    }

    const newIssue = await Issue.create({
      title,
      description,
      category,
      address,
      location,
      images,
      submittedBy: req.user._id,
      assignedToDepartment: assignedDepartment,
    });

    const populatedIssue = await Issue.findById(newIssue._id)
      .populate("submittedBy", "username email")
      .populate("assignedToDepartment", "name category");

    res.status(201).json({
      status: "success",
      data: {
        issue: populatedIssue,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};


exports.updateIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        status: "error",
        message: "Issue not found",
      });
    }

    if (req.user.role.startsWith("department_")) {
      if (
        !issue.assignedToDepartment ||
        !issue.assignedToDepartment.equals(req.user.department)
      ) {
        return res.status(403).json({
          status: "error",
          message:
            "Access denied. Can only update issues assigned to your department.",
        });
      }
    } else if (req.user.role === "public") {
      if (!issue.submittedBy.equals(req.user._id)) {
        return res.status(403).json({
          status: "error",
          message: "Access denied. Can only update your own issues.",
        });
      }
    }

    const updatedIssue = await Issue.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("submittedBy", "username email")
      .populate("assignedToDepartment", "name category");

    res.status(200).json({
      status: "success",
      data: {
        issue: updatedIssue,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        status: "error",
        message: "Issue not found",
      });
    }

    if (req.user.role !== "admin" && !issue.submittedBy.equals(req.user._id)) {
      return res.status(403).json({
        status: "error",
        message:
          "Access denied. Only admins and issue submitters can delete issues.",
      });
    }

    await Issue.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
