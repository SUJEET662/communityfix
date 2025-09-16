import React, { useState, useEffect } from "react";
import { issueService } from "../services/issues";
import IssueCard from "./IssueCard";
import Filters from "./Filters";

const IssuesList = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    priority: "",
    search: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
  });

  useEffect(() => {
    loadIssues();
  }, [filters, pagination.page]);

  const loadIssues = async () => {
    try {
      setLoading(true);
      const response = await issueService.getAll({
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      });

      setIssues(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.total,
      }));
    } catch (error) {
      console.error("Error loading issues:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
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

  const handleStatusUpdate = async (issueId, newStatus, note) => {
    try {
      const response = await issueService.updateStatus(
        issueId,
        newStatus,
        note
      );
      setIssues((prev) =>
        prev.map((issue) => (issue._id === issueId ? response.data : issue))
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleVerification = async (issueId, images, note) => {
    try {
      const response = await issueService.verifyIssue(issueId, images, note);
      setIssues((prev) =>
        prev.map((issue) => (issue._id === issueId ? response.data : issue))
      );
    } catch (error) {
      console.error("Error verifying issue:", error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Community Issues
          </h1>
          <p className="text-gray-600">
            Reported and tracked by your neighbors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-100 animate-pulse"
            >
              <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-6 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Community Issues
        </h1>
        <p className="text-gray-600">Reported and tracked by your neighbors</p>
      </div>

      <Filters filters={filters} onChange={handleFilterChange} />

      {/* FIXED: Grid layout with proper spacing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {issues.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-white rounded-xl shadow-lg border border-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-400 mb-4"
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
            <div className="text-gray-600 text-xl mb-2">No issues found</div>
            <p className="text-gray-500 max-w-md mx-auto">
              {filters.search ||
              filters.status ||
              filters.category ||
              filters.priority
                ? "Try adjusting your filters to see more results."
                : "Be the first to report a community issue!"}
            </p>
          </div>
        ) : (
          issues.map((issue) => (
            <IssueCard
              key={issue._id}
              issue={issue}
              onVote={handleVote}
              onStatusUpdate={handleStatusUpdate}
              onVerification={handleVerification}
            />
          ))
        )}
      </div>

      {pagination.total > pagination.limit && (
        <div className="flex justify-center items-center gap-4 mt-12">
          <button
            disabled={pagination.page === 1}
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
            }
            className="px-5 py-2.5 bg-white text-gray-700 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Previous
          </button>
          <span className="text-gray-600 text-sm">
            Page {pagination.page} of{" "}
            {Math.ceil(pagination.total / pagination.limit)}
          </span>
          <button
            disabled={
              pagination.page >= Math.ceil(pagination.total / pagination.limit)
            }
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
            }
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors flex items-center"
          >
            Next
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default IssuesList;
