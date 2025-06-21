import { useState, useEffect } from "react";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiToggleLeft,
  FiToggleRight,
  FiSearch,
  FiEye,
  FiRefreshCw,
  FiPercent,
  FiDollarSign,
  FiUsers,
} from "react-icons/fi";
import adminService from "../../services/adminService";
import { format } from "date-fns";
import toast from "react-hot-toast";
import Modal from "../../components/Modal";
import CustomInput from "../../components/CustomInput";
import RightSidebarModal from "../../components/RightSidebarModal";

export default function DiscountCodes() {
  const [discountCodes, setDiscountCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 10,
  });
  const [filters, setFilters] = useState({
    search: "",
    is_active: "",
    discount_type: "",
  });

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCode, setSelectedCode] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discount_type: "percentage",
    discount_value: "",
    applicable_to: "registration_fee",
    max_uses: "",
    valid_from: "",
    valid_until: "",
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchDiscountCodes();
    fetchStats();
  }, [filters, pagination.page]);

  const fetchDiscountCodes = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      };

      const response = await adminService.getAllDiscountCodes(params);
      setDiscountCodes(response.data.discount_codes || []);
      setPagination(response.data.pagination || pagination);
    } catch (error) {
      console.error("Error fetching discount codes:", error);
      toast.error("Failed to fetch discount codes");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await adminService.getDiscountCodeStats();
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      // Set default stats if fetch fails
      setStats({
        total_codes: 0,
        active_codes: 0,
        total_uses: 0,
        total_discount_amount: 0,
      });
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const resetForm = () => {
    setFormData({
      code: "",
      description: "",
      discount_type: "percentage",
      discount_value: "",
      applicable_to: "registration_fee",
      max_uses: "",
      valid_from: "",
      valid_until: "",
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.code.trim()) {
      errors.code = "Discount code is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }

    if (!formData.discount_value || formData.discount_value <= 0) {
      errors.discount_value = "Discount value must be greater than 0";
    }

    if (
      formData.discount_type === "percentage" &&
      formData.discount_value > 100
    ) {
      errors.discount_value = "Percentage discount cannot exceed 100%";
    }

    if (formData.max_uses && formData.max_uses <= 0) {
      errors.max_uses = "Max uses must be greater than 0";
    }

    if (
      formData.valid_until &&
      formData.valid_from &&
      new Date(formData.valid_until) <= new Date(formData.valid_from)
    ) {
      errors.valid_until = "End date must be after start date";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const submitData = {
        ...formData,
        discount_value: parseFloat(formData.discount_value),
        max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
      };

      if (selectedCode) {
        await adminService.updateDiscountCode(selectedCode._id, submitData);
        toast.success("Discount code updated successfully");
        setShowEditModal(false);
      } else {
        await adminService.createDiscountCode(submitData);
        toast.success("Discount code created successfully");
        setShowCreateModal(false);
      }

      resetForm();
      setSelectedCode(null);
      fetchDiscountCodes();
      fetchStats();
    } catch (error) {
      console.error("Error saving discount code:", error);
      toast.error(
        error?.response?.data?.message || "Failed to save discount code"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (code) => {
    setSelectedCode(code);
    setFormData({
      code: code.code,
      description: code.description,
      discount_type: code.discount_type,
      discount_value: code.discount_value.toString(),
      applicable_to: code.applicable_to,
      max_uses: code.max_uses ? code.max_uses.toString() : "",
      valid_from: code.valid_from
        ? format(new Date(code.valid_from), "yyyy-MM-dd'T'HH:mm")
        : "",
      valid_until: code.valid_until
        ? format(new Date(code.valid_until), "yyyy-MM-dd'T'HH:mm")
        : "",
    });
    setShowEditModal(true);
  };

  const handleToggleStatus = async (code) => {
    try {
      await adminService.toggleDiscountCodeStatus(code._id);
      toast.success(
        `Discount code ${
          code.is_active ? "deactivated" : "activated"
        } successfully`
      );
      fetchDiscountCodes();
      fetchStats();
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("Failed to update discount code status");
    }
  };

  const handleDelete = async () => {
    try {
      await adminService.deleteDiscountCode(selectedCode._id);
      toast.success("Discount code deleted successfully");
      setShowDeleteModal(false);
      setSelectedCode(null);
      fetchDiscountCodes();
      fetchStats();
    } catch (error) {
      console.error("Error deleting discount code:", error);
      toast.error("Failed to delete discount code");
    }
  };

  const handleViewDetails = (code) => {
    setSelectedCode(code);
    setShowDetailsModal(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (isActive) => {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
      >
        {isActive ? "Active" : "Inactive"}
      </span>
    );
  };

  const getDiscountDisplay = (code) => {
    if (code.discount_type === "percentage") {
      return `${code.discount_value}%`;
    }
    return formatCurrency(code.discount_value);
  };

  if (loading && discountCodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Discount Codes</h1>
          <p className="text-gray-600">Manage registration discount codes</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <FiPlus size={20} />
          <span className="whitespace-nowrap">Create Discount Code</span>
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiPercent className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Codes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total_codes || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiToggleRight className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Active Codes
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.active_codes || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiUsers className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Uses</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total_uses || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FiDollarSign className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Savings
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.total_discount_amount || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search discount codes..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={filters.is_active}
            onChange={(e) => handleFilterChange("is_active", e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          <select
            value={filters.discount_type}
            onChange={(e) =>
              handleFilterChange("discount_type", e.target.value)
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Types</option>
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>

          <button
            onClick={() => {
              setFilters({ search: "", is_active: "", discount_type: "" });
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <FiRefreshCw size={16} />
            Reset
          </button>
        </div>
      </div>

      {/* Discount Codes Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valid Until
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {discountCodes.map((code) => (
                <tr key={code._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">
                        {code.code}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {code.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {code.discount_type === "percentage" ? (
                        <FiPercent className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <FiDollarSign className="h-4 w-4 text-blue-500 mr-1" />
                      )}
                      <span className="text-sm font-medium text-gray-900">
                        {getDiscountDisplay(code)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {code.current_uses || 0}
                      {code.max_uses && ` / ${code.max_uses}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {code.valid_until
                        ? format(new Date(code.valid_until), "MMM dd, yyyy")
                        : "No expiry"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(code.is_active)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetails(code)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="View Details"
                      >
                        <FiEye size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(code)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                        title="Edit"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(code)}
                        className={`p-1 rounded ${
                          code.is_active
                            ? "text-red-600 hover:text-red-900"
                            : "text-green-600 hover:text-green-900"
                        }`}
                        title={code.is_active ? "Deactivate" : "Activate"}
                      >
                        {code.is_active ? (
                          <FiToggleRight size={16} />
                        ) : (
                          <FiToggleLeft size={16} />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCode(code);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        title="Delete"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                }
                disabled={pagination.page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                }
                disabled={pagination.page === pagination.pages}
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
                    {(pagination.page - 1) * pagination.limit + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}
                  </span>{" "}
                  of <span className="font-medium">{pagination.total}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: prev.page - 1,
                      }))
                    }
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from(
                    { length: pagination.pages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() =>
                        setPagination((prev) => ({ ...prev, page }))
                      }
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === pagination.page
                          ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: prev.page + 1,
                      }))
                    }
                    disabled={pagination.page === pagination.pages}
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

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showCreateModal || showEditModal}
        onClose={() => {
          setShowCreateModal(false);
          setShowEditModal(false);
          resetForm();
          setSelectedCode(null);
        }}
        title={selectedCode ? "Edit Discount Code" : "Create Discount Code"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CustomInput
              label="Discount Code"
              name="code"
              value={formData.code}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  code: e.target.value.toUpperCase(),
                }))
              }
              placeholder="e.g., WELCOME50"
              error={formErrors.code}
              required
              disabled={selectedCode} // Don't allow editing code
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.discount_type}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    discount_type: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
          </div>

          <CustomInput
            label="Description"
            name="description"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Brief description of the discount"
            error={formErrors.description}
            required
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CustomInput
              label={`Discount Value ${
                formData.discount_type === "percentage" ? "(%)" : "(₦)"
              }`}
              name="discount_value"
              type="number"
              value={formData.discount_value}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  discount_value: e.target.value,
                }))
              }
              placeholder={
                formData.discount_type === "percentage"
                  ? "e.g., 50"
                  : "e.g., 5000"
              }
              error={formErrors.discount_value}
              required
              min="0"
              max={formData.discount_type === "percentage" ? "100" : undefined}
              step={formData.discount_type === "percentage" ? "0.01" : "1"}
            />

            <CustomInput
              label="Max Uses (Optional)"
              name="max_uses"
              type="number"
              value={formData.max_uses}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, max_uses: e.target.value }))
              }
              placeholder="Leave empty for unlimited"
              error={formErrors.max_uses}
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Applicable To
            </label>
            <select
              value={formData.applicable_to}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  applicable_to: e.target.value,
                }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="registration_fee">Registration Fee Only</option>
              <option value="all">All Applicable Fees</option>
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CustomInput
              label="Valid From (Optional)"
              name="valid_from"
              type="datetime-local"
              value={formData.valid_from}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, valid_from: e.target.value }))
              }
            />

            <CustomInput
              label="Valid Until (Optional)"
              name="valid_until"
              type="datetime-local"
              value={formData.valid_until}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  valid_until: e.target.value,
                }))
              }
              error={formErrors.valid_until}
            />
          </div>

          {/* Sticky button container for mobile */}
          <div className="sticky bottom-0 bg-white pt-6 pb-2 border-t border-gray-200 -mx-4 sm:-mx-6 px-4 sm:px-6 mt-6">
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  resetForm();
                  setSelectedCode(null);
                }}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? "Saving..."
                  : selectedCode
                  ? "Update"
                  : "Create"}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedCode(null);
        }}
        title="Delete Discount Code"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete the discount code "
            {selectedCode?.code}"? This action cannot be undone.
          </p>

          {selectedCode?.current_uses > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-yellow-800 text-sm">
                <strong>Warning:</strong> This discount code has been used{" "}
                {selectedCode.current_uses} times. Deleting it may affect
                historical records.
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedCode(null);
              }}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* Details Modal */}
      <RightSidebarModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedCode(null);
        }}
        title="Discount Code Details"
      >
        {selectedCode && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {selectedCode.code}
              </h3>
              <p className="text-gray-600">{selectedCode.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Discount Type
                </label>
                <p className="text-gray-900 capitalize">
                  {selectedCode.discount_type}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Discount Value
                </label>
                <p className="text-gray-900">
                  {getDiscountDisplay(selectedCode)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Applicable To
                </label>
                <p className="text-gray-900 capitalize">
                  {selectedCode.applicable_to.replace("_", " ")}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Status
                </label>
                <div className="mt-1">
                  {getStatusBadge(selectedCode.is_active)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Current Uses
                </label>
                <p className="text-gray-900">
                  {selectedCode.current_uses || 0}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Max Uses
                </label>
                <p className="text-gray-900">
                  {selectedCode.max_uses || "Unlimited"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Valid From
                </label>
                <p className="text-gray-900">
                  {selectedCode.valid_from
                    ? format(
                        new Date(selectedCode.valid_from),
                        "MMM dd, yyyy 'at' HH:mm"
                      )
                    : "Immediately"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Valid Until
                </label>
                <p className="text-gray-900">
                  {selectedCode.valid_until
                    ? format(
                        new Date(selectedCode.valid_until),
                        "MMM dd, yyyy 'at' HH:mm"
                      )
                    : "No expiry"}
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">
                Created
              </label>
              <p className="text-gray-900">
                {format(
                  new Date(selectedCode.createdAt),
                  "MMM dd, yyyy 'at' HH:mm"
                )}
              </p>
            </div>

            {selectedCode.used_by && selectedCode.used_by.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500 mb-2 block">
                  Recent Usage
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedCode.used_by
                    .slice(-5)
                    .reverse()
                    .map((usage, index) => (
                      <div
                        key={index}
                        className="bg-white p-3 rounded border text-sm"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">User: {usage.user_id}</p>
                            <p className="text-gray-600">
                              Saved: {formatCurrency(usage.discount_amount)}
                            </p>
                          </div>
                          <p className="text-gray-500 text-xs">
                            {format(new Date(usage.used_at), "MMM dd, yyyy")}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </RightSidebarModal>
    </div>
  );
}
