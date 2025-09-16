import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReportForm from "../components/ReportForm";
import SuccessModal from "../components/SuccessModal";

const Report = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const handleSuccess = () => {
    setShowSuccessModal(true);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate("/issues");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <ReportForm onSuccess={handleSuccess} />

        {showSuccessModal && (
          <SuccessModal
            onClose={handleCloseModal}
            title="Issue Reported Successfully!"
            message="Thank you for reporting this issue. The community will now be able to see and vote on it."
          />
        )}
      </div>
    </div>
  );
};

export default Report;
