import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import ImageModal from "../ImageModal";
import StatusUpdateModal from "../StatusUpdateModal";

const DepartmentDashboard = () => {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    verification: 0,
    closed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [noteInputs, setNoteInputs] = useState({});
  const [verificationImages, setVerificationImages] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    fetchDepartmentIssues();
  }, [selectedStatus]);

  const fetchDepartmentIssues = async () => {
    try {
      const response = await api.get("/api/issues?limit=100");
      const issuesData = response.data.data || response.data;

      const userDepartment = user.department || user.role;

      const departmentIssues = issuesData.filter((issue) => {
        if (issue.assignedTo && issue.assignedTo.name) {
          return issue.assignedTo.name
            .toLowerCase()
            .includes(userDepartment.toLowerCase());
        }

        if (issue.category) {
          return issue.category
            .toLowerCase()
            .includes(userDepartment.toLowerCase());
        }

        return false;
      });

      const filteredIssues =
        selectedStatus === "all"
          ? departmentIssues
          : departmentIssues.filter((issue) => issue.status === selectedStatus);

      setIssues(filteredIssues);

      const statusCounts = {
        reported: 0,
        assigned: 0,
        in_progress: 0,
        resolved: 0,
        verification: 0,
        closed: 0,
      };

      departmentIssues.forEach((issue) => {
        if (issue.status && statusCounts[issue.status] !== undefined) {
          statusCounts[issue.status]++;
        }
      });

      setStats({
        total: departmentIssues.length,
        pending: statusCounts.reported + statusCounts.assigned,
        inProgress: statusCounts.in_progress,
        resolved: statusCounts.resolved,
        verification: statusCounts.verification,
        closed: statusCounts.closed,
      });


      const initialNoteInputs = {};
      departmentIssues.forEach((issue) => {
        initialNoteInputs[issue._id] = "";
      });
      setNoteInputs(initialNoteInputs);
    } catch (error) {
      console.error("Error fetching department issues:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateIssueStatus = async (issueId, newStatus, note = "") => {
    try {
      await api.put(`/api/issues/${issueId}/status`, {
        status: newStatus,
        note: note || `Status updated to ${newStatus} by ${user.username}`,
      });

      fetchDepartmentIssues();
    } catch (error) {
      console.error("Error updating issue status:", error);
    }
  };

  const handleQuickStatusUpdate = async (issueId, newStatus) => {
    if (newStatus === "resolved") {
      const issue = issues.find((iss) => iss._id === issueId);
      setSelectedIssue(issue);
      setShowStatusModal(true);
    } else {
      await updateIssueStatus(issueId, newStatus);
    }
  };

  const handleStatusUpdateWithNote = async (newStatus, note) => {
    if (selectedIssue) {
      await updateIssueStatus(selectedIssue._id, newStatus, note);
      setShowStatusModal(false);
      setSelectedIssue(null);
    }
  };

  const addDepartmentNote = async (issueId) => {
    try {
      if (!noteInputs[issueId] || noteInputs[issueId].trim() === "") return;

      await api.post(`/api/issues/${issueId}/note`, {
        note: noteInputs[issueId],
        userId: user._id,
      });


      setNoteInputs((prev) => ({ ...prev, [issueId]: "" }));

      fetchDepartmentIssues();
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const handleNoteChange = (issueId, value) => {
    setNoteInputs((prev) => ({ ...prev, [issueId]: value }));
  };

  const handleVerificationImageChange = (issueId, e) => {
    const files = Array.from(e.target.files);
    setVerificationImages((prev) => ({ ...prev, [issueId]: files }));
  };

  const submitVerification = async (issueId) => {
    try {
      if (
        !verificationImages[issueId] ||
        verificationImages[issueId].length === 0
      ) {
        alert("Please upload at least one image for verification");
        return;
      }

      const formData = new FormData();
      verificationImages[issueId].forEach((file) => {
        formData.append("verificationImages", file);
      });

      await api.post(`/api/issues/${issueId}/verification`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await updateIssueStatus(issueId, "verification");

      setVerificationImages((prev) => ({ ...prev, [issueId]: null }));

      alert(
        "Verification submitted successfully! Waiting for user confirmation."
      );
    } catch (error) {
      console.error("Error submitting verification:", error);
      alert("Failed to submit verification. Please try again.");
    }
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setShowImageModal(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "reported":
        return "bg-gray-100 text-gray-800 border border-gray-300";
      case "assigned":
        return "bg-blue-100 text-blue-800 border border-blue-300";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "resolved":
        return "bg-green-100 text-green-800 border border-green-300";
      case "verification":
        return "bg-purple-100 text-purple-800 border border-purple-300";
      case "closed":
        return "bg-indigo-100 text-indigo-800 border border-indigo-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 border border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

  const getStatusOptions = (currentStatus) => {
    const options = {
      reported: ["assigned", "in_progress", "closed"],
      assigned: ["in_progress", "reported", "closed"],
      in_progress: ["resolved", "assigned", "closed"],
      resolved: ["verification", "closed", "in_progress"],
      verification: ["closed", "resolved"],
      closed: ["reported", "in_progress"],
    };

    return (
      options[currentStatus] || [
        "reported",
        "assigned",
        "in_progress",
        "resolved",
        "verification",
        "closed",
      ]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading department issues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 capitalize">
                {user.department || user.role} Department Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Manage issues assigned to your department
              </p>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg text-center">
              <p className="text-sm">Department Officer</p>
              <p className="font-semibold">{user.username}</p>
              <p className="text-xs opacity-90">
                {user.department || user.role}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            {
              label: "Total Issues",
              value: stats.total,
              color: "blue",
              icon: "📋",
            },
            {
              label: "Pending",
              value: stats.pending,
              color: "gray",
              icon: "⏰",
            },
            {
              label: "In Progress",
              value: stats.inProgress,
              color: "yellow",
              icon: "🔧",
            },
            {
              label: "Resolved",
              value: stats.resolved,
              color: "green",
              icon: "✅",
            },
            {
              label: "Verification",
              value: stats.verification,
              color: "purple",
              icon: "📸",
            },
            {
              label: "Closed",
              value: stats.closed,
              color: "indigo",
              icon: "🔒",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-4 text-center"
            >
              <div
                className={`w-10 h-10 bg-${stat.color}-100 rounded-full flex items-center justify-center mx-auto mb-2`}
              >
                <span className="text-xl">{stat.icon}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Filter Issues:
              </h3>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="reported">Reported</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="verification">Verification</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={fetchDepartmentIssues}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
              >
                <span className="mr-2">🔄</span>Refresh
              </button>
              <button
                onClick={() => {
                  alert("Export feature coming soon!");
                }}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center"
              >
                <span className="mr-2">📊</span>Export
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Assigned Issues ({issues.length})
            </h2>
            <span className="text-sm text-gray-600">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>

          {issues.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-3xl">📭</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No Issues Found
              </h3>
              <p className="text-gray-500">
                {selectedStatus === "all"
                  ? "There are no issues assigned to your department currently."
                  : `No issues with status "${selectedStatus}" found.`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {issues.map((issue) => (
                <div
                  key={issue._id}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow bg-white"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">
                          {issue.title}
                        </h3>
                        <div className="flex gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${getPriorityColor(
                              issue.priority
                            )}`}
                          >
                            {issue.priority} priority
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                              issue.status
                            )}`}
                          >
                            {issue.status.replace("_", " ")}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4">{issue.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm border border-gray-300">
                          {issue.category}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm border border-blue-300">
                          📍 {issue.location?.address || "No location"}
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm border border-green-300">
                          📅 {new Date(issue.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {(issue.images && issue.images.length > 0) ||
                      (issue.verificationImages &&
                        issue.verificationImages.length > 0) ? (
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-700 mb-3">
                            Images:
                          </h4>
                          <div className="flex gap-2 flex-wrap">
                            {issue.images?.map((image, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={`https://communityfix-backend.onrender.com${image}`}
                                  alt={`Issue ${index + 1}`}
                                  className="w-20 h-20 object-cover rounded-lg border border-gray-300 cursor-pointer transition-transform group-hover:scale-105"
                                  onClick={() =>
                                    openImageModal(
                                      `http://localhost:5000${image}`
                                    )
                                  }
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg cursor-pointer" />
                              </div>
                            ))}
                            {issue.verificationImages?.map((image, index) => (
                              <div
                                key={`verification-${index}`}
                                className="relative group"
                              >
                                <img
                                  src={`https://communityfix-backend.onrender.com${image}`}
                                  alt={`Verification ${index + 1}`}
                                  className="w-20 h-20 object-cover rounded-lg border border-purple-300 cursor-pointer transition-transform group-hover:scale-105"
                                  onClick={() =>
                                    openImageModal(
                                      `http://localhost:5000${image}`
                                    )
                                  }
                                />
                                <div className="absolute inset-0 bg-purple-500 bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg cursor-pointer" />
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      {issue.notes && issue.notes.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-700 mb-2">
                            Notes:
                          </h4>
                          <div className="space-y-2">
                            {issue.notes.map((note, index) => (
                              <div
                                key={index}
                                className="bg-gray-50 p-3 rounded-lg border border-gray-200"
                              >
                                <p className="text-gray-700">{note.note}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  By {note.addedBy?.username || "department"} •{" "}
                                  {new Date(
                                    note.createdAt
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Panel */}
                    <div className="lg:w-80 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Update Status:
                        </label>
                        <select
                          value={issue.status}
                          onChange={(e) =>
                            handleQuickStatusUpdate(issue._id, e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          {getStatusOptions(issue.status).map((status) => (
                            <option key={status} value={status}>
                              {status === "resolved"
                                ? "Mark as Resolved"
                                : status.replace("_", " ")}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Verification Section */}
                      {issue.status === "in_progress" && (
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                          <h4 className="font-semibold text-yellow-800 mb-2">
                            Ready for Verification?
                          </h4>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) =>
                              handleVerificationImageChange(issue._id, e)
                            }
                            className="w-full mb-3 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-white hover:file:bg-yellow-600"
                          />
                          <button
                            onClick={() => submitVerification(issue._id)}
                            className="w-full bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                          >
                            Submit Verification
                          </button>
                        </div>
                      )}

                      {/* Add Note */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Add Note:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add a note..."
                            value={noteInputs[issue._id] || ""}
                            onChange={(e) =>
                              handleNoteChange(issue._id, e.target.value)
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            onKeyPress={(e) =>
                              e.key === "Enter" && addDepartmentNote(issue._id)
                            }
                          />
                          <button
                            onClick={() => addDepartmentNote(issue._id)}
                            className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Reporter Info */}
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-600 mb-1">
                          Reported by:
                        </p>
                        <p className="font-semibold text-gray-800">
                          {issue.reportedBy?.username || "Unknown"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(issue.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <ImageModal imageUrl={selectedImage} onClose={closeImageModal} />
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedIssue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Add Resolution Notes</h3>
            <textarea
              placeholder="Describe how the issue was resolved..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
              rows="4"
            />
            <div className="flex gap-2">
              <button
                onClick={() =>
                  handleStatusUpdateWithNote("resolved", "Issue resolved")
                }
                className="bg-green-500 text-white px-4 py-2 rounded-lg flex-1"
              >
                Mark as Resolved
              </button>
              <button
                onClick={() => setShowStatusModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentDashboard;
