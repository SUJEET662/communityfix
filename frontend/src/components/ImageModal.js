import React from "react";

const ImageModal = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl max-h-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute -top-12 right-0 text-white text-3xl hover:text-gray-300 transition-colors z-10"
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="bg-black rounded-lg overflow-hidden shadow-2xl">
          <img
            src={imageUrl}
            alt="Enlarged view"
            className="w-full h-auto max-h-[80vh] object-contain"
            onError={(e) => {
              e.target.src = "/images/placeholder-image.jpg";
            }}
          />
        </div>

        <div className="mt-4 text-center">
          <button
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
