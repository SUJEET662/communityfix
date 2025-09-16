// backend/seedDatabase.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await mongoose.connection.db.dropDatabase();
    console.log("Cleared existing data");

    const User = require("./models/User");
    const Department = require("./models/Department");

    // Create departments first
    const departments = await Department.insertMany([
      {
        name: "Electrical",
        description:
          "Handles electrical infrastructure, street lights, and power issues",
        contactEmail: "electrical@communityfix.com",
        contactPhone: "+1234567891",
        isActive: true,
      },
      {
        name: "PWD",
        description:
          "Public Works Department - handles roads, bridges, and infrastructure",
        contactEmail: "pwd@communityfix.com",
        contactPhone: "+1234567892",
        isActive: true,
      },
      {
        name: "Municipal",
        description:
          "Municipal corporation - handles public buildings, parks, and facilities",
        contactEmail: "municipal@communityfix.com",
        contactPhone: "+1234567893",
        isActive: true,
      },
      {
        name: "Water",
        description:
          "Water department - handles water supply, leakage, and drainage",
        contactEmail: "water@communityfix.com",
        contactPhone: "+1234567894",
        isActive: true,
      },
      {
        name: "Sanitation",
        description:
          "Sanitation department - handles garbage collection and sewage",
        contactEmail: "sanitation@communityfix.com",
        contactPhone: "+1234567895",
        isActive: true,
      },
    ]);
    console.log("Created departments");

    // Create users with properly hashed passwords
    const users = [
      {
        username: "admin_user",
        email: "admin@communityfix.com",
        password: "Admin@123", // Plain text - will be hashed by pre-save hook
        role: "admin",
        phone: "+1234567890",
        isActive: true,
      },
      {
        username: "electrical_officer",
        email: "electrical@communityfix.com",
        password: "Electrical@123", // Plain text
        role: "electrical",
        department: "Electrical",
        phone: "+1234567891",
        isActive: true,
      },
      {
        username: "pwd_officer",
        email: "pwd@communityfix.com",
        password: "Pwd@123", // Plain text
        role: "pwd",
        department: "PWD",
        phone: "+1234567892",
        isActive: true,
      },
      {
        username: "municipal_officer",
        email: "municipal@communityfix.com",
        password: "Municipal@123", // Plain text
        role: "municipal",
        department: "Municipal",
        phone: "+1234567893",
        isActive: true,
      },
      {
        username: "water_officer",
        email: "water@communityfix.com",
        password: "Water@123", // Plain text
        role: "water",
        department: "Water",
        phone: "+1234567894",
        isActive: true,
      },
      {
        username: "sanitation_officer",
        email: "sanitation@communityfix.com",
        password: "Sanitation@123", // Plain text
        role: "sanitation",
        department: "Sanitation",
        phone: "+1234567895",
        isActive: true,
      },
      {
        username: "public_user",
        email: "public@example.com",
        password: "Public@123", // Plain text
        role: "public",
        phone: "+1234567896",
        isActive: true,
      },
    ];

    for (const userData of users) {
      // Use User.create() which triggers the pre-save hook
      const user = await User.create(userData);
      console.log(`Created user: ${user.email}`);
    }

    console.log("\n=== Database seeded successfully! ===");
    console.log("\n=== Login Credentials ===");
    users.forEach((user) => {
      console.log(
        `Email: ${user.email} | Password: ${user.password} | Role: ${user.role}`
      );
    });
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    process.exit(0);
  }
};

seedDatabase();
