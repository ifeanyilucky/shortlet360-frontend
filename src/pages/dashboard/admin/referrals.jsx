import { useState, useEffect } from "react";
import {
  FiUsers,
  FiTrendingUp,
  FiGift,
  FiSearch,
  FiFilter,
  FiDownload,
  FiEye,
  FiRefreshCw,
} from "react-icons/fi";
import { referralService } from "../../../services/api";
import toast from "react-hot-toast";
import ReferralDetailModal from "../../../components/ReferralDetailModal";

export default function AdminReferrals() {
  const [referrals, setReferrals] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    role: "",
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState({});
  const [selectedReferralId, setSelectedReferralId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchReferrals();
    fetchAnalytics();
  }, [filters]);

  const fetchReferrals = async () => {
    try {
      setLoading(true);
      const response = await referralService.getAllReferrals(filters);
      setReferrals(response.data.referrals);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching referrals:", error);
      toast.error("Failed to fetch referrals");
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      const response = await referralService.getReferralAnalytics();
      setAnalytics(response.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to fetch analytics");
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filtering
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const refreshData = () => {
    fetchReferrals();
    fetchAnalytics();
  };

  const handleViewReferral = (referralId) => {
    setSelectedReferralId(referralId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReferralId(null);
  };

  if (analyticsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Referral Management
          </h1>
          <p className="text-gray-600">
            Monitor and manage the referral program
          </p>
        </div>
        <button
          onClick={refreshData}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <FiRefreshCw className="mr-2" />
          Refresh
        </button>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <FiUsers size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Referrals</p>
                <h3 className="text-2xl font-bold">
                  {analytics.overview.totalReferrals}
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <FiTrendingUp size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Verified Referrals</p>
                <h3 className="text-2xl font-bold">
                  {analytics.overview.verifiedReferrals}
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                <FiGift size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Conversion Rate</p>
                <h3 className="text-2xl font-bold">
                  {analytics.overview.conversionRate}%
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                <FiUsers size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <h3 className="text-2xl font-bold">
                  {analytics.overview.pendingReferrals}
                </h3>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Role Breakdown */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Referrals by Role</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Property Owners</span>
                <span className="font-semibold">
                  {analytics.roleBreakdown.ownerReferrals}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Regular Users</span>
                <span className="font-semibold">
                  {analytics.roleBreakdown.userReferrals}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Top Referrers</h3>
            <div className="space-y-3">
              {analytics.topReferrers.slice(0, 5).map((referrer) => (
                <div
                  key={referrer._id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <span className="text-sm font-medium">
                      {referrer.user.first_name} {referrer.user.last_name}
                    </span>
                    <p className="text-xs text-gray-500">
                      {referrer.user.email}
                    </p>
                  </div>
                  <span className="font-semibold">
                    {referrer.totalReferrals}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or referral code..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rewarded">Rewarded</option>
          </select>

          <select
            value={filters.role}
            onChange={(e) => handleFilterChange("role", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Roles</option>
            <option value="user">Users</option>
            <option value="owner">Property Owners</option>
          </select>

          <button
            onClick={() =>
              setFilters({
                search: "",
                status: "",
                role: "",
                page: 1,
                limit: 10,
              })
            }
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Referrals Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold">All Referrals</h3>
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
            <FiDownload className="mr-2" />
            Export
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Referrer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Referred User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
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
                  {referrals.map((referral) => (
                    <tr key={referral._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {referral.referrer?.first_name}{" "}
                            {referral.referrer?.last_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {referral.referrer?.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {referral.referred_user?.first_name}{" "}
                            {referral.referred_user?.last_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {referral.referred_user?.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            referral.referred_user_role === "owner"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {referral.referred_user_role === "owner"
                            ? "Property Owner"
                            : "User"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            referral.status === "verified"
                              ? "bg-green-100 text-green-800"
                              : referral.status === "rewarded"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {referral.status.charAt(0).toUpperCase() +
                            referral.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(referral.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewReferral(referral._id)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="View referral details"
                        >
                          <FiEye />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Showing {(pagination.currentPage - 1) * filters.limit + 1} to{" "}
                  {Math.min(
                    pagination.currentPage * filters.limit,
                    pagination.totalReferrals
                  )}{" "}
                  of {pagination.totalReferrals} results
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Referral Detail Modal */}
      <ReferralDetailModal
        referralId={selectedReferralId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
