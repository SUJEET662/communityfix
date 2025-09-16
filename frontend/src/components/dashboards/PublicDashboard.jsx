import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

const PublicDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userIssues, setUserIssues] = useState([]);
  const [stats, setStats] = useState({
    reported: 0,
    inProgress: 0,
    resolved: 0,
  });

  useEffect(() => {
    fetchUserIssues();
  }, []);

  const fetchUserIssues = async () => {
    try {
      const response = await api.get("/issues");
      const userReportedIssues = response.data.data.filter(
        (issue) => issue.reportedBy && issue.reportedBy._id === user._id
      );

      setUserIssues(userReportedIssues);

      // Calculate stats
      const reported = userReportedIssues.length;
      const inProgress = userReportedIssues.filter(
        (issue) => issue.status === "in_progress" || issue.status === "assigned"
      ).length;
      const resolved = userReportedIssues.filter(
        (issue) => issue.status === "resolved" || issue.status === "closed"
      ).length;

      setStats({
        reported,
        inProgress,
        resolved,
      });
    } catch (error) {
      console.error("Error fetching user issues:", error);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome, {user.username}!</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-2xl font-bold text-blue-600">{stats.reported}</h3>
          <p className="text-gray-600">Reported Issues</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-2xl font-bold text-yellow-600">
            {stats.inProgress}
          </h3>
          <p className="text-gray-600">In Progress</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-2xl font-bold text-green-600">
            {stats.resolved}
          </h3>
          <p className="text-gray-600">Resolved Issues</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold mb-4">Report an Issue</h3>
          <p className="text-gray-600 mb-4">
            Found a problem in your community? Report it here.
          </p>
          <button
            onClick={() => navigate("/report")}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Report Issue
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold mb-4">View All Issues</h3>
          <p className="text-gray-600 mb-4">
            See all reported issues and track their progress.
          </p>
          <button
            onClick={() => navigate("/issues")}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
          >
            View Issues
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-8">
        <h2 className="text-2xl font-bold mb-4">Your Recent Reports</h2>

        {userIssues.length === 0 ? (
          <p className="text-gray-600">You haven't reported any issues yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {userIssues.slice(0, 5).map((issue) => (
              <div
                key={issue._id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">{issue.title}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                      issue.status
                    )}`}
                  >
                    {issue.status.replace("_", " ")}
                  </span>
                </div>
                <p className="text-gray-600 mt-2">{issue.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Reported on: {new Date(issue.createdAt).toLocaleDateString()}
                </p>
                {issue.assignedTo && (
                  <p className="text-sm text-gray-500">
                    Assigned to: {issue.assignedTo.name}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicDashboard;
