import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import StatusUpdateModal from "./StatusUpdateModal";
import VerificationModal from "./VerificationModal";
import ImageModal from "./ImageModal";

const IssueCard = ({ issue, onVote, onStatusUpdate, onVerification }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const formattedDate = new Date(issue.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleVote = (voteType) => {
    if (!user) {
      alert("Please login to vote");
      return;
    }
    onVote(issue._id, voteType);
  };

  const handleStatusUpdate = (newStatus, note) => {
    onStatusUpdate(issue._id, newStatus, note);
    setShowStatusModal(false);
  };

  const handleVerification = (images, note) => {
    onVerification(issue._id, images, note);
    setShowVerificationModal(false);
  };

  const openImageModal = (image) => {
    console.log("Opening image modal with:", image);
    setSelectedImage(image);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImage(null);
  };

  const hasUpvoted = user && issue.upvotes.includes(user._id);
  const hasDownvoted = user && issue.downvotes.includes(user._id);

  const statusColors = {
    reported: "bg-amber-100 text-amber-800 border-amber-200",
    in_progress: "bg-blue-100 text-blue-800 border-blue-200",
    resolved: "bg-emerald-100 text-emerald-800 border-emerald-200",
    verification: "bg-purple-100 text-purple-800 border-purple-200",
    closed: "bg-gray-100 text-gray-800 border-gray-200",
  };

  const priorityColors = {
    low: "bg-emerald-100 text-emerald-800 border-emerald-200",
    medium: "bg-amber-100 text-amber-800 border-amber-200",
    high: "bg-rose-100 text-rose-800 border-rose-200",
  };

  const statusIcons = {
    reported: "⏳",
    in_progress: "🛠️",
    resolved: "✅",
    verification: "🔍",
    closed: "🔒",
  };

  // Check if user can update status (not public user)
  const canUpdateStatus = user && user.role !== "public";

  // Check if user can verify (public user and status is verification)
  const canVerify =
    user && user.role === "public" && issue.status === "verification";

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transition-all hover:shadow-xl h-full flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {issue.title}
            </h3>
            <div className="flex flex-wrap gap-2 mb-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  statusColors[issue.status]
                }`}
              >
                {statusIcons[issue.status]} {issue.status.replace("_", " ")}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  priorityColors[issue.priority]
                }`}
              >
                {issue.priority} priority
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs border border-gray-200">
                {issue.category}
              </span>
            </div>
          </div>

          {canUpdateStatus && (
            <button
              onClick={() => setShowStatusModal(true)}
              className="ml-4 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Update Status
            </button>
          )}

          {canVerify && (
            <button
              onClick={() => setShowVerificationModal(true)}
              className="ml-4 px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm hover:bg-purple-200 transition-colors flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Verify
            </button>
          )}
        </div>

        <p className="text-gray-600 mb-4 leading-relaxed flex-grow">
          {issue.description}
        </p>

        {issue.notes && issue.notes.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Status Updates:
            </h4>
            <div className="space-y-2">
              {issue.notes.map((note, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-3 rounded-lg border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-medium text-gray-600">
                      {note.updatedBy?.username || "System"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(note.timestamp).toLocaleDateString()} at{" "}
                      {new Date(note.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{note.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {issue.images && issue.images.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Issue Images:
            </h4>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {issue.images.map((image, index) => (
                <div
                  key={index}
                  className="relative group cursor-pointer"
                  onClick={() => openImageModal(image)}
                >
                  <img
                    src={`http://localhost:5000${image}`}
                    alt={`Issue ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-lg shadow-sm transition-transform group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = "/images/placeholder-image.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-opacity flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {issue.location?.address && (
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs border border-gray-200 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
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
              {issue.location.address}
            </span>
          )}
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs border border-gray-200 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {formattedDate}
          </span>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all flex items-center ${
                  hasUpvoted
                    ? "bg-blue-500 text-white shadow-sm"
                    : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm"
                }`}
                onClick={() => handleVote("upvote")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
                {issue.upvotes.length}
              </button>
              <span className="font-bold text-lg min-w-[30px] text-center flex items-center justify-center mx-1">
                {issue.voteScore}
              </span>
              <button
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all flex items-center ${
                  hasDownvoted
                    ? "bg-red-500 text-white shadow-sm"
                    : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm"
                }`}
                onClick={() => handleVote("downvote")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                {issue.downvotes.length}
              </button>
            </div>
          </div>

          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate(`/profile/${issue.reportedBy._id}`)}
          >
            <div className="text-right mr-2">
              <p className="text-xs text-gray-500">Reported by</p>
              <p className="text-sm font-medium text-gray-700">
                {issue.reportedBy.username}
              </p>
            </div>
            <div className="relative">
              <img
                src={
                  issue.reportedBy.avatar || "/images/profile-placeholder.png"
                }
                alt={issue.reportedBy.username}
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                onError={(e) => {
                  e.target.src = "/images/profile-placeholder.png";
                }}
              />
              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showStatusModal && (
        <StatusUpdateModal
          issue={issue}
          onClose={() => setShowStatusModal(false)}
          onUpdate={handleStatusUpdate}
        />
      )}

      {showVerificationModal && (
        <VerificationModal
          issue={issue}
          onClose={() => setShowVerificationModal(false)}
          onVerify={handleVerification}
        />
      )}

      {showImageModal && selectedImage && (
        <ImageModal
          imageUrl={`http://localhost:5000${selectedImage}`}
          onClose={closeImageModal}
        />
      )}
    </>
  );
};

export default IssueCard;
