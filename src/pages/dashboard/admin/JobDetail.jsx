import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  FiEdit3,
  FiTrash2,
  FiCopy,
  FiArrowLeft,
  FiMapPin,
  FiDollarSign,
  FiCalendar,
  FiUsers,
  FiBriefcase,
  FiAward,
  FiHeart,
  FiGlobe,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiArchive,
  FiTag,
} from "react-icons/fi";
import { MdOutlineWork } from "react-icons/md";
import axios from "../../../utils/axios";
import LoadingScreen from "../../../components/LoadingScreen";
import Modal from "../../../components/Modal";
import StatusChip from "../../../components/StatusChip";
import toast from "react-hot-toast";

export default function JobDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await axios.get(`/admin/jobs/${id}`);
      setJob(response.data.job);
    } catch (error) {
      console.error("Error fetching job:", error);
      toast.error("Error loading job. Please try again.");
      navigate("/admin/jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async () => {
    try {
      await axios.delete(`/admin/jobs/${id}`);
      toast.success("Job deleted successfully");
      navigate("/admin/jobs");
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Error deleting job. Please try again.");
    }
  };

  const handleDuplicateJob = async () => {
    try {
      await axios.post(`/admin/jobs/${id}/duplicate`);
      toast.success("Job duplicated successfully");
      navigate("/admin/jobs");
    } catch (error) {
      console.error("Error duplicating job:", error);
      toast.error("Error duplicating job. Please try again.");
    }
  };

  const formatSalary = (salary) => {
    const formatter = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: salary.currency || "NGN",
      minimumFractionDigits: 0,
    });
    return `${formatter.format(salary.min)} - ${formatter.format(salary.max)} ${
      salary.period
    }`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "published":
        return <FiCheckCircle className="text-green-500" />;
      case "draft":
        return <FiAlertCircle className="text-yellow-500" />;
      case "closed":
        return <FiXCircle className="text-red-500" />;
      case "archived":
        return <FiArchive className="text-gray-500" />;
      default:
        return <FiAlertCircle className="text-gray-500" />;
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Job not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/admin/jobs")}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <FiArrowLeft className="mr-2" />
            Back to Jobs
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-gray-600">Job ID: {job.short_id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            to={`/admin/jobs/${id}/edit`}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FiEdit3 className="mr-2" />
            Edit
          </Link>
          <button
            onClick={handleDuplicateJob}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <FiCopy className="mr-2" />
            Duplicate
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <FiTrash2 className="mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Job Status */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon(job.status)}
            <StatusChip status={job.status} />
            {job.isUrgent && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                Urgent
              </span>
            )}
            {job.isRemote && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Remote
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500">
            Created: {formatDate(job.createdAt)}
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FiBriefcase className="mr-2" />
          Basic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title
            </label>
            <p className="text-gray-900">{job.title}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <p className="text-gray-900">{job.department}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FiMapPin className="mr-1" />
              Location
            </label>
            <p className="text-gray-900">{job.location}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Type
            </label>
            <p className="text-gray-900">{job.jobType}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Experience Level
            </label>
            <p className="text-gray-900">{job.experienceLevel}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FiCalendar className="mr-1" />
              Application Deadline
            </label>
            <p className="text-gray-900">
              {formatDate(job.applicationDeadline)}
            </p>
          </div>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Salary
            </label>
            <p className="text-gray-900">{job.salary.min.toLocaleString()}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Salary
            </label>
            <p className="text-gray-900">{job.salary.max.toLocaleString()}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <p className="text-gray-900">{job.salary.currency}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Period
            </label>
            <p className="text-gray-900">{job.salary.period}</p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-blue-900 font-medium">
            Salary Range: {formatSalary(job.salary)}
          </p>
        </div>
      </div>

      {/* Job Description */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Job Description
        </h2>
        <div className="prose max-w-none">
          <p className="text-gray-900 whitespace-pre-wrap">{job.description}</p>
        </div>
      </div>

      {/* Responsibilities */}
      {job.responsibilities && job.responsibilities.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiUsers className="mr-2" />
            Key Responsibilities
          </h2>
          <ul className="space-y-2">
            {job.responsibilities.map((responsibility, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                <span className="text-gray-900">{responsibility}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Requirements */}
      {job.requirements && job.requirements.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiAward className="mr-2" />
            Requirements
          </h2>
          <ul className="space-y-2">
            {job.requirements.map((requirement, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></span>
                <span className="text-gray-900">{requirement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Nice to Have */}
      {job.niceToHave && job.niceToHave.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Nice to Have
          </h2>
          <ul className="space-y-2">
            {job.niceToHave.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3"></span>
                <span className="text-gray-900">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Benefits */}
      {job.benefits && job.benefits.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiHeart className="mr-2" />
            Benefits
          </h2>
          <ul className="space-y-2">
            {job.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></span>
                <span className="text-gray-900">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Skills */}
      {job.skills && job.skills.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiGlobe className="mr-2" />
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {job.tags && job.tags.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiTag className="mr-2" />
            Tags
          </h2>
          <div className="flex flex-wrap gap-2">
            {job.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Job Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {job.applicationCount}
            </p>
            <p className="text-sm text-gray-600">Applications</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {job.isUrgent ? "Yes" : "No"}
            </p>
            <p className="text-sm text-gray-600">Urgent Hiring</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              {job.isRemote ? "Yes" : "No"}
            </p>
            <p className="text-sm text-gray-600">Remote Position</p>
          </div>
        </div>
      </div>

      {/* Created By */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Created By</h2>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold">
              {job.createdBy?.first_name?.charAt(0)}
              {job.createdBy?.last_name?.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {job.createdBy?.first_name} {job.createdBy?.last_name}
            </p>
            <p className="text-sm text-gray-600">{job.createdBy?.email}</p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Job"
      >
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete the job "{job.title}"? This action
            cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteJob}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
