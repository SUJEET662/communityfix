// frontend/src/components/SimpleLocationInput.js
import React, { useState } from "react";

const SimpleLocationInput = ({ onLocationSelect, initialLocation }) => {
  const [location, setLocation] = useState({
    address: initialLocation?.address || "",
    lat: initialLocation?.coordinates?.lat || "",
    lng: initialLocation?.coordinates?.lng || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newLocation = { ...location, [name]: value };
    setLocation(newLocation);

    if (
      onLocationSelect &&
      newLocation.address &&
      newLocation.lat &&
      newLocation.lng
    ) {
      onLocationSelect({
        address: newLocation.address,
        coordinates: {
          lat: parseFloat(newLocation.lat),
          lng: parseFloat(newLocation.lng),
        },
      });
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            ...location,
            lat: position.coords.latitude.toString(),
            lng: position.coords.longitude.toString(),
          };
          setLocation(newLocation);

          if (onLocationSelect) {
            onLocationSelect({
              address: newLocation.address,
              coordinates: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              },
            });
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(
            "Could not get your location. Please enter coordinates manually."
          );
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address *
        </label>
        <input
          type="text"
          name="address"
          value={location.address}
          onChange={handleInputChange}
          placeholder="Enter the full address"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Latitude
          </label>
          <input
            type="number"
            name="lat"
            value={location.lat}
            onChange={handleInputChange}
            placeholder="e.g., 28.6139"
            step="any"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Longitude
          </label>
          <input
            type="number"
            name="lng"
            value={location.lng}
            onChange={handleInputChange}
            placeholder="e.g., 77.2090"
            step="any"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={getCurrentLocation}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        📍 Get Current Location
      </button>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> Use "Get Current Location" or enter
          coordinates manually. You can get coordinates from Google Maps by
          right-clicking on a location.
        </p>
      </div>
    </div>
  );
};

export default SimpleLocationInput;
