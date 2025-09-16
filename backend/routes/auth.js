const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Department = require("../models/Department");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    data: {
      user,
    },
  });
};

router.post("/register", async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    const userData = {
      username,
      email,
      password,
      phone,
      role: "public",
    };

    const user = await User.create(userData);
    createSendToken(user, 201, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    console.log("🔐 Login endpoint hit!", req.body);
    const { email, password } = req.body;
    console.log("📧 Email received:", email);

    console.log('Login attempt:', email); 

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email }).select('+password');
    
    console.log('User found:', user ? user.email : 'None'); 

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect email or password'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    const isPasswordCorrect = await user.correctPassword(password);
    console.log('Password correct:', isPasswordCorrect);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect email or password'
      });
    }

    createSendToken(user, 200, res);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.post(
  "/create-department-user",
  protect,
  authorize("admin"),
  async (req, res) => {
    try {
      const { username, email, password, role, department, phone } = req.body;

      const validDepartmentRoles = [
        "electrical",
        "pwd",
        "municipal",
        "water",
        "sanitation",
      ];
      if (!validDepartmentRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Invalid department role",
        });
      }

      const userData = {
        username,
        email,
        password,
        role,
        department,
        phone,
      };

      const user = await User.create(userData);
      createSendToken(user, 201, res);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/users", protect, authorize("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
