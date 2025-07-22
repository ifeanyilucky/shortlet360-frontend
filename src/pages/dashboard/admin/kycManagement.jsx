import { useState, useEffect } from "react";
import { FiSearch, FiFilter, FiImage, FiFileText } from "react-icons/fi";
import adminService from "../../../services/adminService";
import { format } from "date-fns";
import toast from "react-hot-toast";

export default function AdminKycManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 10,
  });
  const [filters, setFilters] = useState({
    tier: "",
    search: "",
    status: "all", // New status filter: "all", "pending", "verified"
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showNinImage, setShowNinImage] = useState(false);
  const [showRawData, setShowRawData] = useState(false);

  const fetchKycData = async () => {
    try {
      setLoading(true);
      let res;

      // Choose API endpoint based on status filter
      if (filters.status === "pending") {
        res = await adminService.getPendingKycVerifications({
          page: pagination.page,
          limit: pagination.limit,
          tier: filters.tier,
          search: filters.search,
        });
      } else if (filters.status === "verified") {
        res = await adminService.getVerifiedKycVerification({
          page: pagination.page,
          limit: pagination.limit,
          tier: filters.tier,
          search: filters.search,
        });
      } else {
        // For "all" status, use the verified endpoint which returns all records
        res = await adminService.getVerifiedKycVerification({
          page: pagination.page,
          limit: pagination.limit,
          tier: filters.tier,
          search: filters.search,
        });
      }

      setUsers(res.data.users);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch KYC verifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKycData();
  }, [pagination.page, pagination.limit, filters]);

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setPagination({ ...pagination, page: 1 }); // Reset to first page when filters change
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchKycData();
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleUpdateTier1 = async (userId, status) => {
    try {
      await adminService.updateTier1Verification(userId, status);
      toast.success(`Tier 1 verification ${status}`);
      fetchKycData();
      if (selectedUser && selectedUser._id === userId) {
        setShowModal(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update verification status");
    }
  };

  const handleUpdateTier2 = async (userId, data) => {
    try {
      await adminService.updateTier2Verification(userId, data);
      toast.success("Tier 2 verification updated");
      fetchKycData();
      if (selectedUser && selectedUser._id === userId) {
        setShowModal(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update verification status");
    }
  };

  const handleUpdateTier3 = async (userId, data) => {
    try {
      await adminService.updateTier3Verification(userId, data);
      toast.success("Tier 3 verification updated");
      fetchKycData();
      if (selectedUser && selectedUser._id === userId) {
        setShowModal(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update verification status");
    }
  };

  // Get the current page title based on status filter
  const getPageTitle = () => {
    switch (filters.status) {
      case "pending":
        return "Pending KYC Verifications";
      case "verified":
        return "Verified KYC Records";
      default:
        return "KYC Verification Management";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{getPageTitle()}</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            <FiFilter className="mr-2" />
            Filters
          </button>
        </div>
      </div>

      {/* Notice about Tier 1 only policy */}
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="w-5 h-5 text-blue-500 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Current KYC Policy
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              The platform now only requires{" "}
              <strong>Tier 1 verification</strong> (Phone + NIN) for all users
              and property owners. Tier 2 and Tier 3 data shown here is for
              historical reference only.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Records</option>
                <option value="pending">Pending KYC</option>
                <option value="verified">Verified KYC</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tier
              </label>
              <select
                name="tier"
                value={filters.tier}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Tiers</option>
                <option value="1">Tier 1 (Active)</option>
                <option value="2">Tier 2 (Legacy)</option>
                <option value="3">Tier 3 (Legacy)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search by name, email, or ID"
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Apply Filters
              </button>
            </div>
          </form>
        </div>
      )}

      {/* KYC Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      NIN
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tier 1 Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tier 2 Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tier 3 Status
                    </th>
                    {filters.status === "pending" && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bank Account
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.first_name} {user.last_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.short_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === "owner"
                              ? "bg-green-100 text-green-800"
                              : user.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.phone_number || "Not provided"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.kyc?.tier1?.nin
                          ? `${user.kyc.tier1.nin.substring(
                              0,
                              3
                            )}****${user.kyc.tier1.nin.substring(7)}`
                          : "Not provided"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.kyc?.tier1?.status === "verified"
                              ? "bg-green-100 text-green-800"
                              : user.kyc?.tier1?.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {user.kyc?.tier1?.status || "Not Started"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.kyc?.tier2?.status === "verified"
                              ? "bg-green-100 text-green-800"
                              : user.kyc?.tier2?.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : user.kyc?.tier2?.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.kyc?.tier2?.status || "Not Started"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.kyc?.tier3?.status === "verified"
                              ? "bg-green-100 text-green-800"
                              : user.kyc?.tier3?.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : user.kyc?.tier3?.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.kyc?.tier3?.status || "Not Started"}
                        </span>
                      </td>
                      {filters.status === "pending" && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.kyc?.tier3?.bank_account ? (
                            <div>
                              <div className="text-xs">
                                {user.kyc.tier3.bank_account.bank_name ||
                                  "Unknown Bank"}
                              </div>
                              <div className="text-xs text-gray-400 font-mono">
                                {user.kyc.tier3.bank_account.account_number
                                  ? `****${user.kyc.tier3.bank_account.account_number.substring(
                                      6
                                    )}`
                                  : "No account"}
                              </div>
                              <div className="text-xs">
                                <span
                                  className={`${
                                    user.kyc.tier3.bank_account
                                      .verification_status === "verified"
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {
                                    user.kyc.tier3.bank_account
                                      .verification_status
                                  }
                                </span>
                              </div>
                            </div>
                          ) : (
                            "Not provided"
                          )}
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleViewDetails(user)}
                            className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
                            title="View Details"
                          >
                            View
                          </button>
                          {user.kyc?.tier1?.status === "pending" && (
                            <>
                              <button
                                onClick={() =>
                                  handleUpdateTier1(user._id, "verified")
                                }
                                className="px-3 py-1 bg-green-100 text-green-600 rounded-md hover:bg-green-200"
                                title="Approve Tier 1"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  handleUpdateTier1(user._id, "rejected")
                                }
                                className="px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                                title="Reject Tier 1"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    pagination.page === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    pagination.page === pagination.pages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
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
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        pagination.page === 1
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    {/* Page numbers */}
                    {[...Array(pagination.pages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          pagination.page === i + 1
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        pagination.page === pagination.pages
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* KYC Details Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full max-h-screen overflow-y-auto">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      KYC Verification Details
                    </h3>
                    <div className="mt-4">
                      <h4 className="text-md font-medium text-gray-900">
                        User Information
                      </h4>
                      <p className="text-sm text-gray-500">
                        Name: {selectedUser.first_name} {selectedUser.last_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Email: {selectedUser.email}
                      </p>
                      <p className="text-sm text-gray-500">
                        ID: {selectedUser.short_id}
                      </p>
                      <p className="text-sm text-gray-500">
                        Role: {selectedUser.role}
                      </p>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-md font-medium text-gray-900">
                        Tier 1: Basic Verification
                      </h4>
                      <div className="bg-gray-50 p-3 rounded-md mt-2">
                        <p className="text-sm text-gray-700 font-medium">
                          Status:{" "}
                          <span
                            className={`${
                              selectedUser.kyc?.tier1?.status === "verified"
                                ? "text-green-600"
                                : selectedUser.kyc?.tier1?.status === "rejected"
                                ? "text-red-600"
                                : "text-yellow-600"
                            }`}
                          >
                            {selectedUser.kyc?.tier1?.status || "Not Started"}
                          </span>
                        </p>
                        <p className="text-sm text-gray-700">
                          Email Verified:{" "}
                          <span
                            className={
                              selectedUser.kyc?.tier1?.email_verified
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {selectedUser.kyc?.tier1?.email_verified
                              ? "Yes"
                              : "No"}
                          </span>
                        </p>
                        <p className="text-sm text-gray-700">
                          Phone Verified:{" "}
                          <span
                            className={
                              selectedUser.kyc?.tier1?.phone_verified
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {selectedUser.kyc?.tier1?.phone_verified
                              ? "Yes"
                              : "No"}
                          </span>
                        </p>
                        <p className="text-sm text-gray-700">
                          NIN Verified:{" "}
                          <span
                            className={
                              selectedUser.kyc?.tier1?.nin_verified
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {selectedUser.kyc?.tier1?.nin_verified
                              ? "Yes"
                              : "No"}
                          </span>
                        </p>

                        {/* User Submitted Information */}
                        {(selectedUser.phone_number ||
                          selectedUser.kyc?.tier1?.nin) && (
                          <div className="mt-3 border-t pt-3">
                            <h5 className="text-sm font-medium text-gray-900 mb-2">
                              Submitted Information:
                            </h5>
                            {selectedUser.phone_number && (
                              <p className="text-sm text-gray-700">
                                Phone Number:{" "}
                                <span className="font-mono">
                                  {selectedUser.phone_number}
                                </span>
                              </p>
                            )}
                            {selectedUser.kyc?.tier1?.nin && (
                              <p className="text-sm text-gray-700">
                                NIN:{" "}
                                <span className="font-mono">
                                  {selectedUser.kyc.tier1.nin}
                                </span>
                              </p>
                            )}
                          </div>
                        )}

                        {/* YouVerify Phone Verification Data */}
                        {selectedUser.kyc?.tier1?.phone_verification_data && (
                          <div className="mt-3 border-t pt-3">
                            <h5 className="text-sm font-medium text-gray-900 mb-2">
                              Phone Verification Details:
                            </h5>
                            <p className="text-sm text-gray-700">
                              Verification ID:{" "}
                              <span className="font-mono text-xs">
                                {
                                  selectedUser.kyc.tier1.phone_verification_data
                                    .verification_id
                                }
                              </span>
                            </p>
                            <p className="text-sm text-gray-700">
                              Status:{" "}
                              <span className="text-green-600">
                                {
                                  selectedUser.kyc.tier1.phone_verification_data
                                    .status
                                }
                              </span>
                            </p>
                            {selectedUser.kyc.tier1.phone_verification_data
                              .verified_at && (
                              <p className="text-sm text-gray-700">
                                Verified At:{" "}
                                {format(
                                  new Date(
                                    selectedUser.kyc.tier1.phone_verification_data.verified_at
                                  ),
                                  "PPpp"
                                )}
                              </p>
                            )}
                            {selectedUser.kyc.tier1.phone_verification_data
                              .phone_details &&
                              selectedUser.kyc.tier1.phone_verification_data
                                .phone_details.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-sm font-medium text-gray-700">
                                    Phone Details from YouVerify:
                                  </p>
                                  {selectedUser.kyc.tier1.phone_verification_data.phone_details.map(
                                    (detail, index) => (
                                      <div
                                        key={index}
                                        className="ml-2 mt-1 text-xs text-gray-600"
                                      >
                                        <p>Name: {detail.fullName}</p>
                                        {detail.dateOfBirth && (
                                          <p>DOB: {detail.dateOfBirth}</p>
                                        )}
                                      </div>
                                    )
                                  )}
                                </div>
                              )}
                          </div>
                        )}

                        {/* YouVerify NIN Verification Data */}
                        {selectedUser.kyc?.tier1?.nin_verification_data && (
                          <div className="mt-3 border-t pt-3">
                            <h5 className="text-sm font-medium text-gray-900 mb-2">
                              NIN Verification Details:
                            </h5>
                            <p className="text-sm text-gray-700">
                              Verification ID:{" "}
                              <span className="font-mono text-xs">
                                {
                                  selectedUser.kyc.tier1.nin_verification_data
                                    .verification_id
                                }
                              </span>
                            </p>
                            <p className="text-sm text-gray-700">
                              Status:{" "}
                              <span className="text-green-600">
                                {
                                  selectedUser.kyc.tier1.nin_verification_data
                                    .status
                                }
                              </span>
                            </p>
                            {selectedUser.kyc.tier1.nin_verification_data
                              .verified_at && (
                              <p className="text-sm text-gray-700">
                                Verified At:{" "}
                                {format(
                                  new Date(
                                    selectedUser.kyc.tier1.nin_verification_data.verified_at
                                  ),
                                  "PPpp"
                                )}
                              </p>
                            )}
                            <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600">
                              {selectedUser.kyc.tier1.nin_verification_data
                                .first_name && (
                                <p>
                                  First Name:{" "}
                                  {
                                    selectedUser.kyc.tier1.nin_verification_data
                                      .first_name
                                  }
                                </p>
                              )}
                              {selectedUser.kyc.tier1.nin_verification_data
                                .middle_name && (
                                <p>
                                  Middle Name:{" "}
                                  {
                                    selectedUser.kyc.tier1.nin_verification_data
                                      .middle_name
                                  }
                                </p>
                              )}
                              {selectedUser.kyc.tier1.nin_verification_data
                                .last_name && (
                                <p>
                                  Last Name:{" "}
                                  {
                                    selectedUser.kyc.tier1.nin_verification_data
                                      .last_name
                                  }
                                </p>
                              )}
                              {selectedUser.kyc.tier1.nin_verification_data
                                .date_of_birth && (
                                <p>
                                  Date of Birth:{" "}
                                  {
                                    selectedUser.kyc.tier1.nin_verification_data
                                      .date_of_birth
                                  }
                                </p>
                              )}
                              {selectedUser.kyc.tier1.nin_verification_data
                                .gender && (
                                <p>
                                  Gender:{" "}
                                  {
                                    selectedUser.kyc.tier1.nin_verification_data
                                      .gender
                                  }
                                </p>
                              )}
                              {selectedUser.kyc.tier1.nin_verification_data
                                .mobile && (
                                <p>
                                  Mobile:{" "}
                                  {
                                    selectedUser.kyc.tier1.nin_verification_data
                                      .mobile
                                  }
                                </p>
                              )}
                              {selectedUser.kyc.tier1.nin_verification_data
                                .birth_state && (
                                <p>
                                  Birth State:{" "}
                                  {
                                    selectedUser.kyc.tier1.nin_verification_data
                                      .birth_state
                                  }
                                </p>
                              )}
                              {selectedUser.kyc.tier1.nin_verification_data
                                .birth_lga && (
                                <p>
                                  Birth LGA:{" "}
                                  {
                                    selectedUser.kyc.tier1.nin_verification_data
                                      .birth_lga
                                  }
                                </p>
                              )}
                              {selectedUser.kyc.tier1.nin_verification_data
                                .religion && (
                                <p>
                                  Religion:{" "}
                                  {
                                    selectedUser.kyc.tier1.nin_verification_data
                                      .religion
                                  }
                                </p>
                              )}
                            </div>
                            {selectedUser.kyc.tier1.nin_verification_data
                              .address && (
                              <div className="mt-2">
                                <p className="text-sm font-medium text-gray-700">
                                  Address:
                                </p>
                                <div className="ml-2 text-xs text-gray-600">
                                  {selectedUser.kyc.tier1.nin_verification_data
                                    .address.addressLine && (
                                    <p>
                                      {
                                        selectedUser.kyc.tier1
                                          .nin_verification_data.address
                                          .addressLine
                                      }
                                    </p>
                                  )}
                                  {selectedUser.kyc.tier1.nin_verification_data
                                    .address.town && (
                                    <p>
                                      Town:{" "}
                                      {
                                        selectedUser.kyc.tier1
                                          .nin_verification_data.address.town
                                      }
                                    </p>
                                  )}
                                  {selectedUser.kyc.tier1.nin_verification_data
                                    .address.lga && (
                                    <p>
                                      LGA:{" "}
                                      {
                                        selectedUser.kyc.tier1
                                          .nin_verification_data.address.lga
                                      }
                                    </p>
                                  )}
                                  {selectedUser.kyc.tier1.nin_verification_data
                                    .address.state && (
                                    <p>
                                      State:{" "}
                                      {
                                        selectedUser.kyc.tier1
                                          .nin_verification_data.address.state
                                      }
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Action buttons for NIN verification data */}
                        {selectedUser.kyc?.tier1?.nin_verification_data && (
                          <div className="mt-3 flex space-x-2">
                            {selectedUser.kyc.tier1.nin_verification_data
                              .image && (
                              <button
                                onClick={() => setShowNinImage(true)}
                                className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs hover:bg-blue-200"
                              >
                                <FiImage className="mr-1" />
                                View NIN Photo
                              </button>
                            )}
                            <button
                              onClick={() => setShowRawData(true)}
                              className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs hover:bg-gray-200"
                            >
                              <FiFileText className="mr-1" />
                              View Raw Data
                            </button>
                          </div>
                        )}
                      </div>

                      {selectedUser.kyc?.tier1?.status === "pending" && (
                        <div className="mt-4 flex space-x-2">
                          <button
                            onClick={() =>
                              handleUpdateTier1(selectedUser._id, "verified")
                            }
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateTier1(selectedUser._id, "rejected")
                            }
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Tier 2 Section */}
                    {selectedUser.kyc?.tier2 && (
                      <div className="mt-4">
                        <h4 className="text-md font-medium text-gray-900">
                          Tier 2: Identity Verification
                        </h4>
                        <div className="bg-gray-50 p-3 rounded-md mt-2">
                          <p className="text-sm text-gray-700 font-medium">
                            Status:{" "}
                            <span
                              className={`${
                                selectedUser.kyc?.tier2?.status === "verified"
                                  ? "text-green-600"
                                  : selectedUser.kyc?.tier2?.status ===
                                    "rejected"
                                  ? "text-red-600"
                                  : "text-yellow-600"
                              }`}
                            >
                              {selectedUser.kyc?.tier2?.status || "Not Started"}
                            </span>
                          </p>
                          <p className="text-sm text-gray-700">
                            Address:{" "}
                            {selectedUser.kyc?.tier2?.address
                              ?.verification_status || "Not Submitted"}
                          </p>
                          <p className="text-sm text-gray-700">
                            Identity:{" "}
                            {selectedUser.kyc?.tier2?.identity
                              ?.verification_status || "Not Submitted"}
                          </p>
                        </div>
                        {selectedUser.kyc?.tier2?.status === "pending" && (
                          <div className="mt-2 flex space-x-2">
                            <button
                              onClick={() =>
                                handleUpdateTier2(selectedUser._id, {
                                  status: "verified",
                                })
                              }
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateTier2(selectedUser._id, {
                                  status: "rejected",
                                })
                              }
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tier 3 Section */}
                    {selectedUser.kyc?.tier3 && (
                      <div className="mt-4">
                        <h4 className="text-md font-medium text-gray-900">
                          Tier 3: Financial Verification
                        </h4>
                        <div className="bg-gray-50 p-3 rounded-md mt-2">
                          <p className="text-sm text-gray-700 font-medium">
                            Status:{" "}
                            <span
                              className={`${
                                selectedUser.kyc?.tier3?.status === "verified"
                                  ? "text-green-600"
                                  : selectedUser.kyc?.tier3?.status ===
                                    "rejected"
                                  ? "text-red-600"
                                  : "text-yellow-600"
                              }`}
                            >
                              {selectedUser.kyc?.tier3?.status || "Not Started"}
                            </span>
                          </p>

                          {/* BVN Verification Details */}
                          {selectedUser.kyc?.tier3?.bvn && (
                            <div className="mt-3 border-t pt-3">
                              <h5 className="text-sm font-medium text-gray-900 mb-2">
                                BVN Verification:
                              </h5>
                              <p className="text-sm text-gray-700">
                                BVN:{" "}
                                <span className="font-mono">
                                  {selectedUser.kyc.tier3.bvn.bvn_number
                                    ? `${selectedUser.kyc.tier3.bvn.bvn_number.substring(
                                        0,
                                        3
                                      )}****${selectedUser.kyc.tier3.bvn.bvn_number.substring(
                                        7
                                      )}`
                                    : "Not provided"}
                                </span>
                              </p>
                              <p className="text-sm text-gray-700">
                                Status:{" "}
                                <span
                                  className={
                                    selectedUser.kyc.tier3.bvn
                                      .verification_status === "verified"
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }
                                >
                                  {
                                    selectedUser.kyc.tier3.bvn
                                      .verification_status
                                  }
                                </span>
                              </p>
                            </div>
                          )}

                          {/* Bank Account Verification Details */}
                          {selectedUser.kyc?.tier3?.bank_account && (
                            <div className="mt-3 border-t pt-3">
                              <h5 className="text-sm font-medium text-gray-900 mb-2">
                                Bank Account Verification:
                              </h5>
                              <p className="text-sm text-gray-700">
                                Account Number:{" "}
                                <span className="font-mono">
                                  {selectedUser.kyc.tier3.bank_account
                                    .account_number || "Not provided"}
                                </span>
                              </p>
                              <p className="text-sm text-gray-700">
                                Bank Name:{" "}
                                <span className="font-medium">
                                  {selectedUser.kyc.tier3.bank_account
                                    .bank_name || "Not provided"}
                                </span>
                              </p>
                              <p className="text-sm text-gray-700">
                                Account Name:{" "}
                                <span className="font-medium">
                                  {selectedUser.kyc.tier3.bank_account
                                    .account_name || "Not provided"}
                                </span>
                              </p>
                              <p className="text-sm text-gray-700">
                                Status:{" "}
                                <span
                                  className={
                                    selectedUser.kyc.tier3.bank_account
                                      .verification_status === "verified"
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }
                                >
                                  {
                                    selectedUser.kyc.tier3.bank_account
                                      .verification_status
                                  }
                                </span>
                              </p>
                            </div>
                          )}
                        </div>
                        {selectedUser.kyc?.tier3?.status === "pending" && (
                          <div className="mt-2 flex space-x-2">
                            <button
                              onClick={() =>
                                handleUpdateTier3(selectedUser._id, {
                                  status: "verified",
                                })
                              }
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateTier3(selectedUser._id, {
                                  status: "rejected",
                                })
                              }
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NIN Image Modal */}
      {showNinImage &&
        selectedUser?.kyc?.tier1?.nin_verification_data?.image && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        NIN Photo from YouVerify
                      </h3>
                      <div className="mt-4 text-center">
                        <img
                          src={
                            selectedUser.kyc.tier1.nin_verification_data.image
                          }
                          alt="NIN Photo"
                          className="max-w-full h-auto rounded-lg shadow-md"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setShowNinImage(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Raw Data Modal */}
      {showRawData && selectedUser?.kyc?.tier1 && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full max-h-screen overflow-y-auto">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Raw KYC Data
                    </h3>
                    <div className="mt-4">
                      <pre className="bg-gray-100 p-4 rounded-md text-xs overflow-auto max-h-96">
                        {JSON.stringify(selectedUser.kyc, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowRawData(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
