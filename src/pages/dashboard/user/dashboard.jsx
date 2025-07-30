import { useEffect, useState } from "react";
import { userStore } from "../../../store/userStore";
import LoadingOverlay from "../../../components/LoadingOverlay";
import { fCurrency } from "../../../utils/formatNumber";
import { format } from "date-fns";
import {
  HiOutlineCalendar,
  HiOutlineCash,
  HiOutlineLocationMarker,
  HiOutlineTicket,
  HiOutlineClipboardCopy,
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import KycStatusCard from "../../../components/KycStatusCard";
import { useAuth } from "../../../hooks/useAuth";
import { useKycStore } from "../../../store/kycStore";
import toast from "react-hot-toast";
export default function UserDashboard() {
  const { statistics, isLoading, getUserStatistics } = userStore();
  const { user } = useAuth();
  const { kycStatus, getKycStatus } = useKycStore();
  const [timeframe, setTimeframe] = useState("30");
  const navigate = useNavigate();

  useEffect(() => {
    getUserStatistics(timeframe);
  }, [timeframe, getUserStatistics]);

  useEffect(() => {
    getKycStatus();
  }, [getKycStatus]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("User ID copied to clipboard!");
  };

  // Helper function to determine if KYC is complete
  const getRequiredTiers = () => {
    // For users, only tier1 is required (NIN and phone verification)
    return ["tier1"];
  };

  const isKycComplete = () => {
    if (!kycStatus) return false;
    const requiredTiers = getRequiredTiers();
    return requiredTiers.every(
      (tier) => kycStatus[tier]?.status === "verified"
    );
  };

  if (isLoading) return <LoadingOverlay />;

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
        </select>
      </div>

      {/* User ID Display */}
      {user?.short_id && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Your User ID
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Share this ID with property owners for dispute resolution or
                support purposes.
              </p>
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-mono font-bold text-blue-600 bg-white px-4 py-2 rounded-lg border">
                  {user.short_id}
                </span>
                <button
                  onClick={() => copyToClipboard(user.short_id)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <HiOutlineClipboardCopy className="w-4 h-4" />
                  <span>Copy</span>
                </button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <HiOutlineTicket className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Payments"
          value={statistics?.total_tenants || 0}
          icon={<HiOutlineTicket className="w-6 h-6" />}
          color="blue"
        />
        <StatCard
          title="Total Spent"
          value={fCurrency(statistics?.total_spent || 0)}
          icon={<HiOutlineCash className="w-6 h-6" />}
          color="green"
        />
        <StatCard
          title="Average Monthly Rent"
          value={fCurrency(statistics?.average_monthly_rent || 0)}
          icon={<HiOutlineCalendar className="w-6 h-6" />}
          color="purple"
        />
        <StatCard
          title="Active Payments"
          value={statistics?.active_tenants || 0}
          icon={<HiOutlineLocationMarker className="w-6 h-6" />}
          color="orange"
        />
      </div>

      {/* Rental Status Breakdown */}
      <div className="bg-white rounded-xl shadow p-4 md:p-6">
        <h2 className="text-lg font-semibold mb-4">Rental Status Breakdown</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="p-3 md:p-4 rounded-lg bg-gray-50 text-center">
            <p className="text-xl md:text-2xl font-bold text-gray-800">
              {statistics?.active_tenants || 0}
            </p>
            <p className="text-xs md:text-sm text-gray-600 capitalize">
              Active
            </p>
          </div>
          <div className="p-3 md:p-4 rounded-lg bg-gray-50 text-center">
            <p className="text-xl md:text-2xl font-bold text-gray-800">
              {statistics?.pending_tenants || 0}
            </p>
            <p className="text-xs md:text-sm text-gray-600 capitalize">
              Pending
            </p>
          </div>
          <div className="p-3 md:p-4 rounded-lg bg-gray-50 text-center">
            <p className="text-xl md:text-2xl font-bold text-gray-800">
              {statistics?.expired_tenants || 0}
            </p>
            <p className="text-xs md:text-sm text-gray-600 capitalize">
              Expired
            </p>
          </div>
          <div className="p-3 md:p-4 rounded-lg bg-gray-50 text-center">
            <p className="text-xl md:text-2xl font-bold text-gray-800">
              {statistics?.terminated_tenants || 0}
            </p>
            <p className="text-xs md:text-sm text-gray-600 capitalize">
              Terminated
            </p>
          </div>
        </div>
      </div>

      {/* Recent and Active Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Recent Payments */}
        <div className="bg-white rounded-xl shadow p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Payments</h2>
          <div className="space-y-4">
            {!statistics?.tenants || statistics?.tenants?.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HiOutlineTicket className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg font-medium mb-2">
                  No payments yet
                </p>
                <p className="text-gray-400 text-sm mb-4">
                  Start exploring properties to find your perfect rental
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Properties
                </button>
              </div>
            ) : (
              <>
                {statistics?.tenants?.slice(0, 3).map((tenant) => (
                  <TenantCard key={tenant._id} tenant={tenant} />
                ))}
                <div className="flex justify-end">
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => navigate("/user/rentals")}
                  >
                    View all <span className="text-blue-500">→</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Active Payments */}
        <div className="bg-white rounded-xl shadow p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-4">Active Payments</h2>
          <div className="space-y-4">
            {!statistics?.tenants ||
            statistics?.tenants?.filter((t) => t.lease_status === "active")
              ?.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HiOutlineCalendar className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg font-medium mb-2">
                  No active payments
                </p>
                <p className="text-gray-400 text-sm mb-4">
                  You don't have any active payment agreements at the moment
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Find Properties
                </button>
              </div>
            ) : (
              statistics?.tenants
                ?.filter((t) => t.lease_status === "active")
                ?.map((tenant) => (
                  <TenantCard key={tenant._id} tenant={tenant} />
                ))
            )}
          </div>
        </div>
      </div>

      {/* KYC Status Section - Only show if KYC is not complete */}
      {!isKycComplete() && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* KYC Status Card */}
          <div className="lg:col-span-1">
            <KycStatusCard />
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 md:p-6">
      <div className="flex items-center gap-3 md:gap-4">
        <div className={`p-2 md:p-3 rounded-full ${colorClasses[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-xs md:text-sm text-gray-600">{title}</p>
          <p className="text-xl md:text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
}

function TenantCard({ tenant }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg bg-gray-50">
      <div className="w-full sm:w-20 h-32 sm:h-20 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={
            tenant.property_id?.property_images[0]?.url ||
            "/images/living-room.jpg"
          }
          alt={tenant.property_id?.property_name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-grow w-full sm:w-auto">
        <h3 className="font-semibold text-gray-800 truncate">
          {tenant.property_id?.property_name}
        </h3>
        <p className="text-sm text-gray-600">
          {format(new Date(tenant.lease_start_date), "MMM d, yyyy")} -{" "}
          {format(new Date(tenant.lease_end_date), "MMM d, yyyy")}
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2 gap-2">
          <span
            className={`px-2 py-1 rounded-full text-xs w-fit ${
              tenant.lease_status === "active"
                ? "bg-green-100 text-green-800"
                : tenant.lease_status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : tenant.lease_status === "expired"
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {tenant.lease_status}
          </span>
          <span className="font-semibold text-gray-800">
            {fCurrency(tenant.monthly_rent)}/month
          </span>
        </div>
      </div>
    </div>
  );
}
