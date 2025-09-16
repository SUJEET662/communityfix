import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../utils/api";

const MunicipalDepartment = () => {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    publicSpace: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [publicSpaces, setPublicSpaces] = useState([]);

  useEffect(() => {
    fetchDepartmentIssues();
    fetchPublicSpaceData();
  }, [selectedStatus]);

  const fetchDepartmentIssues = async () => {
    try {
      const response = await api.get("/issues");
      const municipalIssues = response.data.data.filter(
        (issue) =>
          issue.category &&
          (issue.category.includes("Park") ||
            issue.category.includes("Public") ||
            issue.category.includes("Municipal") ||
            issue.category.includes("Playground"))
      );

      setIssues(municipalIssues);


      const total = municipalIssues.length;
      const pending = municipalIssues.filter(
        (issue) => issue.status === "reported" || issue.status === "assigned"
      ).length;
      const inProgress = municipalIssues.filter(
        (issue) => issue.status === "in_progress"
      ).length;
      const resolved = municipalIssues.filter(
        (issue) => issue.status === "resolved" || issue.status === "closed"
      ).length;
      const publicSpace = municipalIssues.filter(
        (issue) => issue.tags && issue.tags.includes("public-space")
      ).length;

      setStats({
        total,
        pending,
        inProgress,
        resolved,
        publicSpace,
      });
    } catch (error) {
      console.error("Error fetching municipal issues:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPublicSpaceData = async () => {
    try {
      // Simulate fetching public space data
      const mockPublicSpaceData = [
        { name: "Central Park", condition: "Good", visitors: "High" },
        { name: "City Library", condition: "Excellent", visitors: "Medium" },
        { name: "Community Center", condition: "Fair", visitors: "Low" },
      ];
      setPublicSpaces(mockPublicSpaceData);
    } catch (error) {
      console.error("Error fetching public space data:", error);
    }
  };

  const updateIssueStatus = async (issueId, newStatus) => {
    try {
      await api.put(`/issues/${issueId}`, { status: newStatus });
      fetchDepartmentIssues();
    } catch (error) {
      console.error("Error updating issue status:", error);
    }
  };

  const markAsPublicSpace = async (issueId) => {
    try {
      await api.put(`/issues/${issueId}`, {
        priority: "high",
        tags: ["public-space"],
      });
      fetchDepartmentIssues();
      alert("Marked as public space issue!");
    } catch (error) {
      console.error("Error marking public space:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">
            Loading municipal department issues...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Municipal Department Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Manage parks, public buildings, and community spaces
              </p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-lg">
              <p className="text-sm">Municipal Officer</p>
              <p className="font-semibold">{user.username}</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="fas fa-building text-blue-600 text-xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-blue-600">{stats.total}</h3>
            <p className="text-gray-600">Total Issues</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="fas fa-tree text-green-600 text-xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-green-600">
              {stats.publicSpace}
            </h3>
            <p className="text-gray-600">Public Space</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="fas fa-clock text-red-600 text-xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-red-600">{stats.pending}</h3>
            <p className="text-gray-600">Pending</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="fas fa-tools text-orange-600 text-xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-orange-600">
              {stats.inProgress}
            </h3>
            <p className="text-gray-600">In Progress</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="fas fa-check-circle text-purple-600 text-xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-purple-600">
              {stats.resolved}
            </h3>
            <p className="text-gray-600">Resolved</p>
          </div>
        </div>

        {/* Public Spaces Status */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Public Spaces Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {publicSpaces.map((space, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <h3 className="font-semibold text-lg">{space.name}</h3>
                <p
                  className={`font-medium ${
                    space.condition === "Excellent"
                      ? "text-green-600"
                      : space.condition === "Good"
                      ? "text-blue-600"
                      : "text-yellow-600"
                  }`}
                >
                  Condition: {space.condition}
                </p>
                <p className="text-sm text-gray-600">
                  Visitors: {space.visitors}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Issues List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Municipal Issues
          </h2>

          {issues.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-building text-gray-400 text-3xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No Municipal Issues Found
              </h3>
              <p className="text-gray-500">
                There are no municipal or public space issues currently
                reported.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {issues.map((issue) => (
                <div
                  key={issue._id}
                  className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-semibold text-gray-800">
                          {issue.title}
                        </h3>
                        <div className="flex gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              issue.priority === "high"
                                ? "bg-red-100 text-red-800"
                                : issue.priority === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {issue.priority} priority
                          </span>
                          {issue.tags &&
                            issue.tags.includes("public-space") && (
                              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                🏛️ Public Space
                              </span>
                            )}
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4">{issue.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            issue.status === "reported"
                              ? "bg-gray-100 text-gray-800"
                              : issue.status === "assigned"
                              ? "bg-blue-100 text-blue-800"
                              : issue.status === "in_progress"
                              ? "bg-yellow-100 text-yellow-800"
                              : issue.status === "resolved"
                              ? "bg-green-100 text-green-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {issue.status.replace("_", " ")}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                          {issue.category}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          📍 {issue.location?.address || "No location"}
                        </span>
                      </div>

                      {issue.images && issue.images.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-700 mb-2">
                            Images:
                          </h4>
                          <div className="flex gap-2 flex-wrap">
                            {issue.images.map((image, index) => (
                              <img
                                key={index}
                                src={`http://localhost:5000${image}`}
                                alt={`Issue ${index + 1}`}
                                className="w-20 h-20 object-cover rounded-lg border"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="lg:w-80 space-y-4">
                      {/* Status Update */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Update Status:
                        </label>
                        <select
                          value={issue.status}
                          onChange={(e) =>
                            updateIssueStatus(issue._id, e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="reported">Reported</option>
                          <option value="assigned">Assigned</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>

                      {/* Public Space Button */}
                      <button
                        onClick={() => markAsPublicSpace(issue._id)}
                        className="w-full bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600"
                      >
                        🏛️ Mark as Public Space Issue
                      </button>

                      {/* Reporter Info */}
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">
                          Reported by:
                        </p>
                        <p className="font-semibold">
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
    </div>
  );
};

export default MunicipalDepartment;
