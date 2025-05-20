"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    skills: "",
    qualification: "",
    industry: "",
    position: "",
    experience: "",
    bio: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Replace with your actual API endpoint
    await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setIsSubmitting(false);
    router.push("/main/profile");
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-gray-800 rounded-2xl p-6 space-y-6 shadow-lg"
      >
        <h2 className="text-2xl font-bold text-white">Complete Your Profile</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-200">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg bg-gray-700 text-white p-2 focus:ring focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-gray-200">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg bg-gray-700 text-white p-2 focus:ring focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-200">Skills (comma separated)</label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g., JavaScript, React, Node.js"
            className="mt-1 w-full rounded-lg bg-gray-700 text-white p-2 focus:ring focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-200">Qualification</label>
            <select
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg bg-gray-700 text-white p-2 focus:ring focus:ring-indigo-500"
            >
              <option value="">Select</option>
              <option value="High School">High School</option>
              <option value="Bachelors">Bachelors</option>
              <option value="Masters">Masters</option>
              <option value="PhD">PhD</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-200">Industry</label>
            <select
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg bg-gray-700 text-white p-2 focus:ring focus:ring-indigo-500"
            >
              <option value="">Select</option>
              <option value="Technology">Technology</option>
              <option value="Finance">Finance</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Marketing">Marketing</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-200">Position</label>
            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg bg-gray-700 text-white p-2 focus:ring focus:ring-indigo-500"
            >
              <option value="">Select</option>
              <option value="Software Engineer">Software Engineer</option>
              <option value="ML Engineer">ML Engineer</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="Product Manager">Product Manager</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-gray-200">Years of Experience</label>
          <input
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            min="0"
            placeholder="e.g., 3"
            className="mt-1 w-full rounded-lg bg-gray-700 text-white p-2 focus:ring focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-gray-200">Short Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="4"
            placeholder="Tell us a bit about yourself"
            className="mt-1 w-full rounded-lg bg-gray-700 text-white p-2 focus:ring focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-2xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting…" : "Complete Registration"}
        </button>
      </form>
    </div>
  );
}
