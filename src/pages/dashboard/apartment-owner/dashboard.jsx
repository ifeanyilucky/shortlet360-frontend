import { FaKey, FaDoorOpen, FaHome, FaHouseUser } from "react-icons/fa";
import { BsCashStack, BsCalendarCheck } from "react-icons/bs";
import { AiOutlineStar } from "react-icons/ai";
import { BiTime, BiTrendingUp } from "react-icons/bi";
import { MdPendingActions, MdCancel } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { propertyService } from "../../../services/api";
import { fCurrency } from "../../../utils/formatNumber";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 22) return "Good evening";
  return "Good night";
};

export default function ApartmentOwnerDashboard() {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState(getGreeting());
  const [loading, setLoading] = useState(true);
  const [ownerStatistics, setOwnerStatistics] = useState(null);
  const [timeframe, setTimeframe] = useState("30");
  const { user } = useAuth();

  async function getOwnerStatistics() {
    try {
      setLoading(true);
      const res = await propertyService.getOwnerStatistics(timeframe);
      setOwnerStatistics(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getOwnerStatistics();
  }, [timeframe]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }
  console.log("ownerStatistics", ownerStatistics);
  return (
    <div className="p-4 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            {greeting},{" "}
            <span className="capitalize">{user?.first_name || "there"}!</span>
          </h1>
          <p className="text-gray-600">Here's an overview of your properties</p>
        </div>
        <div className="w-full md:w-auto">
          <select
            className="w-full md:w-auto px-4 py-2 border rounded-lg"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Total Properties</span>
            <FaHome className="text-blue-500 text-xl" />
          </div>
          <p className="text-2xl md:text-3xl font-bold">
            {ownerStatistics?.total_properties || 0}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {ownerStatistics?.active_properties || 0} Active
          </p>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Total Bookings</span>
            <BsCalendarCheck className="text-green-600 text-xl" />
          </div>
          <p className="text-2xl md:text-3xl font-bold">
            {ownerStatistics?.total_bookings || 0}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {ownerStatistics?.booking_status_breakdown?.confirmed || 0}{" "}
            Confirmed
          </p>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Total Revenue</span>
            <BsCashStack className="text-green-600 text-xl" />
          </div>
          <p className="text-2xl md:text-3xl font-bold">
            {fCurrency(ownerStatistics?.total_revenue || 0)}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Avg. {fCurrency(ownerStatistics?.average_booking_value || 0)}
            /booking
          </p>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Occupancy Rate</span>
            <FaHouseUser className="text-purple-500 text-xl" />
          </div>
          <p className="text-2xl md:text-3xl font-bold">
            {ownerStatistics?.occupancy_rate?.toFixed(1) || 0}%
          </p>
        </div>
      </div>

      {/* Booking Status Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Pending</span>
            <MdPendingActions className="text-yellow-500 text-xl" />
          </div>
          <p className="text-2xl md:text-3xl font-bold">
            {ownerStatistics?.booking_status_breakdown?.pending || 0}
          </p>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Confirmed</span>
            <BsCalendarCheck className="text-green-500 text-xl" />
          </div>
          <p className="text-2xl md:text-3xl font-bold">
            {ownerStatistics?.booking_status_breakdown?.confirmed || 0}
          </p>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Completed</span>
            <FaKey className="text-blue-500 text-xl" />
          </div>
          <p className="text-2xl md:text-3xl font-bold">
            {ownerStatistics?.booking_status_breakdown?.completed || 0}
          </p>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Cancelled</span>
            <MdCancel className="text-red-500 text-xl" />
          </div>
          <p className="text-2xl md:text-3xl font-bold">
            {ownerStatistics?.booking_status_breakdown?.cancelled || 0}
          </p>
        </div>
      </div>

      {/* Property Performance and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Property Performance */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">Property Performance</h2>
          <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
            <div className="p-4">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="text-left text-gray-600">
                    <th className="pb-4">Property</th>
                    <th className="pb-4">Bookings</th>
                    <th className="pb-4">Revenue</th>
                    <th className="pb-4">Rating</th>
                    <th className="pb-4">Occupancy</th>
                  </tr>
                </thead>
                <tbody>
                  {ownerStatistics?.property_performance?.map((property) => (
                    <tr key={property.property_id} className="border-t">
                      <td className="py-4 max-w-[200px] truncate">
                        {property?.property_name}
                      </td>
                      <td className="py-4">{property?.total_bookings}</td>
                      <td className="py-4">{fCurrency(property?.revenue)}</td>
                      <td className="py-4">
                        <div className="flex items-center">
                          <span>{property?.average_rating?.toFixed(1)}</span>
                          <AiOutlineStar className="text-yellow-400 ml-1" />
                        </div>
                      </td>
                      <td className="py-4">
                        {property?.occupancy_rate?.toFixed(1) || 0}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="bg-white rounded-lg shadow-sm p-4">
            {ownerStatistics?.recent_activity?.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No recent activity
              </p>
            ) : (
              <div className="space-y-4">
                {ownerStatistics?.recent_activity?.map((activity, index) => (
                  <div
                    key={index}
                    className="border-b last:border-b-0 pb-4 last:pb-0"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start space-y-2 sm:space-y-0">
                      <div>
                        <p className="font-semibold">
                          {activity?.property_id?.property_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(
                            activity?.check_in_date
                          ).toLocaleDateString()}{" "}
                          -{" "}
                          {new Date(
                            activity?.check_out_date
                          ).toLocaleDateString()}
                        </p>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${
                            activity?.booking_status === "confirmed"
                              ? "bg-green-100 text-green-600"
                              : activity?.booking_status === "pending"
                              ? "bg-yellow-100 text-yellow-600"
                              : activity?.booking_status === "cancelled"
                              ? "bg-red-100 text-red-600"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {activity?.booking_status?.charAt(0).toUpperCase() +
                            activity?.booking_status?.slice(1)}
                        </span>
                      </div>
                      <p className="font-semibold">
                        {fCurrency(activity?.total_price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
