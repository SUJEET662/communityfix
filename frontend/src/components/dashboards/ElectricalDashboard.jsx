import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import StatusUpdateModal from "../StatusUpdateModal";
import ImageModal from "../ImageModal";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

const ElectricalDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalIssues: 0,
    resolvedIssues: 0,
    issuesByStatus: {},
    issuesByPriority: {},
    recentIssues: [],
    dailyStats: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [electricalIssues, setElectricalIssues] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");

  const generateDailyStats = (issuesData) => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days.push(
        date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      );
    }

    return last7Days.map((date) => {
      const dayIssues = issuesData.filter(
        (issue) =>
          new Date(issue.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }) === date
      );

      return {
        date,
        issues: dayIssues.length,
        resolved: dayIssues.filter(
          (issue) => issue.status === "resolved" || issue.status === "closed"
        ).length,
      };
    });
  };

  const fetchDashboardData = useCallback(async () => {
    try {
      const issuesRes = await api.get("/api/issues?limit=500");
      const issuesData = issuesRes.data.data.issues || issuesRes.data.issues;

      const electricalIssuesData = issuesData.filter(
        (issue) => issue.assignedTo?.name === "Electrical Department"
      );

      setElectricalIssues(electricalIssuesData);

      const totalIssues = electricalIssuesData.length;
      const resolvedIssues = electricalIssuesData.filter(
        (issue) => issue.status === "resolved" || issue.status === "closed"
      ).length;

      const issuesByStatus = {
        reported: 0,
        in_progress: 0,
        resolved: 0,
        verification: 0,
        closed: 0,
      };
      const issuesByPriority = {
        high: 0,
        medium: 0,
        low: 0,
      };

      const dailyStats = generateDailyStats(electricalIssuesData);

      electricalIssuesData.forEach((issue) => {
        if (issue.status && issuesByStatus[issue.status] !== undefined) {
          issuesByStatus[issue.status]++;
        }
        if (issue.priority && issuesByPriority[issue.priority] !== undefined) {
          issuesByPriority[issue.priority]++;
        }
      });

      const recentIssues = electricalIssuesData.slice(0, 6);

      setStats({
        totalIssues,
        resolvedIssues,
        issuesByStatus,
        issuesByPriority,
        recentIssues,
        dailyStats,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [generateDailyStats]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredIssues(electricalIssues);
    } else {
      const newFilteredIssues = electricalIssues.filter(
        (issue) => issue.status === statusFilter
      );
      setFilteredIssues(newFilteredIssues);
    }
  }, [statusFilter, electricalIssues]);

  const handleStatusUpdate = async (issueId, newStatus, note) => {
    try {
      await api.put(`/api/issues/${issueId}/status`, {
        status: newStatus,
        note: note || `Status updated by ${user.username}`,
      });
      fetchDashboardData();
      setShowStatusModal(false);
      setSelectedIssue(null);
    } catch (error) {
      console.error("Error updating status:", error);
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
      case "in_progress":
        return "bg-blue-100 text-blue-800 border border-blue-300";
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

  const STATUS_COLORS = {
    reported: "#8884D8",
    in_progress: "#FFBB28",
    resolved: "#00C49F",
    verification: "#0088FE",
    closed: "#FF8042",
  };
  const PRIORITY_COLORS = {
    high: "#FF0000",
    medium: "#FFBB28",
    low: "#00C49F",
  };

  const statusChartData = Object.entries(stats.issuesByStatus).map(
    ([name, value]) => ({
      name: name.replace("_", " "),
      value,
      color: STATUS_COLORS[name],
    })
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <div className="text-gray-600">
            Loading Electrical Department dashboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Electrical Department Dashboard
        </h1>
        <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          Welcome, {user?.username} ({user?.role})
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6 overflow-x-auto">
        {["overview", "issues"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 whitespace-nowrap ${
              activeTab === tab
                ? "border-b-2 border-blue-500 text-blue-600 font-semibold"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Total Issues", value: stats.totalIssues, icon: "📋" },
              { label: "Resolved", value: stats.resolvedIssues, icon: "✅" },
              {
                label: "Pending",
                value: stats.totalIssues - stats.resolvedIssues,
                icon: "⏳",
              },
              {
                label: "High Priority",
                value: stats.issuesByPriority.high || 0,
                icon: "🚨",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {stat.value}
                    </p>
                    <p className="text-gray-600 text-sm">{stat.label}</p>
                  </div>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
              </div>
            ))}
          </div>


          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Issues by Status
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Daily Activity (Last 7 Days)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={stats.dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="issues"
                    stackId="1"
                    stroke="#0088FE"
                    fill="#0088FE"
                    fillOpacity={0.3}
                  />
                  <Area
                    type="monotone"
                    dataKey="resolved"
                    stackId="2"
                    stroke="#00C49F"
                    fill="#00C49F"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === "issues" && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              All Electrical Issues ({filteredIssues.length})
            </h2>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="reported">Reported</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIssues.map((issue) => (
              <div
                key={issue._id}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow"
              >
                {/* Issue Images */}
                {issue.images && issue.images.length > 0 && (
                  <div className="mb-3">
                    <div className="flex gap-2 mb-2">
                      {issue.images.slice(0, 3).map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={`http://localhost:5000${image}`}
                            alt={`Issue ${index + 1}`}
                            className="w-16 h-16 object-cover rounded-lg border border-gray-300 cursor-pointer"
                            onClick={() =>
                              openImageModal(`http://localhost:5000${image}`)
                            }
                            onError={(e) => {
                              e.target.src = "/images/placeholder-image.jpg";
                            }}
                          />
                          {index === 2 && issue.images.length > 3 && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center text-white text-xs">
                              +{issue.images.length - 3}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                  {issue.title}
                </h4>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                      issue.status
                    )}`}
                  >
                    {issue.status.replace("_", " ")}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(
                      issue.priority
                    )}`}
                  >
                    {issue.priority}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                    {issue.category}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {issue.description}
                </p>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-500">
                    {issue.location?.address || "No location"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">
                    By: {issue.reportedBy?.username || "Unknown"}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedIssue(issue);
                      setShowStatusModal(true);
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 transition-colors"
                  >
                    Update Status
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedIssue && (
        <StatusUpdateModal
          issue={selectedIssue}
          onClose={() => {
            setShowStatusModal(false);
            setSelectedIssue(null);
          }}
          onUpdate={handleStatusUpdate}
        />
      )}

      {/* Image Modal */}
      {showImageModal && selectedImage && (
        <ImageModal imageUrl={selectedImage} onClose={closeImageModal} />
      )}
    </div>
  );
};

export default ElectricalDashboard;
