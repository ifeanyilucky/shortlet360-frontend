import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { bookingService } from "../services/api";
import LoadingOverlay from "./LoadingOverlay";
import { format } from "date-fns";

export default function Receipt() {
  const { property_id, booking_id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  const getBooking = async () => {
    setLoading(true);
    try {
      const bookingResponse = await bookingService.getBooking(booking_id);
      setBooking(bookingResponse.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBooking(booking_id);
  }, [booking_id]);

  if (loading || !booking) {
    return <LoadingOverlay />;
  }

  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd MMM yyyy");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-primary-500">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
            <div className="flex items-center space-x-2">
              <img
                src="/logo.png"
                alt="shortlet-360-logo"
                className="w-16 sm:w-20 h-auto"
              />
            </div>
            <div className="text-center sm:text-right">
              <h2 className="text-lg sm:text-xl font-semibold">
                {booking.property_id.property_name}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                Booking No. {booking._id}
              </p>
              <p className="text-xs sm:text-sm text-green-500">
                Status:{" "}
                {booking.booking_status.charAt(0).toUpperCase() +
                  booking.booking_status.slice(1)}
              </p>
            </div>
          </div>
        </div>

        {/* Guest Information */}
        <div className="p-4 sm:p-6">
          <div className="mb-4 sm:mb-6">
            <h3 className="text-sm sm:text-base font-medium mb-2">
              Dear {booking.payment.customer.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Thank you for booking with us, we're looking forward to welcoming
              you as our guest.
            </p>
          </div>

          {/* Booking Details Table */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="text-left">
                  <th className="py-1 sm:py-2">GUEST NAME</th>
                  <th className="py-1 sm:py-2">GUESTS</th>
                  <th className="py-1 sm:py-2">CONTACT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2">{booking.payment.customer.name}</td>
                  <td className="py-2">{booking.guest_count}</td>
                  <td className="py-2">
                    {booking.payment.customer.phone_number}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="mt-4">
              <p className="text-sm sm:text-base font-medium">
                {booking.property_id.property_type.charAt(0).toUpperCase() +
                  booking.property_id.property_type.slice(1)}{" "}
                - {booking.property_id.bedroom_count} Bedroom
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                Cancellation Policy: Please refer to terms and conditions
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Check-in:</p>
                <p className="text-sm sm:text-base font-medium">
                  {formatDate(booking.check_in_date)}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Check-out:</p>
                <p className="text-sm sm:text-base font-medium">
                  {formatDate(booking.check_out_date)}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs sm:text-sm text-gray-600">
                Estimated Time of Arrival: {booking.estimated_arrival}
              </p>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm sm:text-base font-medium">Total</span>
              <span className="font-medium text-primary-500 text-base sm:text-lg">
                {formatCurrency(booking.total_price)}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs sm:text-sm text-gray-600 mb-2">
              <span>Payment Status</span>
              <span className="capitalize">{booking.payment_status}</span>
            </div>
            <div className="flex justify-between items-center text-xs sm:text-sm font-medium">
              <span>Transaction Reference</span>
              <span>{booking.payment.tx_ref}</span>
            </div>
          </div>

          {/* House Rules */}
          <div className="mt-4 sm:mt-6 border-t pt-4">
            <h4 className="text-sm sm:text-base font-medium mb-2">
              House Rules
            </h4>
            <div className="text-xs sm:text-sm text-gray-600 mb-4">
              {booking.property_id.house_rules.map((rule, index) => (
                <p key={index} className="mb-1">
                  {rule}
                </p>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-4 sm:mt-6 bg-gray-50 rounded-lg p-3 sm:p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <h4 className="text-sm sm:text-base text-primary-500 font-medium mb-2 sm:mb-3">
                  Guest Information
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                  Name: {booking.payment.customer.name}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                  Email: {booking.payment.customer.email}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  Phone: {booking.payment.customer.phone_number}
                </p>
              </div>
              <div>
                <h4 className="text-sm sm:text-base text-primary-500 font-medium mb-2 sm:mb-3">
                  Aplet360 Support
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                  Email: support@aplet360.com
                </p>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                  Phone: +234 (901) 111-1111
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  Hours: 24/7 Customer Support
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 sm:mt-8 text-center border-t pt-4 sm:pt-6">
            <p className="text-xs sm:text-sm text-gray-600 mb-1">
              Aplet360 - Your Trusted Short-let Accommodation Platform
            </p>
            <p className="text-xs sm:text-sm text-gray-600 mb-1">
              Lagos, Nigeria
            </p>
            <p className="text-xs sm:text-sm text-gray-600 mb-1">
              Website: www.aplet360.com
            </p>
            <p className="text-xs sm:text-sm text-gray-600">
              © {new Date().getFullYear()} Aplet360. All rights reserved.
            </p>
          </div>

          {/* Print Button */}
          <div className="mt-4 sm:mt-6 text-center">
            <button
              onClick={() => window.print()}
              className="bg-primary-500 text-white px-4 sm:px-6 py-2 text-sm sm:text-base rounded-lg hover:bg-primary-600 transition-colors"
            >
              PRINT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
