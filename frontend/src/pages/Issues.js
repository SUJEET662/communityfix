import React, { useState, useEffect } from "react";
import { issueService } from "../services/issues";
import { useAuth } from "../contexts/AuthContext";

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "all",
    category: "all",
    priority: "all",
    search: "",
  });
  const { user } = useAuth();

  useEffect(() => {
    loadIssues();
  }, []);

  useEffect(() => {
    filterIssues();
  }, [issues, filters]);

  const loadIssues = async () => {
    try {
      setLoading(true);
      const response = await issueService.getAll();
      setIssues(response.data.data || response.data);
    } catch (error) {
      console.error("Error loading issues:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterIssues = () => {
    let filtered = issues;

    if (filters.status !== "all") {
      filtered = filtered.filter((issue) => issue.status === filters.status);
    }

    if (filters.category !== "all") {
      filtered = filtered.filter(
        (issue) => issue.category === filters.category
      );
    }

    if (filters.priority !== "all") {
      filtered = filtered.filter(
        (issue) => issue.priority === filters.priority
      );
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        (issue) =>
          issue.title.toLowerCase().includes(searchTerm) ||
          issue.description.toLowerCase().includes(searchTerm) ||
          issue.location?.address?.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredIssues(filtered);
  };

  const handleVote = async (issueId, voteType) => {
    try {
      const response = await issueService.vote(issueId, voteType);
      setIssues((prev) =>
        prev.map((issue) => (issue._id === issueId ? response.data : issue))
      );
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "reported":
        return "bg-gray-100 text-gray-800";
      case "assigned":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      case "critical":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDepartmentColor = (category) => {
    const department = getDepartmentForCategory(category);
    switch (department) {
      case "Electrical":
        return "bg-yellow-100 text-yellow-800";
      case "Water":
        return "bg-blue-100 text-blue-800";
      case "PWD":
        return "bg-orange-100 text-orange-800";
      case "Sanitation":
        return "bg-green-100 text-green-800";
      case "Municipal":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDepartmentForCategory = (category) => {
    const categories = {
      Electrical: ["Street Light", "Power Outage", "Electrical Wiring"],
      Water: ["Water Supply", "Water Leakage", "Drainage"],
      PWD: ["Road Damage", "Potholes", "Bridge Repair"],
      Sanitation: ["Garbage Collection", "Sewage", "Public Toilets"],
      Municipal: ["Parks", "Public Buildings", "Playgrounds"],
    };

    for (const [department, deptCategories] of Object.entries(categories)) {
      if (deptCategories.includes(category)) {
        return department;
      }
    }
    return "Municipal";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading issues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Community Issues
              </h1>
              <p className="text-gray-600 mt-2">
                Track and monitor reported issues in your community
              </p>
            </div>
            <div className="mt-4 lg:mt-0">
              <p className="text-lg font-semibold text-gray-800">
                {filteredIssues.length} issue
                {filteredIssues.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Statuses</option>
                <option value="reported">Reported</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Categories</option>
                <option value="Street Light">Street Light</option>
                <option value="Power Outage">Power Outage</option>
                <option value="Electrical Wiring">Electrical Wiring</option>
                <option value="Water Supply">Water Supply</option>
                <option value="Water Leakage">Water Leakage</option>
                <option value="Road Damage">Road Damage</option>
                <option value="Potholes">Potholes</option>
                <option value="Garbage Collection">Garbage Collection</option>
                <option value="Sewage">Sewage</option>
                <option value="Parks">Parks</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={filters.priority}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, priority: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search issues..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Issues Grid */}
        <div className="grid grid-cols-1 gap-6">
          {filteredIssues.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-search text-gray-400 text-3xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No Issues Found
              </h3>
              <p className="text-gray-500">
                Try adjusting your filters or search terms
              </p>
            </div>
          ) : (
            filteredIssues.map((issue) => (
              <div
                key={issue._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Issue Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {issue.title}
                      </h3>
                      <div className="flex gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                            issue.status
                          )}`}
                        >
                          {issue.status.replace("_", " ")}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${getPriorityColor(
                            issue.priority
                          )}`}
                        >
                          {issue.priority}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">{issue.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${getDepartmentColor(
                          issue.category
                        )}`}
                      >
                        {issue.category}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                        {getDepartmentForCategory(issue.category)} Department
                      </span>
                      {issue.location?.address && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          📍 {issue.location.address}
                        </span>
                      )}
                    </div>

                    {issue.images && issue.images.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-700 mb-2">
                          Evidence Photos:
                        </h4>
                        <div className="flex gap-2 overflow-x-auto">
                          {issue.images.map((image, index) => (
                            <img
                              key={index}
                              src={`http://localhost:5000${image}`}
                              alt={`Evidence ${index + 1}`}
                              className="w-20 h-20 object-cover rounded-lg border"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>
                        Reported by {issue.reportedBy?.username} •{" "}
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </span>
                      <span>{issue.voteScore} votes</span>
                    </div>
                  </div>

                  {/* Voting Section */}
                  <div className="lg:w-48">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-3">
                        Community Support
                      </h4>
                      <div className="flex items-center justify-center gap-4 mb-3">
                        <button
                          onClick={() => handleVote(issue._id, "upvote")}
                          className="w-10 h-10 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors flex items-center justify-center"
                          title="Upvote this issue"
                        >
                          <i className="fas fa-thumbs-up"></i>
                        </button>
                        <span className="text-2xl font-bold text-gray-800">
                          {issue.voteScore}
                        </span>
                        <button
                          onClick={() => handleVote(issue._id, "downvote")}
                          className="w-10 h-10 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors flex items-center justify-center"
                          title="Downvote this issue"
                        >
                          <i className="fas fa-thumbs-down"></i>
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 text-center">
                        {issue.upvotes?.length || 0} upvotes •{" "}
                        {issue.downvotes?.length || 0} downvotes
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Issues;
