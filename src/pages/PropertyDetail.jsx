import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { propertyStore } from "../store/propertyStore";
import LoadingOverlay from "../components/LoadingOverlay";
import { IoLocationOutline } from "react-icons/io5";
import { BiBed, BiBath } from "react-icons/bi";
import { HiOutlineUsers } from "react-icons/hi2";
import { BsBookmark, BsShare, BsX } from "react-icons/bs";
import { fCurrency } from "@utils/formatNumber";
import { useAuth } from "../hooks/useAuth";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { usePaystackPayment } from "react-paystack";
import { bookingService } from "../services/api";
import toast from "react-hot-toast";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";

// Custom CSS for the calendar
const calendarStyles = `
  .react-datepicker {
    font-family: inherit;
    border: none;
    border-radius: 1rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  }
  .react-datepicker__header {
    background-color: white;
    border-bottom: 1px solid #f3f4f6;
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
    padding-top: 1rem;
  }
  .react-datepicker__month {
    margin: 0.4rem;
    padding: 0.4rem;
  }
  .react-datepicker__day-name {
    color: #6b7280;
    font-weight: 500;
    width: 2.5rem;
    margin: 0.2rem;
  }
  .react-datepicker__day {
    width: 2rem;
    height: 2rem;
    line-height: 2rem;
    margin: 0.2rem;
    border-radius: 9999px;
  }
  .react-datepicker__day:hover {
    background-color: #f3f4f6;
  }
  .react-datepicker__day--selected,
  .react-datepicker__day--in-range {
    background-color: #2563eb !important;
    color: white !important;
  }
  .react-datepicker__day--in-selecting-range {
    background-color: #93c5fd !important;
    color: white !important;
  }
  .react-datepicker__day--disabled {
    color: #d1d5db;
    text-decoration: line-through;
  }
  .react-datepicker__current-month {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
  }
  .react-datepicker__navigation {
    top: 1rem;
  }
  .react-datepicker__navigation-icon::before {
    border-color: #6b7280;
  }
  .react-datepicker__day--outside-month {
    color: #9ca3af;
  }
`;

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProperty, property, isLoading } = propertyStore();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [estimatedArrival, setEstimatedArrival] = useState("14:00"); // Default to 2 PM
  const [availabilityData, setAvailabilityData] = useState(null);
  const [guestCount, setGuestCount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [numberOfDays, setNumberOfDays] = useState(0);
  const { user } = useAuth();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullScreenIndex, setFullScreenIndex] = useState(0);

  useEffect(() => {
    // Inject custom styles
    const styleSheet = document.createElement("style");
    styleSheet.textContent = calendarStyles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propertyResponse, availabilityResponse] = await Promise.all([
          getProperty(id),
          bookingService.getPropertyAvailability(id),
        ]);
        setAvailabilityData(availabilityResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching property availability");
      }
    };

    fetchData();
  }, [id]);

  const config = {
    public_key: "FLWPUBK_TEST-5799b619bfc474dd1f53bd4317b37851-X",
    tx_ref: Date.now(),
    amount: 100,
    currency: "NGN",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: user?.email,
      phone_number: user?.phone,
      name: user?.first_name + " " + user?.last_name,
    },
    customizations: {
      title: "my Payment Title",
      description: "Payment for items in cart",
      logo: "/logo.png",
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  if (isLoading) return <LoadingOverlay />;

  const handleEdit = () => {
    navigate(`/dashboard/apartment-owner/edit-property/${id}`);
  };

  const handleBookNow = () => {
    handleFlutterPayment({
      callback: (response) => {
        console.log(response);
        handlePaymentSuccess(response);
        closePaymentModal();
      },
      onClose: () => {
        console.log("closed");
      },
    });
  };

  // Function to check if a date is unavailable
  const isDateUnavailable = (date) => {
    if (!availabilityData) return false;

    const currentDate = new Date(date);

    // If there are no available_dates specified, consider all dates as available
    // unless they are in unavailable_dates
    const isAvailable =
      availabilityData.available_dates.length === 0
        ? true
        : availabilityData.available_dates.some(
            ({ start_date, end_date }) =>
              currentDate >= new Date(start_date) &&
              currentDate <= new Date(end_date)
          );

    // Check if the date is within any unavailable date ranges (bookings)
    const isUnavailable = availabilityData.unavailable_dates.some(
      ({ start_date, end_date }) =>
        currentDate >= new Date(start_date) && currentDate <= new Date(end_date)
    );

    // Date is unavailable if it's either not in available dates or is in unavailable dates
    return !isAvailable || isUnavailable;
  };

  const handlePaymentSuccess = async (reference) => {
    try {
      const bookingData = {
        check_in_date: startDate,
        check_out_date: endDate,
        estimated_arrival: estimatedArrival,
        property_id: id,
        guest_count: 1,
        payment: reference,
      };
      const response = await bookingService.createBooking(bookingData);
      // console.log("booking response", response);
      toast.success("Booking created successfully");
      navigate(`/${id}/receipt/${response?.data?._id}`);
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while creating the booking");
    }
  };

  // Calculate total price based on selected dates
  const calculateTotalPrice = (start, end) => {
    if (!start || !end || !property?.pricing) return 0;

    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    setNumberOfDays(days);

    let total = 0;
    const { per_day, per_week, per_month } = property.pricing;

    // Calculate based on available pricing options
    if (days >= 30 && per_month.is_active) {
      const months = Math.floor(days / 30);
      const remainingDays = days % 30;
      total =
        months * per_month.base_price +
        remainingDays * (per_day.is_active ? per_day.base_price : 0) +
        per_month.cleaning_fee +
        per_month.security_deposit;
    } else if (days >= 7 && per_week.is_active) {
      const weeks = Math.floor(days / 7);
      const remainingDays = days % 7;
      total =
        weeks * per_week.base_price +
        remainingDays * (per_day.is_active ? per_day.base_price : 0) +
        per_week.cleaning_fee +
        per_week.security_deposit;
    } else if (per_day.is_active) {
      total =
        days * per_day.base_price +
        per_day.cleaning_fee +
        per_day.security_deposit;
    }

    setTotalPrice(total);
    return total;
  };

  // Handle date changes
  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      calculateTotalPrice(start, end);
    }
  };

  // Custom header for the calendar
  const renderCustomHeader = ({
    date,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }) => (
    <div className="flex items-center justify-between px-4 py-2">
      <button
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        type="button"
        className="p-1 hover:bg-gray-100 rounded-full disabled:opacity-50"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <div className="text-lg font-semibold text-gray-900">
        {date.toLocaleString("default", { month: "long" })} {date.getFullYear()}
      </div>
      <button
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        type="button"
        className="p-1 hover:bg-gray-100 rounded-full disabled:opacity-50"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );

  const openFullScreen = (index) => {
    setFullScreenIndex(index);
    setIsFullScreen(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";
  };

  const closeFullScreen = () => {
    setIsFullScreen(false);
    // Restore body scroll when modal is closed
    document.body.style.overflow = "unset";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Property Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-3">
              {property?.property_name}
            </h1>
            <div className="flex items-center text-gray-600">
              <IoLocationOutline className="w-5 h-5 mr-2" />
              <span>{`${property?.location.street_address}, ${property?.location.city}, ${property?.location.state}`}</span>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 rounded-full border hover:bg-gray-50">
              <BsShare className="w-4 h-4" />
              <span>Share</span>
            </button>
            {/* <button className="flex items-center gap-2 px-4 py-2 rounded-full border hover:bg-gray-50">
                            <BsBookmark className="w-4 h-4" />
                            <span>Save</span>
                        </button> */}
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-8">
          {/* Desktop View */}
          <div className="hidden md:grid grid-cols-4 gap-4">
            {/* First large image */}
            <div className="col-span-2 row-span-2 h-[400px] overflow-hidden rounded-3xl">
              <img
                src={
                  property?.property_images[0]?.url || "/images/living-room.jpg"
                }
                alt="Main"
                className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => openFullScreen(0)}
              />
            </div>
            {/* Grid of smaller images */}
            {property?.property_images.slice(1, 5).map((image, index) => (
              <div
                key={image._id}
                className="relative overflow-hidden rounded-3xl h-[195px]"
              >
                <img
                  src={image.url}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform duration-300"
                  onClick={() => openFullScreen(index + 1)}
                />
                {index === 3 && property?.property_images.length > 5 && (
                  <div
                    className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/60 transition-colors"
                    onClick={() => openFullScreen(5)}
                  >
                    <span className="text-white text-2xl font-semibold">
                      +{property.property_images.length - 5}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile View */}
          <div className="md:hidden">
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={0}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              className="h-[300px] rounded-3xl"
              onClick={() => openFullScreen(0)}
            >
              {property?.property_images.map((image, index) => (
                <SwiperSlide key={image._id}>
                  <img
                    src={image.url}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => openFullScreen(index)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* Full Screen Modal */}
        {isFullScreen && (
          <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
            <button
              onClick={closeFullScreen}
              className="absolute top-4 right-4 text-white z-50 p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <BsX className="w-8 h-8" />
            </button>
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={0}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              className="w-full h-full"
              initialSlide={fullScreenIndex}
            >
              {property?.property_images.map((image, index) => (
                <SwiperSlide
                  key={image._id}
                  className="flex items-center justify-center"
                >
                  <img
                    src={image.url}
                    alt={`Gallery ${index + 1}`}
                    className="max-h-[90vh] max-w-[90vw] object-contain"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        {/* Property Details */}
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-2/3">
            {/* Basic Info */}
            <div className="bg-white rounded-3xl p-8 mb-8">
              <div className="flex items-center gap-8 mb-6">
                <div className="flex items-center gap-2">
                  <BiBed className="w-6 h-6" />
                  <div>
                    <p className="font-semibold">{property?.bedroom_count}</p>
                    <p className="text-sm text-gray-500">Bedrooms</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BiBath className="w-6 h-6" />
                  <div>
                    <p className="font-semibold">{property?.bathroom_count}</p>
                    <p className="text-sm text-gray-500">Bathrooms</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <HiOutlineUsers className="w-6 h-6" />
                  <div>
                    <p className="font-semibold">{property?.max_guests}</p>
                    <p className="text-sm text-gray-500">Max Guests</p>
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-semibold mb-4">
                About this {property?.property_type}
              </h2>
              <p className="text-gray-600 mb-6">
                {property?.property_description}
              </p>

              {/* Amenities */}
              <h2 className="text-xl font-semibold mb-4">
                What this place offers
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {property?.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-gray-600"
                  >
                    <span>•</span>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>

              {/* House Rules Section */}
              <div className="mt-8 border-t pt-6">
                <h2 className="text-xl font-semibold mb-4">House Rules</h2>
                <div className="space-y-3">
                  {property?.house_rules.map((rule, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="text-primary-500">•</span>
                      <p className="text-gray-600">{rule}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="w-full md:w-1/3 sticky top-8">
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-2xl font-bold mb-1">
                    {fCurrency(property?.pricing.per_day.base_price)}
                  </p>
                  <p className="text-gray-600">per night</p>
                </div>
                <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                  <span className="text-sm font-semibold">4.5</span>
                  <span className="text-xs text-gray-500">★</span>
                </div>
              </div>

              <div className="border rounded-xl p-4 mb-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Select dates
                  </label>
                  <DatePicker
                    selected={startDate}
                    onChange={handleDateChange}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                    inline
                    minDate={new Date()}
                    filterDate={(date) => !isDateUnavailable(date)}
                    renderCustomHeader={renderCustomHeader}
                    showPopperArrow={false}
                    monthsShown={1}
                    fixedHeight
                    className="w-full"
                    calendarClassName="!border-0 !shadow-lg !rounded-xl"
                    dayClassName={(date) =>
                      date.getDate() === new Date().getDate() &&
                      date.getMonth() === new Date().getMonth()
                        ? "!text-blue-600 font-semibold"
                        : undefined
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Guests
                  </label>
                  <select className="w-full border rounded-lg p-2">
                    {[...Array(property?.max_guests)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} guest{i !== 0 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">
                    Estimated Time of Arrival
                  </label>
                  <input
                    type="time"
                    value={estimatedArrival}
                    onChange={(e) => setEstimatedArrival(e.target.value)}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
              </div>

              {/* Pricing Breakdown */}
              {startDate && endDate && (
                <div className="space-y-2 text-sm border-t pt-4 mt-4">
                  <div className="flex justify-between">
                    <span>
                      Base price ({numberOfDays}{" "}
                      {numberOfDays === 1 ? "night" : "nights"})
                    </span>
                    <span>
                      {fCurrency(
                        property?.pricing.per_day.base_price * numberOfDays
                      )}
                    </span>
                  </div>
                  {property?.pricing.per_day.cleaning_fee > 0 && (
                    <div className="flex justify-between">
                      <span>Cleaning fee</span>
                      <span>
                        {fCurrency(property?.pricing.per_day.cleaning_fee)}
                      </span>
                    </div>
                  )}
                  {property?.pricing.per_day.security_deposit > 0 && (
                    <div className="flex justify-between">
                      <span>Security deposit</span>
                      <span>
                        {fCurrency(property?.pricing.per_day.security_deposit)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t font-semibold">
                    <span>Total</span>
                    <span>{fCurrency(totalPrice)}</span>
                  </div>
                </div>
              )}

              {user?._id === property?.owner._id ? (
                <button
                  onClick={handleEdit}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 mt-6"
                >
                  Edit
                </button>
              ) : (
                <button
                  onClick={handleBookNow}
                  disabled={!startDate || !endDate}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed mt-6"
                >
                  Book Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
