import { useState, useEffect } from "react";
import {
  FiSearch,
  FiEye,
  FiEdit,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiRefreshCw,
  FiUser,
  FiShield,
} from "react-icons/fi";
import Modal from "../../../components/Modal";
import toast from "react-hot-toast";
import { adminFormService } from "../../../services/api";

export default function DisputeResolution() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filters and pagination
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
    start_date: "",
    end_date: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total_pages: 1,
    total_items: 0,
  });

  // Edit form data
  const [editFormData, setEditFormData] = useState({
    status: "",
    priority: "",
    admin_notes: "",
    assigned_to: "",
  });

  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
    { value: "closed", label: "Closed" },
  ];

  const priorityOptions = [
    { value: "", label: "All Priorities" },
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" },
  ];

  // Fetch submissions
  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        form_type: "dispute_resolution", // Filter for dispute resolution only
        ...filters,
      };

      const data = await adminFormService.getAllFormSubmissions(params);
      setSubmissions(data.data.submissions);
      setPagination(data.data.pagination);
      setStats(data.data.stats);
    } catch (error) {
      console.error("Error fetching dispute resolutions:", error);
      toast.error("Failed to fetch dispute resolutions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchSubmissions();
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Handle view submission
  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission);
    setShowViewModal(true);
  };

  // Handle edit submission
  const handleEditSubmission = (submission) => {
    setSelectedSubmission(submission);
    setEditFormData({
      status: submission.status,
      priority: submission.priority,
      admin_notes: submission.admin_notes || "",
      assigned_to: submission.assigned_to?._id || "",
    });
    setShowEditModal(true);
  };

  // Handle update submission
  const handleUpdateSubmission = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await adminFormService.updateFormSubmissionStatus(
        selectedSubmission._id,
        editFormData
      );
      toast.success("Dispute resolution updated successfully");
      setShowEditModal(false);
      fetchSubmissions();
    } catch (error) {
      console.error("Error updating submission:", error);
      toast.error(
        error.response?.data?.message || "Failed to update submission"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get status display
  const getStatusDisplay = (status) => {
    const statusConfig = {
      pending: { icon: FiClock, color: "text-yellow-600", bg: "bg-yellow-100" },
      in_progress: {
        icon: FiRefreshCw,
        color: "text-blue-600",
        bg: "bg-blue-100",
      },
      resolved: {
        icon: FiCheckCircle,
        color: "text-green-600",
        bg: "bg-green-100",
      },
      closed: { icon: FiXCircle, color: "text-gray-600", bg: "bg-gray-100" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color} ${config.bg}`}
      >
        <Icon size={12} className="mr-1" />
        {status.replace("_", " ").toUpperCase()}
      </span>
    );
  };

  // Get priority display
  const getPriorityDisplay = (priority) => {
    const priorityConfig = {
      low: { color: "text-gray-600", bg: "bg-gray-100" },
      medium: { color: "text-blue-600", bg: "bg-blue-100" },
      high: { color: "text-orange-600", bg: "bg-orange-100" },
      urgent: { color: "text-red-600", bg: "bg-red-100" },
    };

    const config = priorityConfig[priority] || priorityConfig.medium;

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color} ${config.bg}`}
      >
        {priority === "urgent" && (
          <FiAlertTriangle size={12} className="mr-1" />
        )}
        {priority.toUpperCase()}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dispute Resolution
          </h1>
          <p className="text-gray-600">Manage dispute and report submissions</p>
        </div>
        <button
          onClick={fetchSubmissions}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <FiRefreshCw size={20} />
          <span className="whitespace-nowrap">Refresh Data</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Cases</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.total || 0}
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiShield className="text-blue-600" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.pending || 0}
              </p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FiClock className="text-yellow-600" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">
                {stats.in_progress || 0}
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiRefreshCw className="text-blue-600" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.resolved || 0}
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <FiCheckCircle className="text-green-600" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search disputes..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>

          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange("priority", e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {priorityOptions.map((priority) => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={filters.start_date}
            onChange={(e) => handleFilterChange("start_date", e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Start Date"
          />

          <button
            onClick={() => {
              setFilters({
                search: "",
                status: "",
                priority: "",
                start_date: "",
                end_date: "",
              });
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <FiRefreshCw size={16} />
            Reset
          </button>
        </div>
      </div>

      {/* Dispute Resolution Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Case Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dispute Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reporter Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property/Booking
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {submissions.map((submission) => (
                <tr key={submission._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {submission.submission_id}
                      </div>
                      <div className="text-sm text-gray-500">
                        Case #{submission._id?.slice(-6)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {submission.dispute_type}
                      </div>
                      {submission.category && (
                        <div className="text-sm text-gray-500">
                          {submission.category}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {submission.reporter_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {submission.reporter_email}
                      </div>
                      {submission.reporter_phone && (
                        <div className="text-sm text-gray-500">
                          {submission.reporter_phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {submission.property_id && (
                        <div>Property: {submission.property_id}</div>
                      )}
                      {submission.booking_id && (
                        <div>Booking: {submission.booking_id}</div>
                      )}
                      {!submission.property_id && !submission.booking_id && (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusDisplay(submission.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPriorityDisplay(submission.priority)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(submission.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewSubmission(submission)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="View Details"
                      >
                        <FiEye size={16} />
                      </button>
                      <button
                        onClick={() => handleEditSubmission(submission)}
                        className="text-green-600 hover:text-green-900 p-1 rounded"
                        title="Edit Status"
                      >
                        <FiEdit size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.total_pages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    page: Math.max(1, prev.page - 1),
                  }))
                }
                disabled={pagination.current_page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    page: Math.min(pagination.total_pages, prev.page + 1),
                  }))
                }
                disabled={pagination.current_page === pagination.total_pages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(pagination.current_page - 1) * pagination.items_per_page +
                      1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(
                      pagination.current_page * pagination.items_per_page,
                      pagination.total_items
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{pagination.total_items}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: Math.max(1, prev.page - 1),
                      }))
                    }
                    disabled={pagination.current_page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {[...Array(Math.min(pagination.total_pages, 5))].map(
                    (_, index) => {
                      const page = index + 1;
                      return (
                        <button
                          key={page}
                          onClick={() =>
                            setPagination((prev) => ({ ...prev, page }))
                          }
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === pagination.current_page
                              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }
                  )}
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: Math.min(pagination.total_pages, prev.page + 1),
                      }))
                    }
                    disabled={
                      pagination.current_page === pagination.total_pages
                    }
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Dispute Resolution Details"
      >
        {selectedSubmission && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Case ID
                </label>
                <p className="text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded">
                  {selectedSubmission.submission_id}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <div>{getStatusDisplay(selectedSubmission.status)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <div>{getPriorityDisplay(selectedSubmission.priority)}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Submitted
                </label>
                <p className="text-sm text-gray-900">
                  {formatDate(selectedSubmission.createdAt)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reporter Name
                </label>
                <p className="text-sm text-gray-900">
                  {selectedSubmission.reporter_name}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reporter Email
                </label>
                <p className="text-sm text-gray-900">
                  {selectedSubmission.reporter_email}
                </p>
              </div>
              {selectedSubmission.reporter_phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reporter Phone
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedSubmission.reporter_phone}
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dispute Type
                </label>
                <p className="text-sm text-gray-900">
                  {selectedSubmission.dispute_type}
                </p>
              </div>
              {selectedSubmission.category && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedSubmission.category}
                  </p>
                </div>
              )}
            </div>

            {(selectedSubmission.property_id ||
              selectedSubmission.booking_id) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedSubmission.property_id && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Property ID
                    </label>
                    <p className="text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded">
                      {selectedSubmission.property_id}
                    </p>
                  </div>
                )}
                {selectedSubmission.booking_id && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Booking ID
                    </label>
                    <p className="text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded">
                      {selectedSubmission.booking_id}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded whitespace-pre-wrap">
                {selectedSubmission.description}
              </p>
            </div>

            {selectedSubmission.evidence_urls &&
              selectedSubmission.evidence_urls.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Evidence Files
                  </label>
                  <div className="space-y-2">
                    {selectedSubmission.evidence_urls.map((url, index) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        Evidence File {index + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}

            {selectedSubmission.admin_notes && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Notes
                </label>
                <p className="text-sm text-gray-900 bg-yellow-50 p-3 rounded whitespace-pre-wrap">
                  {selectedSubmission.admin_notes}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Update Dispute Resolution"
      >
        {selectedSubmission && (
          <form onSubmit={handleUpdateSubmission} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={editFormData.status}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {statusOptions.slice(1).map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority <span className="text-red-500">*</span>
                </label>
                <select
                  value={editFormData.priority}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      priority: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {priorityOptions.slice(1).map((priority) => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Notes
              </label>
              <textarea
                value={editFormData.admin_notes}
                onChange={(e) =>
                  setEditFormData((prev) => ({
                    ...prev,
                    admin_notes: e.target.value,
                  }))
                }
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add notes about this dispute case..."
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Updating..." : "Update Case"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
