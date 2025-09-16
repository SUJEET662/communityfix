const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    location: {
      address: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Street Light",
        "Power Outage",
        "Electrical Wiring",
        "Road Damage",
        "Potholes",
        "Bridge Repair",
        "Garbage Collection",
        "Sewage",
        "Public Toilets",
        "Water Supply",
        "Water Leakage",
        "Drainage",
        "Parks",
        "Public Buildings",
        "Playgrounds",
      ],
    },
    status: {
      type: String,
      enum: [
        "reported",
        "under_review",
        "assigned",
        "in_progress",
        "resolved",
        "closed",
      ],
      default: "reported",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    images: [
      {
        type: String,
        default: [],
      },
    ],
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },
    assignedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    downvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    voteScore: {
      type: Number,
      default: 0,
    },
    departmentNotes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        note: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

issueSchema.pre("save", function (next) {
  this.voteScore = this.upvotes.length - this.downvotes.length;
  next();
});

issueSchema.pre('save', async function(next) {
  if (this.isModified('category') && !this.assignedTo) {
    let departmentName;
    
    const categoryMap = {
      'Street Light': 'Electrical',
      'Power Outage': 'Electrical',
      'Electrical Wiring': 'Electrical',
      'Water Supply': 'Water',
      'Water Leakage': 'Water',
      'Drainage': 'Water',
      'Road Damage': 'PWD',
      'Potholes': 'PWD',
      'Bridge Repair': 'PWD',
      'Garbage Collection': 'Sanitation',
      'Sewage': 'Sanitation',
      'Public Toilets': 'Sanitation',
      'Parks': 'Municipal',
      'Public Buildings': 'Municipal',
      'Playgrounds': 'Municipal'
    };
    
    departmentName = categoryMap[this.category] || 'Municipal';
    
    try {
      const Department = mongoose.models.Department || mongoose.model('Department');
      const department = await Department.findOne({ name: departmentName });
      if (department) {
        this.assignedTo = department._id;
        console.log(`Assigned issue to ${departmentName} department`);
      }
    } catch (error) {
      console.error('Error assigning department:', error);
    }
  }
  next();
});

module.exports = mongoose.model("Issue", issueSchema);
