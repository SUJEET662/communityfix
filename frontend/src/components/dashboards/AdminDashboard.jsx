import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import StatusUpdateModal from "../StatusUpdateModal";
import ImageModal from "../ImageModal";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalIssues: 0,
    resolvedIssues: 0,
    departments: [],
    issuesByDepartment: {},
    issuesByStatus: {},
    recentIssues: [],
    recentUsers: [],
    issuesByPriority: {},
    dailyStats: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [allIssues, setAllIssues] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [usersRes, issuesRes, departmentsRes] = await Promise.all([
        api.get("/api/auth/users"),
        api.get("/api/issues?limit=500"),
        api.get("/api/departments"),
      ]);

      // Debug: Log the API responses to see their structure
      console.log("Users response:", usersRes);
      console.log("Issues response:", issuesRes);
      console.log("Departments response:", departmentsRes);

      // Extract data based on common API response patterns
      let usersData = [];
      if (usersRes.data && Array.isArray(usersRes.data)) {
        usersData = usersRes.data;
      } else if (
        usersRes.data &&
        usersRes.data.data &&
        Array.isArray(usersRes.data.data)
      ) {
        usersData = usersRes.data.data;
      } else if (
        usersRes.data &&
        usersRes.data.users &&
        Array.isArray(usersRes.data.users)
      ) {
        usersData = usersRes.data.users;
      }

      let issuesData = [];
      if (issuesRes.data && Array.isArray(issuesRes.data)) {
        issuesData = issuesRes.data;
      } else if (
        issuesRes.data &&
        issuesRes.data.data &&
        Array.isArray(issuesRes.data.data)
      ) {
        issuesData = issuesRes.data.data;
      } else if (
        issuesRes.data &&
        issuesRes.data.issues &&
        Array.isArray(issuesRes.data.issues)
      ) {
        issuesData = issuesRes.data.issues;
      } else if (
        issuesRes.data &&
        issuesRes.data.data &&
        issuesRes.data.data.issues &&
        Array.isArray(issuesRes.data.data.issues)
      ) {
        issuesData = issuesRes.data.data.issues;
      }

      let departmentsData = [];
      if (departmentsRes.data && Array.isArray(departmentsRes.data)) {
        departmentsData = departmentsRes.data;
      } else if (
        departmentsRes.data &&
        departmentsRes.data.data &&
        Array.isArray(departmentsRes.data.data)
      ) {
        departmentsData = departmentsRes.data.data;
      } else if (
        departmentsRes.data &&
        departmentsRes.data.departments &&
        Array.isArray(departmentsRes.data.departments)
      ) {
        departmentsData = departmentsRes.data.departments;
      }

      console.log("Extracted users:", usersData);
      console.log("Extracted issues:", issuesData);
      console.log("Extracted departments:", departmentsData);

      setAllIssues(issuesData);
      setUsers(usersData);

      const totalIssues = issuesData.length;
      const resolvedIssues = issuesData.filter(
        (issue) => issue.status === "resolved" || issue.status === "closed"
      ).length;

      // Calculate various statistics
      const issuesByDept = {};
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

      const dailyStats = generateDailyStats(issuesData);

      issuesData.forEach((issue) => {
        // Count issues by department
        if (issue.assignedTo && issue.assignedTo.name) {
          const dept = issue.assignedTo.name;
          issuesByDept[dept] = (issuesByDept[dept] || 0) + 1;
        } else if (
          issue.assignedToDepartment &&
          issue.assignedToDepartment.name
        ) {
          const dept = issue.assignedToDepartment.name;
          issuesByDept[dept] = (issuesByDept[dept] || 0) + 1;
        } else if (issue.department && issue.department.name) {
          const dept = issue.department.name;
          issuesByDept[dept] = (issuesByDept[dept] || 0) + 1;
        }

        // Count issues by status
        if (issue.status && issuesByStatus[issue.status] !== undefined) {
          issuesByStatus[issue.status]++;
        }

        // Count issues by priority
        if (issue.priority && issuesByPriority[issue.priority] !== undefined) {
          issuesByPriority[issue.priority]++;
        }
      });

      const recentIssues = issuesData.slice(0, 6);
      const recentUsers = usersData.slice(0, 5);

      setStats({
        totalUsers: usersData.length,
        totalIssues,
        resolvedIssues,
        departments: departmentsData,
        issuesByDepartment: issuesByDept,
        issuesByStatus,
        issuesByPriority,
        recentIssues,
        recentUsers,
        dailyStats,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const generateDailyStats = (issuesData) => {
    if (!issuesData || !issuesData.length) return [];

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

  // Prepare data for charts with fallbacks for empty data
  const departmentChartData = Object.entries(
    stats.issuesByDepartment || {}
  ).map(([name, value]) => ({
    name: name.length > 12 ? name.substring(0, 12) + "..." : name,
    value,
  }));

  const statusChartData = Object.entries(stats.issuesByStatus || {}).map(
    ([name, value]) => ({
      name: name.replace("_", " "),
      value,
      color: STATUS_COLORS[name] || "#8884D8",
    })
  );

  const priorityChartData = Object.entries(stats.issuesByPriority || {}).map(
    ([name, value]) => ({
      name,
      value,
      color: PRIORITY_COLORS[name] || "#8884D8",
    })
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <div className="text-gray-600">Loading dashboard data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          Welcome, {user?.username} ({user?.role})
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6 overflow-x-auto">
        {["overview", "issues", "users", "departments", "analytics"].map(
          (tab) => (
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
          )
        )}
      </div>

      {activeTab === "overview" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: "Total Users",
                value: stats.totalUsers,
                color: "blue",
                icon: "👥",
              },
              {
                label: "Total Issues",
                value: stats.totalIssues,
                color: "green",
                icon: "📋",
              },
              {
                label: "Resolved",
                value: stats.resolvedIssues,
                color: "purple",
                icon: "✅",
              },
              {
                label: "Pending",
                value: stats.totalIssues - stats.resolvedIssues,
                color: "orange",
                icon: "⏳",
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

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Issues by Status Chart */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Issues by Status
              </h3>
              {statusChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
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
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500">
                  No status data available
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Daily Activity (Last 7 Days)
              </h3>
              {stats.dailyStats && stats.dailyStats.length > 0 ? (
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
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500">
                  No daily activity data available
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Recent Issues
            </h3>
            {stats.recentIssues && stats.recentIssues.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.recentIssues.map((issue) => (
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
                                src={`https://communityfix-backend.onrender.com${image}`}
                                alt={`Issue ${index + 1}`}
                                className="w-16 h-16 object-cover rounded-lg border border-gray-300 cursor-pointer"
                                onClick={() =>
                                  openImageModal(
                                    `http://localhost:5000${image}`
                                  )
                                }
                                onError={(e) => {
                                  e.target.src =
                                    "/images/placeholder-image.jpg";
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
                        {issue.status?.replace("_", " ") || "Unknown"}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(
                          issue.priority
                        )}`}
                      >
                        {issue.priority || "Unknown"}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {issue.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {issue.createdAt
                          ? new Date(issue.createdAt).toLocaleDateString()
                          : "Unknown date"}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedIssue(issue);
                          setShowStatusModal(true);
                        }}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                No issues found
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "issues" && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              All Issues ({allIssues.length})
            </h2>
            <div className="flex gap-2">
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option>Sort by: Newest</option>
                <option>Sort by: Oldest</option>
                <option>Sort by: Status</option>
              </select>
            </div>
          </div>

          {allIssues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allIssues.map((issue) => (
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
                              src={`https://communityfix-backend.onrender.com${image}`}
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
                      {issue.status?.replace("_", " ") || "Unknown"}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(
                        issue.priority
                      )}`}
                    >
                      {issue.priority || "Unknown"}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                      {issue.category || "Uncategorized"}
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
                      {issue.createdAt
                        ? new Date(issue.createdAt).toLocaleDateString()
                        : "Unknown date"}
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
          ) : (
            <div className="text-center py-10 text-gray-500">
              No issues found
            </div>
          )}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            All Users ({users.length})
          </h2>
          {users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {u.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {u.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            u.role === "admin"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString()
                          : "Unknown date"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              No users found
            </div>
          )}
        </div>
      )}

      {/* Departments Tab */}
      {activeTab === "departments" && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Departments ({stats.departments.length})
          </h2>
          {stats.departments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Issues Assigned
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.departments.map((dept) => (
                    <tr key={dept._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {dept.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {stats.issuesByDepartment[dept.name] || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {dept.createdAt
                          ? new Date(dept.createdAt).toLocaleDateString()
                          : "Unknown date"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              No departments found
            </div>
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Issues by Department
              </h3>
              {departmentChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={departmentChartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Issues" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500">
                  No department data available
                </div>
              )}
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Issues by Priority
              </h3>
              {priorityChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={priorityChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      dataKey="value"
                    >
                      {priorityChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-500">
                  No priority data available
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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

export default AdminDashboard;
