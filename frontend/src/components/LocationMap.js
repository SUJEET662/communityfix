import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const LocationMap = ({ onLocationSelect, initialLocation }) => {
  const [selectedLocation, setSelectedLocation] = useState(
    initialLocation || { lat: 28.6139, lng: 77.209 }
  );
  const [address, setAddress] = useState("");

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();

      if (data && data.display_name) {
        const simplifiedAddress = data.display_name
          .split(",")
          .slice(0, 4)
          .join(", ");
        setAddress(simplifiedAddress);

        if (onLocationSelect) {
          onLocationSelect({
            coordinates: { lat, lng },
            address: simplifiedAddress,
          });
        }
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error);
      setAddress("Address not available");
    }
  };


  const geocodeAddress = async (searchText) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchText
        )}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const location = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
        setSelectedLocation(location);
        reverseGeocode(location.lat, location.lng);
      }
    } catch (error) {
      console.error("Error geocoding:", error);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setSelectedLocation(location);
          reverseGeocode(location.lat, location.lng);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(
            "Could not get your location. Please allow location access or search for a location."
          );
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchText = e.target.elements.search.value;
    if (searchText) {
      geocodeAddress(searchText);
    }
  };


  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const location = e.latlng;
        setSelectedLocation(location);
        reverseGeocode(location.lat, location.lng);
      },
    });
    return null;
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          name="search"
          type="text"
          placeholder="Search for a location..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          🔍
        </button>
        <button
          type="button"
          onClick={getCurrentLocation}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          title="Use current location"
        >
          📍
        </button>
      </form>

      {/* Map */}
      <div
        className="rounded-lg overflow-hidden border-2 border-gray-300"
        style={{ height: "300px" }}
      >
        <MapContainer
          center={[selectedLocation.lat, selectedLocation.lng]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
          <MapClickHandler />
        </MapContainer>
      </div>


      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800">
          <strong>Selected Location:</strong>
          <br />
          Latitude: {selectedLocation.lat?.toFixed(6)}, Longitude:{" "}
          {selectedLocation.lng?.toFixed(6)}
          {address && (
            <>
              <br />
              <strong>Address:</strong> {address}
            </>
          )}
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-sm text-yellow-800">
          💡 <strong>Tip:</strong> Click on the map to select a location or use
          the search box above.
        </p>
      </div>
    </div>
  );
};

export default LocationMap;
