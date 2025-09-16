import React, { useState, useEffect } from "react";
import { issueService } from "../services/issues";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import LocationMap from "./LocationMap";

import {
  ClipboardDocumentListIcon,
  MapPinIcon,
  PhotoIcon,
  CheckBadgeIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  PaperAirplaneIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";

function ReportForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium",
    location: { address: "", coordinates: { lat: null, lng: null } },
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role !== "public") {
      navigate("/issues", {
        state: {
          message:
            "Only community members can report issues. Department officers can update existing issues.",
        },
      });
    }
  }, [user, navigate]);

  const categories = {
    Electrical: ["Street Light", "Power Outage", "Electrical Wiring"],
    Water: ["Water Supply", "Water Leakage", "Drainage"],
    PWD: ["Road Damage", "Potholes", "Bridge Repair"],
    Sanitation: ["Garbage Collection", "Sewage", "Public Toilets"],
    Municipal: ["Parks", "Public Buildings", "Playgrounds"],
    Other: ["Other Issues"],
  };

  const getDepartmentForCategory = (category) => {
    for (const [dept, list] of Object.entries(categories)) {
      if (list.includes(category)) return dept;
    }
    return "Municipal";
  };


  if (user && user.role !== "public") {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-2xl shadow-lg text-center">
        <ExclamationTriangleIcon className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Access Restricted
        </h2>
        <p className="text-gray-600 mb-6">
          Only community members can report new issues. Department officers can
          update the status of existing issues.
        </p>
        <button
          onClick={() => navigate("/issues")}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Existing Issues
        </button>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationSelect = (loc) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        address: loc.address || "",
        coordinates: { lat: loc.coordinates.lat, lng: loc.coordinates.lng },
      },
    }));
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files).slice(0, 5));
  };

  const nextStep = () => {
    if (currentStep === 1 && (!formData.title || !formData.description)) {
      setError("Please fill in all required fields.");
      return;
    }
    if (currentStep === 2 && !formData.category) {
      setError("Please select a category.");
      return;
    }
    setError("");
    setCurrentStep((s) => s + 1);
  };

  const prevStep = () => setCurrentStep((s) => s - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user?.role !== "public") {
      setError("Access denied. Only community members can submit issues.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("category", formData.category);
      submitData.append("priority", formData.priority);
      if (formData.location.address)
        submitData.append("location[address]", formData.location.address);
      if (formData.location.coordinates.lat) {
        submitData.append(
          "location[coordinates][lat]",
          formData.location.coordinates.lat
        );
        submitData.append(
          "location[coordinates][lng]",
          formData.location.coordinates.lng
        );
      }
      images.forEach((img) => submitData.append("images", img));
      submitData.append(
        "department",
        getDepartmentForCategory(formData.category)
      );

      await issueService.create(submitData, user?.token);
      if (onSuccess) onSuccess();
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to submit issue");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { label: "Details", icon: ClipboardDocumentListIcon },
    { label: "Location", icon: MapPinIcon },
    { label: "Photos", icon: PhotoIcon },
    { label: "Review", icon: CheckBadgeIcon },
  ];

  return (
    <div
      className="relative max-w-3xl mx-auto my-8 p-8
                    rounded-3xl backdrop-blur-xl bg-white/70
                    shadow-[0_8px_30px_rgba(0,0,0,0.12)]
                    border border-white/40"
    >
      {/* Stepper */}
      <div className="flex items-center mb-12">
        {steps.map(({ label, icon: Icon }, i) => {
          const step = i + 1;
          const active = currentStep === step;
          const done = currentStep > step;
          return (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`relative flex items-center justify-center w-14 h-14 rounded-full
                  transition duration-300
                  ${
                    done
                      ? "bg-gradient-to-br from-emerald-400 to-green-600 text-white shadow-lg"
                      : active
                      ? "bg-gradient-to-br from-blue-400 to-indigo-600 text-white shadow-lg"
                      : "bg-gray-200 text-gray-400"
                  }
                  `}
                >
                  <Icon className="w-7 h-7" />
                </div>
                <span
                  className={`mt-2 text-sm font-semibold tracking-wide
                  ${active ? "text-indigo-700" : "text-gray-500"}`}
                >
                  {label}
                </span>
              </div>
              {step !== steps.length && (
                <div
                  className={`flex-1 h-1 mx-2 rounded-full
                  ${
                    done
                      ? "bg-gradient-to-r from-emerald-400 to-green-500"
                      : "bg-gray-300"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {error && (
        <p className="mb-4 text-red-600 text-center font-medium">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Step 1 */}
        {currentStep === 1 && (
          <div className="grid gap-6">
            <div className="relative">
              <input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder=" "
                className="peer w-full border border-gray-300 rounded-lg p-4 bg-transparent
                           focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 outline-none"
              />
              <label
                className="absolute left-4 top-3.5 text-gray-500 text-sm transition-all
                           peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                           peer-focus:top-1.5 peer-focus:text-sm peer-focus:text-indigo-600"
              >
                Issue Title
              </label>
            </div>
            <div className="relative">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder=" "
                rows="4"
                className="peer w-full border border-gray-300 rounded-lg p-4 bg-transparent
                           focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 outline-none"
              />
              <label
                className="absolute left-4 top-3.5 text-gray-500 text-sm transition-all
                           peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                           peer-focus:top-1.5 peer-focus:text-sm peer-focus:text-indigo-600"
              >
                Description
              </label>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {currentStep === 2 && (
          <div className="grid gap-6">
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg p-4 bg-white
                         focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">Select Category</option>
              {Object.values(categories)
                .flat()
                .map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
            </select>
            <LocationMap onSelect={handleLocationSelect} />
          </div>
        )}

        {/* Step 3 */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-700
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0
                         file:text-sm file:font-semibold
                         file:bg-indigo-50 file:text-indigo-700
                         hover:file:bg-indigo-100"
            />
            <p className="text-gray-500 text-sm">Upload up to 5 images.</p>
          </div>
        )}

        {/* Step 4 */}
        {currentStep === 4 && (
          <div className="space-y-3 text-gray-700">
            <p>
              <strong>Title:</strong> {formData.title}
            </p>
            <p>
              <strong>Description:</strong> {formData.description}
            </p>
            <p>
              <strong>Category:</strong> {formData.category}
            </p>
            <p>
              <strong>Location:</strong> {formData.location.address}
            </p>
            <p>
              <strong>Images:</strong> {images.length} selected
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-10 flex justify-between">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="inline-flex items-center gap-2 px-5 py-2.5
                         bg-gray-200 text-gray-800 rounded-full
                         hover:bg-gray-300 transition"
            >
              <ArrowLeftIcon className="w-5 h-5" /> Back
            </button>
          )}
          {currentStep < 4 && (
            <button
              type="button"
              onClick={nextStep}
              className="ml-auto inline-flex items-center gap-2 px-6 py-2.5
                         bg-gradient-to-r from-indigo-500 to-blue-600
                         text-white rounded-full shadow hover:from-indigo-600 hover:to-blue-700
                         transition"
            >
              Next <ArrowRightIcon className="w-5 h-5" />
            </button>
          )}
          {currentStep === 4 && (
            <button
              type="submit"
              disabled={loading}
              className="ml-auto inline-flex items-center gap-2 px-6 py-2.5
                         bg-gradient-to-r from-emerald-500 to-green-600
                         text-white rounded-full shadow hover:from-emerald-600 hover:to-green-700
                         transition"
            >
              {loading ? "Submitting..." : "Submit"}
              <PaperAirplaneIcon className="w-5 h-5 rotate-45" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ReportForm;
