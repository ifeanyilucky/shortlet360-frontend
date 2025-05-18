import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUsers } from "react-icons/fi";
import { MdOutlineAddHome } from "react-icons/md";
import adminService from "../../../services/adminService";
import toast from "react-hot-toast";

export default function AdminUsers() {
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    totalOwners: 0,
    totalRegularUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      // You might need to create this endpoint in your backend
      const res = await adminService.getDashboardStats();
      console.log(res.data);
      setUserStats({
        totalUsers: res.data.stats.userCount + res.data.stats.ownerCount || 0,
        totalOwners: res.data.stats.ownerCount || 0,
        totalRegularUsers: res.data.stats.userCount || 0,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch user statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserStats();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
      </div>

      {/* User Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* All Users Card */}
        <div
          onClick={() => navigate("/admin/users/all")}
          className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">All Users</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {loading ? "..." : userStats.totalUsers}
              </h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FiUsers className="text-blue-600 text-xl" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/admin/users/all"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All Users →
            </Link>
          </div>
        </div>

        {/* Regular Users Card */}
        <div
          onClick={() => navigate("/admin/users/regular")}
          className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Guests/Users</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {loading ? "..." : userStats.totalRegularUsers}
              </h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FiUsers className="text-green-600 text-xl" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/admin/users/regular"
              className="text-green-600 hover:text-green-800 text-sm font-medium"
            >
              View Guests/Users →
            </Link>
          </div>
        </div>

        {/* Owners Card */}
        <div
          onClick={() => navigate("/admin/users/owners")}
          className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Property Owners</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">
                {loading ? "..." : userStats.totalOwners}
              </h3>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <MdOutlineAddHome className="text-orange-600 text-xl" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/admin/users/owners"
              className="text-orange-600 hover:text-orange-800 text-sm font-medium"
            >
              View Property Owners →
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Users Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Users</h2>
          <div className="flex space-x-3">
            <Link
              to="/admin/users/regular"
              className="text-sm text-blue-600 hover:underline"
            >
              View Guests/Users
            </Link>
            <Link
              to="/admin/users/owners"
              className="text-sm text-blue-600 hover:underline"
            >
              View Property Owners
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <FiUsers className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Regular Users</h3>
                  <p className="text-sm text-gray-600">
                    Manage tenant accounts and bookings
                  </p>
                </div>
              </div>
              <Link
                to="/admin/users/regular"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Manage
              </Link>
            </div>

            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <MdOutlineAddHome className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Property Owners</h3>
                  <p className="text-sm text-gray-600">
                    Manage landlord accounts and properties
                  </p>
                </div>
              </div>
              <Link
                to="/admin/users/owners"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Manage
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
