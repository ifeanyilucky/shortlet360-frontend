import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSave,
  FiX,
  FiPlus,
  FiTrash2,
  FiMapPin,
  FiDollarSign,
  FiCalendar,
  FiUsers,
  FiBriefcase,
  FiAward,
  FiHeart,
  FiGlobe,
} from "react-icons/fi";
import axios from "../../../utils/axios";
import LoadingScreen from "../../../components/LoadingScreen";
import toast from "react-hot-toast";

export default function CreateJob() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    jobType: "",
    experienceLevel: "",
    salary: {
      min: "",
      max: "",
      currency: "NGN",
      period: "yearly",
    },
    description: "",
    responsibilities: [""],
    requirements: [""],
    niceToHave: [""],
    benefits: [""],
    skills: [""],
    applicationDeadline: "",
    isRemote: false,
    isUrgent: false,
    tags: [""],
    status: "draft",
  });

  const departments = [
    "Engineering",
    "Product",
    "Design",
    "Marketing",
    "Sales",
    "Customer Support",
    "Operations",
    "Finance",
    "Human Resources",
    "Legal",
    "Other",
  ];

  const jobTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Internship",
    "Freelance",
  ];
  const experienceLevels = ["Entry", "Mid", "Senior", "Lead", "Executive"];
  const currencies = ["NGN", "USD", "EUR", "GBP"];
  const periods = ["hourly", "daily", "weekly", "monthly", "yearly"];

  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleArrayChange = (field, index, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic validation
    if (!formData.title.trim()) {
      newErrors.title = "Job title is required";
    } else if (formData.title.length > 100) {
      newErrors.title = "Job title cannot exceed 100 characters";
    }

    if (!formData.department) {
      newErrors.department = "Department is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.jobType) {
      newErrors.jobType = "Job type is required";
    }

    if (!formData.experienceLevel) {
      newErrors.experienceLevel = "Experience level is required";
    }

    if (!formData.applicationDeadline) {
      newErrors.applicationDeadline = "Application deadline is required";
    } else {
      const deadline = new Date(formData.applicationDeadline);
      if (deadline <= new Date()) {
        newErrors.applicationDeadline =
          "Application deadline must be in the future";
      }
    }

    // Salary validation
    if (!formData.salary.min || formData.salary.min <= 0) {
      newErrors.salaryMin =
        "Minimum salary is required and must be greater than 0";
    }

    if (!formData.salary.max || formData.salary.max <= 0) {
      newErrors.salaryMax =
        "Maximum salary is required and must be greater than 0";
    }

    if (
      formData.salary.min &&
      formData.salary.max &&
      parseFloat(formData.salary.min) >= parseFloat(formData.salary.max)
    ) {
      newErrors.salaryMax =
        "Maximum salary must be greater than minimum salary";
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Job description is required";
    } else if (formData.description.length < 50) {
      newErrors.description = "Job description must be at least 50 characters";
    }

    // Responsibilities validation
    const validResponsibilities = formData.responsibilities.filter((item) =>
      item.trim()
    );
    if (validResponsibilities.length === 0) {
      newErrors.responsibilities = "At least one responsibility is required";
    }

    // Requirements validation
    const validRequirements = formData.requirements.filter((item) =>
      item.trim()
    );
    if (validRequirements.length === 0) {
      newErrors.requirements = "At least one requirement is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the validation errors before submitting");
      return;
    }

    setLoading(true);

    try {
      // Filter out empty array items
      const submitData = {
        ...formData,
        responsibilities: formData.responsibilities.filter((item) =>
          item.trim()
        ),
        requirements: formData.requirements.filter((item) => item.trim()),
        niceToHave: formData.niceToHave.filter((item) => item.trim()),
        benefits: formData.benefits.filter((item) => item.trim()),
        skills: formData.skills.filter((item) => item.trim()),
        tags: formData.tags.filter((item) => item.trim()),
      };

      await axios.post("/admin/jobs", submitData);
      toast.success("Job created successfully!");
      navigate("/admin/jobs");
    } catch (error) {
      console.error("Error creating job:", error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.errors) {
        // Handle validation errors from backend
        const backendErrors = error.response.data.errors;
        const newErrors = {};

        backendErrors.forEach((err) => {
          if (err.path) {
            newErrors[err.path] = err.message;
          }
        });

        setErrors(newErrors);
        toast.error("Please fix the validation errors");
      } else {
        toast.error("Failed to create job. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Job</h1>
          <p className="text-gray-600">
            Add a new job listing to the career page
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/jobs")}
          className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          <FiX className="mr-2" />
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiBriefcase className="mr-2" />
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g., Senior Software Engineer"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department *
              </label>
              <select
                required
                value={formData.department}
                onChange={(e) =>
                  handleInputChange("department", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.department ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {errors.department && (
                <p className="mt-1 text-sm text-red-600">{errors.department}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.location ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g., Lagos, Nigeria"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Type *
              </label>
              <select
                required
                value={formData.jobType}
                onChange={(e) => handleInputChange("jobType", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.jobType ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select Job Type</option>
                {jobTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.jobType && (
                <p className="mt-1 text-sm text-red-600">{errors.jobType}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience Level *
              </label>
              <select
                required
                value={formData.experienceLevel}
                onChange={(e) =>
                  handleInputChange("experienceLevel", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.experienceLevel ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select Experience Level</option>
                {experienceLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              {errors.experienceLevel && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.experienceLevel}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Deadline *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.applicationDeadline}
                onChange={(e) =>
                  handleInputChange("applicationDeadline", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.applicationDeadline
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {errors.applicationDeadline && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.applicationDeadline}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isRemote}
                onChange={(e) =>
                  handleInputChange("isRemote", e.target.checked)
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Remote Position
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isUrgent}
                onChange={(e) =>
                  handleInputChange("isUrgent", e.target.checked)
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Urgent Hiring</span>
            </label>
          </div>
        </div>

        {/* Salary Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiDollarSign className="mr-2" />
            Salary Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Salary *
              </label>
              <input
                type="number"
                required
                value={formData.salary.min}
                onChange={(e) =>
                  handleInputChange("salary.min", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.salaryMin ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="500000"
              />
              {errors.salaryMin && (
                <p className="mt-1 text-sm text-red-600">{errors.salaryMin}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Salary *
              </label>
              <input
                type="number"
                required
                value={formData.salary.max}
                onChange={(e) =>
                  handleInputChange("salary.max", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.salaryMax ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="1000000"
              />
              {errors.salaryMax && (
                <p className="mt-1 text-sm text-red-600">{errors.salaryMax}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select
                value={formData.salary.currency}
                onChange={(e) =>
                  handleInputChange("salary.currency", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Period
              </label>
              <select
                value={formData.salary.period}
                onChange={(e) =>
                  handleInputChange("salary.period", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {periods.map((period) => (
                  <option key={period} value={period}>
                    {period}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Job Description *
          </h2>
          <textarea
            required
            rows={6}
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Provide a detailed description of the role, company culture, and what makes this position exciting..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Responsibilities */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiUsers className="mr-2" />
            Key Responsibilities *
          </h2>
          {formData.responsibilities.map((responsibility, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={responsibility}
                onChange={(e) =>
                  handleArrayChange("responsibilities", index, e.target.value)
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Develop and maintain web applications"
              />
              {formData.responsibilities.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem("responsibilities", index)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <FiTrash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
          {errors.responsibilities && (
            <p className="mt-2 text-sm text-red-600">
              {errors.responsibilities}
            </p>
          )}
          <button
            type="button"
            onClick={() => addArrayItem("responsibilities")}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FiPlus className="mr-1" />
            Add Responsibility
          </button>
        </div>

        {/* Requirements */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiAward className="mr-2" />
            Requirements *
          </h2>
          {formData.requirements.map((requirement, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={requirement}
                onChange={(e) =>
                  handleArrayChange("requirements", index, e.target.value)
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 3+ years of experience in React"
              />
              {formData.requirements.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem("requirements", index)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <FiTrash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
          {errors.requirements && (
            <p className="mt-2 text-sm text-red-600">{errors.requirements}</p>
          )}
          <button
            type="button"
            onClick={() => addArrayItem("requirements")}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FiPlus className="mr-1" />
            Add Requirement
          </button>
        </div>

        {/* Nice to Have */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Nice to Have
          </h2>
          {formData.niceToHave.map((item, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={item}
                onChange={(e) =>
                  handleArrayChange("niceToHave", index, e.target.value)
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Experience with AWS"
              />
              <button
                type="button"
                onClick={() => removeArrayItem("niceToHave", index)}
                className="p-2 text-red-600 hover:text-red-800"
              >
                <FiTrash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("niceToHave")}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FiPlus className="mr-1" />
            Add Nice to Have
          </button>
        </div>

        {/* Benefits */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiHeart className="mr-2" />
            Benefits
          </h2>
          {formData.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={benefit}
                onChange={(e) =>
                  handleArrayChange("benefits", index, e.target.value)
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Health insurance"
              />
              <button
                type="button"
                onClick={() => removeArrayItem("benefits", index)}
                className="p-2 text-red-600 hover:text-red-800"
              >
                <FiTrash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("benefits")}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FiPlus className="mr-1" />
            Add Benefit
          </button>
        </div>

        {/* Skills */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiGlobe className="mr-2" />
            Skills
          </h2>
          {formData.skills.map((skill, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={skill}
                onChange={(e) =>
                  handleArrayChange("skills", index, e.target.value)
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., JavaScript, React, Node.js"
              />
              <button
                type="button"
                onClick={() => removeArrayItem("skills", index)}
                className="p-2 text-red-600 hover:text-red-800"
              >
                <FiTrash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("skills")}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FiPlus className="mr-1" />
            Add Skill
          </button>
        </div>

        {/* Tags */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tags</h2>
          {formData.tags.map((tag, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={tag}
                onChange={(e) =>
                  handleArrayChange("tags", index, e.target.value)
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., remote, startup, growth"
              />
              <button
                type="button"
                onClick={() => removeArrayItem("tags", index)}
                className="p-2 text-red-600 hover:text-red-800"
              >
                <FiTrash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("tags")}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FiPlus className="mr-1" />
            Add Tag
          </button>
        </div>

        {/* Status */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Job Status
          </h2>
          <select
            value={formData.status}
            onChange={(e) => handleInputChange("status", e.target.value)}
            className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="closed">Closed</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/admin/jobs")}
            className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FiSave className="mr-2" />
            Create Job
          </button>
        </div>
      </form>
    </div>
  );
}
