import { format } from "date-fns";
import { fCurrency } from "@utils/formatNumber";

export default function BookingDetails({ booking }) {
  if (!booking) return null;
  console.log("booking", booking);
  return (
    <div className="space-y-8">
      {/* Property Details */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Property Details</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-lg mb-2">
            {booking.property_id.property_name}
          </h4>
          <p className="text-gray-600 mb-4">
            {booking.property_id.property_description}
          </p>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Location:</span>{" "}
              {`${booking.property_id.location.street_address}, ${booking.property_id.location.city}, ${booking.property_id.location.state}`}
            </p>
            <p className="text-sm">
              <span className="font-medium">Property Type:</span>{" "}
              {booking.property_id.property_type}
            </p>
            <p className="text-sm">
              <span className="font-medium">Bedrooms:</span>{" "}
              {booking.property_id.bedroom_count}
            </p>
            <p className="text-sm">
              <span className="font-medium">Bathrooms:</span>{" "}
              {booking.property_id.bathroom_count}
            </p>
          </div>
        </div>
      </div>

      {/* Guest Details */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Guest Details</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm mb-2">
            <span className="font-medium">Name:</span>{" "}
            {booking.payment.customer.name}
          </p>
          <p className="text-sm mb-2">
            <span className="font-medium">Email:</span>{" "}
            {booking.payment.customer.email}
          </p>
          <p className="text-sm">
            <span className="font-medium">Phone:</span>{" "}
            {booking.payment.customer.phone_number}
          </p>
        </div>
      </div>

      {/* Booking Details */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Booking Details</h3>
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <p className="text-sm">
            <span className="font-medium">Check In:</span>{" "}
            {format(new Date(booking.check_in_date), "MMM dd, yyyy")}
          </p>
          <p className="text-sm">
            <span className="font-medium">Check Out:</span>{" "}
            {format(new Date(booking.check_out_date), "MMM dd, yyyy")}
          </p>
          <p className="text-sm">
            <span className="font-medium">Arrival Time:</span>{" "}
            {booking.estimated_arrival}
          </p>
          <p className="text-sm">
            <span className="font-medium">Guests:</span> {booking.guest_count}
          </p>
          <div className="pt-2 mt-2 border-t">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Booking Status</span>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  booking.booking_status === "confirmed"
                    ? "bg-green-100 text-green-800"
                    : booking.booking_status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : booking.booking_status === "cancelled"
                    ? "bg-red-100 text-red-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {booking.booking_status.charAt(0).toUpperCase() +
                  booking.booking_status.slice(1)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Payment Status</span>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  booking.payment_status === "paid"
                    ? "bg-green-100 text-green-800"
                    : booking.payment_status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {booking.payment_status.charAt(0).toUpperCase() +
                  booking.payment_status.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Total Amount</span>
              <span className="font-medium">
                {fCurrency(booking.total_price)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Transaction ID</span>
              <span className="text-sm font-medium">
                {booking.payment.transaction_id}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Payment Method</span>
              <span className="text-sm font-medium">
                {booking.payment.currency}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Payment Date</span>
              <span className="text-sm font-medium">
                {format(
                  new Date(booking.payment.created_at),
                  "MMM dd, yyyy HH:mm"
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
