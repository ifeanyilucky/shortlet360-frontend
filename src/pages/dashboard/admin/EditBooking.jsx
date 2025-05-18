import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminService from "../../../services/adminService";
import toast from "react-hot-toast";
import InteractiveButton from "../../../components/InteractiveButton";
import { format } from "date-fns";
import { fCurrency } from "../../../utils/formatNumber";

export default function EditBooking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [booking, setBooking] = useState(null);
  const [formData, setFormData] = useState({
    booking_status: "",
    payment_status: "",
  });

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const res = await adminService.getBookingById(id);
        setBooking(res.data.booking);

        // Initialize form data with booking details
        const bookingData = res.data.booking;
        setFormData({
          booking_status: bookingData.booking_status || "pending",
          payment_status: bookingData.payment_status || "pending",
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch booking details");
        navigate("/admin/bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      await adminService.updateBookingStatus(id, formData.booking_status);
      toast.success("Booking updated successfully");
      navigate("/admin/bookings");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update booking");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Edit Booking</h1>
        <button
          onClick={() => navigate("/admin/bookings")}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          Back to Bookings
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Booking Details
          </h2>

          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-500">Booking ID:</span>
              <p className="font-medium">{booking._id}</p>
            </div>

            <div>
              <span className="text-sm text-gray-500">Property:</span>
              <p className="font-medium">
                {booking.property_id?.property_name || "N/A"}
              </p>
            </div>

            <div>
              <span className="text-sm text-gray-500">Guest:</span>
              <p className="font-medium">
                {booking.guest?.first_name} {booking.guest?.last_name} (
                {booking.guest?.short_id || "N/A"})
              </p>
            </div>

            <div>
              <span className="text-sm text-gray-500">Check-in Date:</span>
              <p className="font-medium">
                {format(new Date(booking.check_in_date), "MMM dd, yyyy")}
              </p>
            </div>

            <div>
              <span className="text-sm text-gray-500">Check-out Date:</span>
              <p className="font-medium">
                {format(new Date(booking.check_out_date), "MMM dd, yyyy")}
              </p>
            </div>

            <div>
              <span className="text-sm text-gray-500">Total Amount:</span>
              <p className="font-medium">{fCurrency(booking.total_price)}</p>
            </div>

            <div>
              <span className="text-sm text-gray-500">Created At:</span>
              <p className="font-medium">
                {format(new Date(booking.createdAt), "MMM dd, yyyy HH:mm")}
              </p>
            </div>
          </div>
        </div>

        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
                Update Status
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Booking Status
                </label>
                <select
                  name="booking_status"
                  value={formData.booking_status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Status
                </label>
                <select
                  name="payment_status"
                  value={formData.payment_status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="refunded">Refunded</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Payment status can only be updated through the payment system.
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <InteractiveButton
                type="submit"
                isLoading={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Save Changes
              </InteractiveButton>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Actions</h2>
        <div className="flex space-x-4">
          <button
            onClick={() =>
              window.open(
                `/${booking.property_id?.short_id}/receipt/${booking._id}`,
                "_blank"
              )
            }
            className="px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
          >
            View Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
