import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiHome,
  FiCalendar,
  FiKey,
  FiDollarSign,
  FiGift,
} from "react-icons/fi";
import { MdOutlineAddHome, MdOutlineAssignment } from "react-icons/md";
import { HiOutlineUsers } from "react-icons/hi";
import { getGreeting } from "../../../utils/helpers";
import adminService from "../../../services/adminService";
import { referralService } from "../../../services/api";
import { useAuth } from "../../../hooks/useAuth";
import { fCurrency } from "../../../utils/formatNumber";
import { format } from "date-fns";

export default function AdminDashboard() {
  const [greeting, setGreeting] = useState(getGreeting());
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [referralAnalytics, setReferralAnalytics] = useState(null);
  const [timeframe, setTimeframe] = useState("30");
  const { user } = useAuth();

  async function getDashboardStats() {
    try {
      setLoading(true);
      const res = await adminService.getDashboardStats();
      setDashboardStats(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function getReferralAnalytics() {
    try {
      const response = await referralService.getReferralAnalytics();
      setReferralAnalytics(response.data);
    } catch (error) {
      console.log("Error fetching referral analytics:", error);
    }
  }

  useEffect(() => {
    getDashboardStats();
    getReferralAnalytics();
  }, [timeframe]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = dashboardStats?.stats || {
    userCount: 0,
    ownerCount: 0,
    propertyCount: 0,
    bookingCount: 0,
    pendingKycCount: 0,
    revenue: 0,
    tenantCount: 0,
    activeTenantCount: 0,
  };

  const recentUsers = dashboardStats?.recentUsers || [];
  const recentProperties = dashboardStats?.recentProperties || [];
  const recentBookings = dashboardStats?.recentBookings || [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {greeting}, {user?.first_name}
        </h1>
        <p className="text-gray-600">
          Welcome to your admin dashboard. Here's what's happening.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <FiUsers size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <h3 className="text-2xl font-bold">{stats.userCount}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <HiOutlineUsers size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Property Owners</p>
              <h3 className="text-2xl font-bold">{stats.ownerCount}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <MdOutlineAddHome size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Properties</p>
              <h3 className="text-2xl font-bold">{stats.propertyCount}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
              <FiCalendar size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Bookings</p>
              <h3 className="text-2xl font-bold">{stats.bookingCount}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
              <FiKey size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending KYC</p>
              <h3 className="text-2xl font-bold">{stats.pendingKycCount}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-teal-100 text-teal-600 mr-4">
              <FiDollarSign size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold">{fCurrency(stats.revenue)}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-pink-100 text-pink-600 mr-4">
              <FiGift size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Referrals</p>
              <h3 className="text-2xl font-bold">
                {referralAnalytics?.overview?.totalReferrals || 0}
              </h3>
              <Link
                to="/admin/referrals"
                className="text-xs text-pink-600 hover:underline"
              >
                View Details →
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
              <MdOutlineAssignment size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Tenants</p>
              <h3 className="text-2xl font-bold">{stats.activeTenantCount}</h3>
              <Link
                to="/admin/tenants"
                className="text-xs text-indigo-600 hover:underline"
              >
                View Details →
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <FiUsers size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Tenants</p>
              <h3 className="text-2xl font-bold">{stats.tenantCount}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Users</h2>
            <Link
              to="/admin/users"
              className="text-sm text-blue-600 hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentUsers.map((user) => (
                  <tr key={user._id}>
                    <td className="px-4 py-3 whitespace-nowrap">
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
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {user.short_id}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === "owner"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(user.createdAt), "MMM dd, yyyy")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Properties */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Properties</h2>
            <Link
              to="/admin/properties"
              className="text-sm text-blue-600 hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentProperties.map((property) => (
                  <tr key={property._id}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {property.property_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {property.property_category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {property.short_id}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {property.location.city}, {property.location.state}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(property.createdAt), "MMM dd, yyyy")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Bookings</h2>
            <Link
              to="/admin/bookings"
              className="text-sm text-blue-600 hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guest
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check In
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check Out
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentBookings.map((booking) => (
                  <tr key={booking._id}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.property_id?.property_name || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.property_id?.short_id || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.guest?.first_name} {booking.guest?.last_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.guest?.short_id || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(booking.check_in_date), "MMM dd, yyyy")}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(booking.check_out_date), "MMM dd, yyyy")}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {fCurrency(booking.total_price)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.booking_status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : booking.booking_status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : booking.booking_status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {booking.booking_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
