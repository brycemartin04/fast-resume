"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function PortfolioForm({ portfolio, onSubmit }) {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    slug: portfolio?.slug || "",
    name: portfolio?.name || session?.user?.name || "",
    title: portfolio?.title || "",
    bio: portfolio?.bio || "",
    image: portfolio?.image || session?.user?.image || "",
    skills: portfolio?.skills || [],
    education: portfolio?.education?.map((edu) => ({
      ...edu,
      startDate: edu.startDate
        ? new Date(edu.startDate).toISOString().split("T")[0]
        : "",
      endDate: edu.endDate
        ? new Date(edu.endDate).toISOString().split("T")[0]
        : "",
      description: edu.description || "",
    })) || [
      {
        school: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    experience: portfolio?.experience?.map((exp) => ({
      ...exp,
      startDate: exp.startDate
        ? new Date(exp.startDate).toISOString().split("T")[0]
        : "",
      endDate: exp.endDate
        ? new Date(exp.endDate).toISOString().split("T")[0]
        : "",
      description: exp.description || "",
    })) || [
      { title: "", company: "", startDate: "", endDate: "", description: "" },
    ],
    socialLinks: portfolio?.socialLinks || {
      github: "",
      linkedin: "",
      twitter: "",
      website: "",
    },
    useGradient: portfolio?.useGradient || false,
    backgroundColor: portfolio?.backgroundColor || "#4F46E5",
    gradientStart: portfolio?.gradientStart || "#4F46E5",
    gradientEnd: portfolio?.gradientEnd || "#7C3AED",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(
    portfolio?.image || session?.user?.image || ""
  );

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch("/api/portfolio");
        if (response.ok) {
          const data = await response.json();
          const savedFormData = localStorage.getItem("portfolioFormData");
          if (!savedFormData) {
            setFormData({
              slug: data.slug || "",
              name: data.name || "",
              title: data.title || "",
              bio: data.bio || "",
              image: data.image || "",
              skills:
                Array.isArray(data.skills) && data.skills.length > 0
                  ? data.skills
                  : [""],
              education: Array.isArray(data.education)
                ? data.education.map((edu) => ({
                    ...edu,
                    startDate: edu.startDate
                      ? new Date(edu.startDate).toISOString().split("T")[0]
                      : "",
                    endDate: edu.endDate
                      ? new Date(edu.endDate).toISOString().split("T")[0]
                      : "",
                    description: edu.description || "",
                  }))
                : [
                    {
                      school: "",
                      degree: "",
                      field: "",
                      startDate: "",
                      endDate: "",
                      description: "",
                    },
                  ],
              experience: Array.isArray(data.experience)
                ? data.experience.map((exp) => ({
                    ...exp,
                    startDate: exp.startDate
                      ? new Date(exp.startDate).toISOString().split("T")[0]
                      : "",
                    endDate: exp.endDate
                      ? new Date(exp.endDate).toISOString().split("T")[0]
                      : "",
                    description: exp.description || "",
                  }))
                : [
                    {
                      title: "",
                      company: "",
                      startDate: "",
                      endDate: "",
                      description: "",
                    },
                  ],
              socialLinks: {
                github: data.socialLinks?.github || "",
                linkedin: data.socialLinks?.linkedin || "",
                twitter: data.socialLinks?.twitter || "",
                website: data.socialLinks?.website || "",
              },
              useGradient: data.useGradient || false,
              backgroundColor: data.backgroundColor || "#4F46E5",
              gradientStart: data.gradientStart || "#4F46E5",
              gradientEnd: data.gradientEnd || "#7C3AED",
            });
            setImagePreview(data.image || "");
          }
        }
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      }
    };

    if (session?.user) {
      fetchPortfolio();
    }
  }, [session]);

  useEffect(() => {
    const savedFormData = localStorage.getItem("portfolioFormData");
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("portfolioFormData", JSON.stringify(formData));
  }, [formData]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setFormData((prev) => ({ ...prev, image: data.url }));
      setImagePreview(data.url);
      setMessage("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      setMessage("Failed to upload image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(",").map((skill) => skill.trim());
    setFormData((prev) => ({ ...prev, skills }));
  };

  const handleSocialLinkChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [name]: value },
    }));
  };

  const handleAddExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { title: "", company: "", startDate: "", endDate: "", description: "" },
      ],
    }));
  };

  const handleRemoveExperience = (index) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const handleAddEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          school: "",
          degree: "",
          field: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    }));
  };

  const handleRemoveEducation = (index) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const handleExperienceChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const handleEducationChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <h2 className="text-xl font-medium text-white mb-4">
          Basic Information
        </h2>
        <div className="space-y-4">
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white/20">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-white/10 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-white/40"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex flex-col items-center space-y-2">
              <label
                htmlFor="image-upload"
                className="px-4 py-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors cursor-pointer"
              >
                {isLoading ? "Uploading..." : "Upload Image"}
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {message && <p className="text-sm text-white/80">{message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              URL Slug
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, slug: e.target.value }))
              }
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="your-name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="Software Engineer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, bio: e.target.value }))
              }
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
              rows="3"
              maxLength={200}
              placeholder="A brief description about yourself..."
            />
            <p className="text-sm text-white/60 mt-1 text-right">
              {formData.bio.length}/200
            </p>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <h2 className="text-xl font-medium text-white mb-4">Skills</h2>
        <div>
          <input
            type="text"
            value={formData.skills.join(", ")}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                skills: e.target.value.split(",").map((s) => s.trim()),
              }))
            }
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
            placeholder="JavaScript, React, Node.js"
          />
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <h2 className="text-xl font-medium text-white mb-4">Social Links</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              GitHub
            </label>
            <input
              type="url"
              value={formData.socialLinks.github}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  socialLinks: {
                    ...prev.socialLinks,
                    github: e.target.value,
                  },
                }))
              }
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="https://github.com/username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              LinkedIn
            </label>
            <input
              type="url"
              value={formData.socialLinks.linkedin}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  socialLinks: {
                    ...prev.socialLinks,
                    linkedin: e.target.value,
                  },
                }))
              }
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="https://linkedin.com/in/username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Twitter
            </label>
            <input
              type="url"
              value={formData.socialLinks.twitter}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  socialLinks: {
                    ...prev.socialLinks,
                    twitter: e.target.value,
                  },
                }))
              }
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="https://twitter.com/username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Website
            </label>
            <input
              type="url"
              value={formData.socialLinks.website}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  socialLinks: {
                    ...prev.socialLinks,
                    website: e.target.value,
                  },
                }))
              }
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="https://example.com"
            />
          </div>
        </div>
      </div>

      {/* Experience */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium text-white">Experience</h2>
          <button
            type="button"
            onClick={handleAddExperience}
            className="px-4 py-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors"
          >
            Add Experience
          </button>
        </div>
        <div className="space-y-4">
          {formData.experience.map((exp, index) => (
            <div key={index} className="p-4 rounded-lg bg-white/5">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-white">
                  Experience {index + 1}
                </h3>
                <button
                  type="button"
                  onClick={() => handleRemoveExperience(index)}
                  className="text-white/60 hover:text-white"
                >
                  Remove
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={exp.title}
                    onChange={(e) =>
                      handleExperienceChange(index, "title", e.target.value)
                    }
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                    placeholder="Software Engineer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) =>
                      handleExperienceChange(index, "company", e.target.value)
                    }
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                    placeholder="Company Name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={exp.startDate}
                      onChange={(e) =>
                        handleExperienceChange(
                          index,
                          "startDate",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={exp.endDate}
                      onChange={(e) =>
                        handleExperienceChange(index, "endDate", e.target.value)
                      }
                      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    Description
                  </label>
                  <textarea
                    value={exp.description}
                    onChange={(e) =>
                      handleExperienceChange(
                        index,
                        "description",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
                    rows="3"
                    placeholder="Describe your role and responsibilities..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium text-white">Education</h2>
          <button
            type="button"
            onClick={handleAddEducation}
            className="px-4 py-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors"
          >
            Add Education
          </button>
        </div>
        <div className="space-y-4">
          {formData.education.map((edu, index) => (
            <div key={index} className="p-4 rounded-lg bg-white/5">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-white">
                  Education {index + 1}
                </h3>
                <button
                  type="button"
                  onClick={() => handleRemoveEducation(index)}
                  className="text-white/60 hover:text-white"
                >
                  Remove
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    School
                  </label>
                  <input
                    type="text"
                    value={edu.school}
                    onChange={(e) =>
                      handleEducationChange(index, "school", e.target.value)
                    }
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                    placeholder="University Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    Degree
                  </label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) =>
                      handleEducationChange(index, "degree", e.target.value)
                    }
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                    placeholder="Bachelor's"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    Field of Study
                  </label>
                  <input
                    type="text"
                    value={edu.field}
                    onChange={(e) =>
                      handleEducationChange(index, "field", e.target.value)
                    }
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                    placeholder="Computer Science"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={edu.startDate}
                      onChange={(e) =>
                        handleEducationChange(
                          index,
                          "startDate",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={edu.endDate}
                      onChange={(e) =>
                        handleEducationChange(index, "endDate", e.target.value)
                      }
                      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    Description
                  </label>
                  <textarea
                    value={edu.description}
                    onChange={(e) =>
                      handleEducationChange(
                        index,
                        "description",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
                    rows="3"
                    placeholder="Describe your academic achievements and relevant coursework..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full px-6 py-3 rounded-lg bg-white text-indigo-600 font-medium hover:bg-white/90 transition-colors"
      >
        Save Portfolio
      </button>
    </form>
  );
}
