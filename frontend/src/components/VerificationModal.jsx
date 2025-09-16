import React, { useState } from "react";

const VerificationModal = ({ issue, onClose, onVerify }) => {
  const [note, setNote] = useState("");
  const [verificationImages, setVerificationImages] = useState([]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setVerificationImages([...verificationImages, ...files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (verificationImages.length === 0) {
      alert("Please upload at least one verification image");
      return;
    }
    onVerify(verificationImages, note);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Verify Issue Resolution
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {verificationImages.length > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                {verificationImages.length} image(s) selected
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note (Optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add any comments about the verification..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Submit Verification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerificationModal;
