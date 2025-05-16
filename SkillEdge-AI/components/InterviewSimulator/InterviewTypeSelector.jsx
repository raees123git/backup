"use client";

import { useState, useEffect } from "react";

export default function InterviewTypeSelector() {
  const [selectedType, setSelectedType] = useState("technical");
  const [selectedRole, setSelectedRole] = useState("Software Engineer");
  const [isLoaded, setIsLoaded] = useState(false);

  const interviewTypes = [
    {
      id: "technical",
      name: "Technical",
      description: "Coding, algorithms, and system design questions.",
      bg: "bg-blue-600",
      hover: "hover:bg-blue-700",
      ring: "ring-blue-400",
      accent: "text-blue-400",
    },
    {
      id: "behavioral",
      name: "Behavioral",
      description: "STAR method, soft skills, and communication.",
      bg: "bg-green-600",
      hover: "hover:bg-green-700",
      ring: "ring-green-400",
      accent: "text-green-400",
    },
    {
      id: "resume",
      name: "Resume-Based",
      description: "Get personalized questions based on your resume content.",
      bg: "bg-purple-600",
      hover: "hover:bg-purple-700",
      ring: "ring-purple-400",
      accent: "text-purple-400",
    },
  ];

  const technicalRoles = [
    "Software Engineer",
    "AI Engineer",
    "Web Developer",
    "Mobile Developer",
  ];

  const handleContinue = () => {
    let url;
    if (selectedType === "technical") {
      url = `/interview-simulator?type=technical&role=${encodeURIComponent(selectedRole)}`;
    } else if (selectedType === "resume") {
      url = `/interview-simulator?type=resume`;
    } else {
      url = `/interview-simulator?type=behavioral`;
    }

    window.location.href = url;
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-black text-white flex flex-col items-center justify-center px-4 transition-opacity duration-1000 ${
        isLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <h1 className="text-5xl font-extrabold mb-14 bg-gradient-to-r from-blue-400 to-green-400 text-transparent bg-clip-text animate-pulse">
        Select Interview Type
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl w-full mb-10">
        {interviewTypes.map((type) => {
          const isSelected = selectedType === type.id;
          return (
            <div
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`cursor-pointer transform transition-all duration-500 hover:scale-105 backdrop-blur-md bg-gray-800/70 border-2 rounded-2xl p-8 shadow-xl ${
                isSelected
                  ? `border-transparent ring-4 ${type.ring}`
                  : "border-gray-700 hover:border-gray-500"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-3xl font-bold ${type.accent}`}>{type.name}</h2>
                {isSelected && (
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium ${type.bg}`}>
                    Selected
                  </span>
                )}
              </div>
              <p className="text-lg text-gray-300 leading-relaxed">{type.description}</p>
            </div>
          );
        })}
      </div>

      {/* Sub-options for Technical roles */}
      {selectedType === "technical" && (
        <div className="mb-10 text-center">
          <h3 className="text-xl font-semibold mb-3 text-blue-300">Select a Technical Role:</h3>
          <div className="flex flex-wrap gap-4 justify-center">
            {technicalRoles.map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 border ${
                  selectedRole === role
                    ? "bg-blue-600 text-white border-blue-500"
                    : "bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Upload option for Resume-Based */}
      {selectedType === "resume" && (
        <div className="mb-10 text-center">
          <h3 className="text-xl font-semibold mb-3 text-purple-300">
            Upload Your Resume (PDF or DOCX)
          </h3>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="bg-gray-800 text-white border border-gray-600 px-4 py-2 rounded-lg"
            onChange={(e) => console.log("Resume selected:", e.target.files[0])}
          />
        </div>
      )}

      <button
        onClick={handleContinue}
        className={`px-8 py-4 rounded-xl font-semibold text-lg shadow-xl transition-transform hover:scale-105 ${
          selectedType === "technical"
            ? "bg-blue-600 hover:bg-blue-700"
            : selectedType === "resume"
            ? "bg-purple-600 hover:bg-purple-700"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        Continue
      </button>
    </div>
  );
}
