import DataTable from "../../../components/DataTable";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { bookingStore } from "@store/bookingStore";
import { FaEye, FaFilter } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import LoadingOverlay from "../../../components/LoadingOverlay";
import { useAuth } from "../../../hooks/useAuth";
import Pagination from "../../../components/Pagination";
import { format } from "date-fns";
import { fCurrency } from "@utils/formatNumber";
import RightSidebarModal from "../../../components/RightSidebarModal";
import BookingDetails from "../../../components/BookingDetails";

export default function UserBookingHistory() {
  const { bookings, booking, pagination, getBookings, getBooking, isLoading } =
    bookingStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    property_name: "",
    guest_name: "",
    booking_status: "",
    payment_status: "",
  });
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    getBookings({
      search: searchTerm,
      page: 1,
      ...filters,
    });
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    getBookings({
      search: searchTerm,
      page,
      guest: user?._id,
      ...filters,
    });
  };

  const handleViewBooking = async (id) => {
    await getBooking(id);
    setIsViewModalOpen(true);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplyFilters = () => {
    getBookings({
      search: searchTerm,
      page: 1,
      guest: user?._id,
      ...filters,
    });
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      property_name: "",
      guest_name: "",
      booking_status: "",
      payment_status: "",
    });
    getBookings({
      search: searchTerm,
      page: 1,
      guest: user?._id,
    });
  };

  useEffect(() => {
    getBookings({ page: currentPage, guest: user?._id });
  }, []);

  const columns = [
    {
      header: "Property",
      key: "property",
      render: (_, row) => (
        <div>
          <p className="font-medium">{row.property_id.property_name}</p>
          <p className="text-sm text-gray-600">
            {row.property_id.location.city}, {row.property_id.location.state}
          </p>
        </div>
      ),
    },
    {
      header: "Guest",
      key: "guest",
      render: (_, row) => (
        <div>
          <p className="font-medium">{row.payment.customer.name}</p>
          <p className="text-sm text-gray-600">{row.payment.customer.email}</p>
          <p className="text-sm text-gray-600">
            {row.payment.customer.phone_number}
          </p>
        </div>
      ),
    },
    {
      header: "Check In/Out",
      key: "dates",
      render: (_, row) => (
        <div>
          <div className="mb-1">
            <span className="text-sm font-medium">Check In: </span>
            <span className="text-sm">
              {format(new Date(row.check_in_date), "MMM dd, yyyy")}
            </span>
          </div>
          <div>
            <span className="text-sm font-medium">Check Out: </span>
            <span className="text-sm">
              {format(new Date(row.check_out_date), "MMM dd, yyyy")}
            </span>
          </div>
          <div className="mt-1 text-sm text-gray-600">
            Arrival: {row.estimated_arrival}
          </div>
        </div>
      ),
    },
    {
      header: "Amount",
      key: "amount",
      render: (_, row) => (
        <div>
          <p className="font-medium">{fCurrency(row.total_price)}</p>
          <p className="text-sm text-gray-600">
            {row.guest_count} {row.guest_count === 1 ? "guest" : "guests"}
          </p>
        </div>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (_, row) => (
        <div className="space-y-1">
          <span
            className={`px-2 py-1 rounded-full text-sm ${
              row.booking_status === "confirmed"
                ? "bg-green-100 text-green-800"
                : row.booking_status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : row.booking_status === "cancelled"
                ? "bg-red-100 text-red-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {row.booking_status.charAt(0).toUpperCase() +
              row.booking_status.slice(1)}
          </span>
          <div>
            <span
              className={`px-2 py-1 rounded-full text-sm ${
                row.payment_status === "paid"
                  ? "bg-green-100 text-green-800"
                  : row.payment_status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {row.payment_status.charAt(0).toUpperCase() +
                row.payment_status.slice(1)}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Actions",
      key: "actions",
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleViewBooking(row._id)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
            title="View Details"
          >
            View
          </button>
        </div>
      ),
    },
  ];
  return (
    <div className="p-6">
      {isLoading && <LoadingOverlay />}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Booking History
        </h2>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
          >
            <FaFilter className="text-gray-500" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>

          {/* <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </form> */}
        </div>

        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Name
                </label>
                <input
                  type="text"
                  name="property_name"
                  value={filters.property_name}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Filter by property name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guest Name
                </label>
                <input
                  type="text"
                  name="guest_name"
                  value={filters.guest_name}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Filter by guest name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Booking Status
                </label>
                <select
                  name="booking_status"
                  value={filters.booking_status}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Status
                </label>
                <select
                  name="payment_status"
                  value={filters.payment_status}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Reset
              </button>
              <button
                onClick={handleApplyFilters}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <DataTable columns={columns} data={bookings || []} />
      </div>

      {pagination && (
        <div className="mt-6">
          <Pagination
            currentPage={pagination.current_page}
            totalPages={pagination.total_pages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <RightSidebarModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Booking Details"
      >
        <BookingDetails booking={booking} />
      </RightSidebarModal>
    </div>
  );
}
