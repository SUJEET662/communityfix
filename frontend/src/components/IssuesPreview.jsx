import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { issueService } from "../services/issues";
import { useAuth } from "../contexts/AuthContext";
import ImageModal from "./ImageModal";
import StatusUpdateModal from "./StatusUpdateModal";
import VerificationModal from "./VerificationModal";

const IssuesPreview = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  useEffect(() => {
    const fetchRecentIssues = async () => {
      try {
        const response = await issueService.getAll({ limit: 6 }); // Increased limit to 6 to better show the layout
        setIssues(response.data);
      } catch (error) {
        console.error("Error loading recent issues:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentIssues();
  }, []);

  const statusColors = {
    reported: "bg-amber-500/10 text-amber-700 ring-1 ring-amber-500/20",
    in_progress: "bg-blue-500/10 text-blue-700 ring-1 ring-blue-500/20",
    resolved: "bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20",
    verification: "bg-purple-500/10 text-purple-700 ring-1 ring-purple-500/20",
    closed: "bg-gray-500/10 text-gray-700 ring-1 ring-gray-500/20",
  };

  const handleStatusUpdate = (issue) => {
    setSelectedIssue(issue);
    setShowStatusModal(true);
  };

  const handleVerification = (issue) => {
    setSelectedIssue(issue);
    setShowVerificationModal(true);
  };

  const handleStatusUpdateComplete = (updatedIssue) => {
    setIssues((prevIssues) =>
      prevIssues.map((issue) =>
        issue._id === updatedIssue._id ? updatedIssue : issue
      )
    );
    setShowStatusModal(false);
  };

  const handleVerificationComplete = (verifiedIssue) => {
    setIssues((prevIssues) =>
      prevIssues.map((issue) =>
        issue._id === verifiedIssue._id ? verifiedIssue : issue
      )
    );
    setShowVerificationModal(false);
  };

  const canUpdateStatus = () => {
    return user && user.role !== "public" && user.role !== "admin";
  };

  const canVerify = () => {
    return user && user.role === "public";
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div className="mb-6 md:mb-0">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Recent Community Issues
              </h2>
              <p className="text-gray-600 max-w-xl">
                Problems reported and being fixed in your neighborhood
              </p>
            </div>
            <div className="h-12 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm p-5 border border-gray-200 animate-pulse"
              >
                <div className="w-full h-40 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div className="mb-6 md:mb-0">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Recent Community Issues
              </h2>
              <p className="text-gray-600 max-w-xl">
                Problems reported and being fixed in your neighborhood
              </p>
            </div>
            <button
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center font-medium shadow-md hover:shadow-lg"
              onClick={() => navigate("/issues")}
            >
              View All Issues
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {issues.length > 0 ? (
              issues.map((issue) => (
                <div
                  key={issue._id}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 transition-all duration-300 overflow-hidden flex flex-col"
                >

                  {issue.images && issue.images.length > 0 ? (
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={`http://localhost:5000${issue.images[0]}`}
                        alt={issue.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onClick={() =>
                          setSelectedImage(
                            `http://localhost:5000${issue.images[0]}`
                          )
                        }
                      />
                      <div className="absolute top-3 left-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            statusColors[issue.status]
                          }`}
                        >
                          {issue.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-40 bg-gradient-to-r from-blue-50 to-cyan-50 flex items-center justify-center">
                      <div className="absolute top-3 left-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            statusColors[issue.status]
                          }`}
                        >
                          {issue.status.replace("_", " ")}
                        </span>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-blue-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Content Section */}
                  <div className="flex-1 p-4 flex flex-col">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {issue.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
                      {issue.description}
                    </p>

                    {/* Location and Date */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span className="flex items-center truncate">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5 mr-1 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {issue.location?.address || "Unspecified location"}
                      </span>
                      <span>
                        {new Date(issue.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    {/* Footer with User and Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center">
                        <img
                          src={
                            issue.reportedBy.avatar ||
                            "/images/profile-placeholder.png"
                          }
                          alt={issue.reportedBy.username}
                          className="w-6 h-6 rounded-full object-cover mr-2"
                        />
                        <span className="text-xs font-medium text-gray-700">
                          {issue.reportedBy.username}
                        </span>
                      </div>

                      {/* Status Update Button - Always visible if user can update */}
                      {canUpdateStatus() && (
                        <button
                          onClick={() => handleStatusUpdate(issue)}
                          className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md hover:bg-blue-100 transition-colors font-medium"
                        >
                          Update
                        </button>
                      )}
                      {/* Verify Button - Only show if relevant */}
                      {canVerify() && issue.status === "verification" && (
                        <button
                          onClick={() => handleVerification(issue)}
                          className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-md hover:bg-purple-100 transition-colors font-medium"
                        >
                          Verify
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-gray-300 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  No issues yet
                </h3>
                <p className="text-gray-500">
                  Be the first to report a community issue!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modals (unchanged) */}
      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
      {showStatusModal && selectedIssue && (
        <StatusUpdateModal
          issue={selectedIssue}
          onClose={() => setShowStatusModal(false)}
          onUpdate={handleStatusUpdateComplete}
        />
      )}
      {showVerificationModal && selectedIssue && (
        <VerificationModal
          issue={selectedIssue}
          onClose={() => setShowVerificationModal(false)}
          onVerify={handleVerificationComplete}
        />
      )}
    </>
  );
};

export default IssuesPreview;
