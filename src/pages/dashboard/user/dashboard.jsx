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
import KycProgressIndicator from "../../../components/KycProgressIndicator";
import { useAuth } from "../../../hooks/useAuth";
import toast from "react-hot-toast";
export default function UserDashboard() {
  const { statistics, isLoading, getUserStatistics } = userStore();
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState("30");
  const navigate = useNavigate();

  useEffect(() => {
    getUserStatistics(timeframe);
  }, [timeframe, getUserStatistics]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("User ID copied to clipboard!");
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

      {/* KYC Progress Indicator */}
      <KycProgressIndicator />
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Bookings"
          value={statistics?.total_bookings || 0}
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
          title="Average Booking"
          value={fCurrency(statistics?.average_booking_value || 0)}
          icon={<HiOutlineCalendar className="w-6 h-6" />}
          color="purple"
        />
        <StatCard
          title="Favorite Cities"
          value={statistics?.favorite_cities?.[0]?.city || "N/A"}
          icon={<HiOutlineLocationMarker className="w-6 h-6" />}
          color="orange"
        />
      </div>

      {/* Booking Status Breakdown */}
      <div className="bg-white rounded-xl shadow p-4 md:p-6">
        <h2 className="text-lg font-semibold mb-4">Booking Status Breakdown</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {Object.entries(statistics?.booking_status_breakdown || {}).map(
            ([status, count]) => (
              <div
                key={status}
                className="p-3 md:p-4 rounded-lg bg-gray-50 text-center"
              >
                <p className="text-xl md:text-2xl font-bold text-gray-800">
                  {count}
                </p>
                <p className="text-xs md:text-sm text-gray-600 capitalize">
                  {status}
                </p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Recent and Upcoming Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Bookings</h2>
          <div className="space-y-4">
            {statistics?.recent_bookings?.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No recent bookings
              </p>
            ) : (
              statistics?.recent_bookings
                ?.slice(0, 3)
                .map((booking) => (
                  <BookingCard key={booking._id} booking={booking} />
                ))
            )}
            <div className="flex justify-end">
              <button
                className="text-blue-500 hover:underline"
                onClick={() => navigate("/user/bookings")}
              >
                View all <span className="text-blue-500">→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div className="bg-white rounded-xl shadow p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-4">Upcoming Bookings</h2>
          <div className="space-y-4">
            {statistics?.upcoming_bookings?.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No upcoming bookings
              </p>
            ) : (
              statistics?.upcoming_bookings?.map((booking) => (
                <BookingCard key={booking._id} booking={booking} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Favorite Cities */}
      <div className="bg-white rounded-xl shadow p-4 md:p-6">
        <h2 className="text-lg font-semibold mb-4">Favorite Cities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {statistics?.favorite_cities?.length === 0 ? (
            <p className="text-gray-500 text-center py-4 col-span-full">
              No favorite cities yet
            </p>
          ) : (
            statistics?.favorite_cities?.map(({ city, count }) => (
              <div
                key={city}
                className="p-3 md:p-4 rounded-lg bg-gray-50 text-center"
              >
                <p className="text-base md:text-lg font-semibold text-gray-800 truncate">
                  {city}
                </p>
                <p className="text-xs md:text-sm text-gray-600">
                  {count} booking{count !== 1 ? "s" : ""}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
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

function BookingCard({ booking }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg bg-gray-50">
      <div className="w-full sm:w-20 h-32 sm:h-20 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={
            booking.property_id?.property_images[0]?.url ||
            "/images/living-room.jpg"
          }
          alt={booking.property_id?.property_name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-grow w-full sm:w-auto">
        <h3 className="font-semibold text-gray-800 truncate">
          {booking.property_id?.property_name}
        </h3>
        <p className="text-sm text-gray-600">
          {format(new Date(booking.check_in_date), "MMM d, yyyy")} -{" "}
          {format(new Date(booking.check_out_date), "MMM d, yyyy")}
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2 gap-2">
          <span
            className={`px-2 py-1 rounded-full text-xs w-fit ${
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
          <span className="font-semibold text-gray-800">
            {fCurrency(booking.total_price)}
          </span>
        </div>
      </div>
    </div>
  );
}
