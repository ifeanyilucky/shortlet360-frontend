import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { propertyStore } from "../store/propertyStore";
import LoadingOverlay from "../components/LoadingOverlay";
import { IoLocationOutline } from "react-icons/io5";
import { BiBed, BiBath } from "react-icons/bi";
import { HiOutlineUsers } from "react-icons/hi2";
import {
  BsShare,
  BsX,
  BsTwitterX,
  BsWhatsapp,
  BsFacebook,
  BsLinkedin,
  BsInfoCircle,
  BsChevronLeft,
  BsChevronRight,
} from "react-icons/bs";
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
import { paystackConfig } from "../config/paystack";
import KycVerificationStatus from "../components/KycVerificationStatus";
import useKycStore from "../store/kycStore";

// Custom CSS for the calendar and gallery
const customStyles = `
  /* Calendar Styles */
  .react-datepicker {
    font-family: inherit;
    border: none;
    border-radius: 1rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    width: 100%;
    max-width: 100%;
  }
  .react-datepicker__month-container {
    float: none;
    width: 100%;
  }
  .react-datepicker__header {
    background-color: white;
    border-bottom: 1px solid #f3f4f6;
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
    padding-top: 1rem;
    width: 100%;
  }
  .react-datepicker__month {
    margin: 0.2rem 0;
    padding: 0.2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .react-datepicker__week {
    display: flex;
    justify-content: space-around;
    width: 100%;
  }
  .react-datepicker__day-names {
    display: flex;
    justify-content: space-around;
    width: 100%;
  }
  .react-datepicker__day-name {
    color: #6b7280;
    font-weight: 500;
    width: calc(100% / 7);
    margin: 0;
    text-align: center;
    font-size: 0.8rem;
  }
  .react-datepicker__day {
    width: calc(100% / 7);
    height: 2rem;
    line-height: 2rem;
    margin: 0;
    border-radius: 9999px;
    font-size: 0.85rem;
  }
  @media (min-width: 400px) {
    .react-datepicker__day {
      font-size: 0.9rem;
    }
    .react-datepicker__day-name {
      font-size: 0.9rem;
    }
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
    font-size: 0.9rem;
    font-weight: 600;
    color: #111827;
    text-align: center;
    width: 100%;
  }
  @media (min-width: 400px) {
    .react-datepicker__current-month {
      font-size: 1rem;
    }
  }
  .react-datepicker__navigation {
    top: 0.8rem;
  }
  .react-datepicker__navigation-icon::before {
    border-color: #6b7280;
    border-width: 2px 2px 0 0;
    height: 8px;
    width: 8px;
  }
  .react-datepicker__day--outside-month {
    color: #9ca3af;
  }

  /* Gallery Swiper Styles */
  .gallery-swiper .swiper-pagination {
    bottom: 20px !important;
  }

  .gallery-swiper .swiper-pagination-bullet {
    width: 10px;
    height: 10px;
    background: rgba(255, 255, 255, 0.5);
    opacity: 1;
  }

  .gallery-swiper .swiper-pagination-bullet-active {
    background: white;
  }

  /* Hide default navigation arrows since we're using custom ones */
  .gallery-swiper .swiper-button-next,
  .gallery-swiper .swiper-button-prev {
    display: none;
  }

  /* Responsive adjustments for smaller screens */
  @media (max-width: 640px) {
    .swiper-button-prev, .swiper-button-next {
      padding: 8px !important;
    }

    .swiper-button-prev svg, .swiper-button-next svg {
      width: 16px !important;
      height: 16px !important;
    }
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
  const [guestCount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [numberOfDays, setNumberOfDays] = useState(0);
  const { user } = useAuth();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullScreenIndex, setFullScreenIndex] = useState(0);
  const [selectedPricingOption, setSelectedPricingOption] = useState("day"); // Default to day pricing
  const [paymentPeriod, setPaymentPeriod] = useState("yearly");
  const [monthlyPaymentOption, setMonthlyPaymentOption] = useState("6months");
  const [kycVerified, setKycVerified] = useState(false);
  const { getKycStatus } = useKycStore();

  useEffect(() => {
    // Inject custom styles
    const styleSheet = document.createElement("style");
    styleSheet.textContent = customStyles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // eslint-disable-next-line no-unused-vars
        const [propertyData, availabilityResponse] = await Promise.all([
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
  }, [id, getProperty]);

  // Configure Paystack payment
  const config = paystackConfig({
    email: user?.email || "",
    amount: 100, // This will be updated dynamically
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    _id: user?._id || "",
  });

  const initializePayment = usePaystackPayment(config);

  if (isLoading) return <LoadingOverlay />;

  const handleEdit = () => {
    navigate(`/dashboard/apartment-owner/edit-property/${id}`);
  };

  const handleBookNow = async () => {
    // Check if user is logged in
    if (!user) {
      toast.error("Please login to book this property");
      navigate("/auth/login");
      return;
    }

    console.log(user);

    // Check if dates are selected
    if (!startDate || !endDate) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    // Check KYC verification status
    try {
      const kycResponse = await getKycStatus();
      const requiredTier = paymentPeriod !== "yearly" ? "tier3" : "tier1";

      // Check if the required tier is verified
      if (
        !kycResponse.kyc[requiredTier] ||
        kycResponse.kyc[requiredTier].status !== "verified"
      ) {
        setKycVerified(false);
        toast.error(`KYC verification required for booking`);
        return;
      }

      setKycVerified(true);
    } catch (error) {
      console.error("Error checking KYC status:", error);
      toast.error("Unable to verify KYC status. Please try again.");
      return;
    }

    // Calculate payment amount based on selected dates and pricing option
    const paymentAmount = calculateShortletPrice();

    // Create a new config for this specific payment
    const paymentConfig = {
      ...paystackConfig({
        ...user,
        amount: paymentAmount,
      }),
      metadata: {
        custom_fields: [
          {
            display_name: "Customer Name",
            variable_name: "customer_name",
            value: user?.first_name + " " + user?.last_name,
          },
          {
            display_name: "Customer ID",
            variable_name: "customer_id",
            value: user?._id,
          },
          {
            display_name: "Property",
            variable_name: "property_name",
            value: property?.property_name || "",
          },
          {
            display_name: "Booking Type",
            variable_name: "booking_type",
            value: "shortlet",
          },
          {
            display_name: "Duration",
            variable_name: "duration",
            value: `${numberOfDays} ${numberOfDays === 1 ? "day" : "days"}`,
          },
          {
            display_name: "Rate",
            variable_name: "rate",
            value: selectedPricingOption,
          },
        ],
      },
    };

    // Initialize Paystack payment
    const onSuccess = (response) => {
      console.log("Payment response:", response);
      handlePaymentSuccess(response);
    };

    const onClose = () => {
      toast.error("Payment was not completed");
    };

    // Use the hook at the component level and call the function here
    initializePayment(onSuccess, onClose, paymentConfig);
  };

  // Function to check if a date is unavailable
  const isDateUnavailable = (date) => {
    if (!availabilityData) return false;

    const currentDate = new Date(date);

    // Check if the date is within any unavailable date ranges (bookings)
    return availabilityData.unavailable_dates.some(
      ({ start_date, end_date }) =>
        currentDate >= new Date(start_date) && currentDate <= new Date(end_date)
    );
  };

  const handlePaymentSuccess = async (reference) => {
    try {
      // Create booking data with pricing information
      const bookingData = {
        check_in_date: startDate,
        check_out_date: endDate,
        estimated_arrival: estimatedArrival,
        property_id: id,
        guest_count: guestCount,
        payment: reference,
        pricing_option:
          property.property_category === "shortlet"
            ? selectedPricingOption
            : null,
        total_price:
          property.property_category === "shortlet"
            ? calculateShortletPrice()
            : calculateInitialPayment(),
      };

      const response = await bookingService.createBooking(bookingData);
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
    const { per_day, per_week, per_month, rent_per_year } = property.pricing;

    if (rent_per_year.is_active) {
      total = rent_per_year.annual_rent;
      if (rent_per_year.is_agency_fee_active) total += rent_per_year.agency_fee;
      if (rent_per_year.is_commission_fee_active)
        total += rent_per_year.commission_fee;
      if (rent_per_year.is_caution_fee_active)
        total += rent_per_year.caution_fee;
      if (rent_per_year.is_legal_fee_active) total += rent_per_year.legal_fee;
    } else {
      // Calculate based on active pricing options
      if (days >= 30 && per_month.is_active) {
        const months = Math.floor(days / 30);
        const remainingDays = days % 30;
        total = months * per_month.base_price;

        // Add remaining days if per_day is active
        if (remainingDays > 0 && per_day.is_active) {
          total += remainingDays * per_day.base_price;
        }

        // Add fees
        total += per_month.cleaning_fee + per_month.security_deposit;
      } else if (days >= 7 && per_week.is_active) {
        const weeks = Math.floor(days / 7);
        const remainingDays = days % 7;
        total = weeks * per_week.base_price;

        // Add remaining days if per_day is active
        if (remainingDays > 0 && per_day.is_active) {
          total += remainingDays * per_day.base_price;
        }

        // Add fees
        total += per_week.cleaning_fee + per_week.security_deposit;
      } else if (per_day.is_active) {
        total =
          days * per_day.base_price +
          per_day.cleaning_fee +
          per_day.security_deposit;
      }
    }

    setTotalPrice(total);
    return total;
  };

  const getActivePricing = () => {
    const { per_day, per_week, per_month, rent_per_year } =
      property?.pricing || {};

    // For rent properties
    if (rent_per_year?.is_active) {
      return {
        price: rent_per_year.annual_rent,
        period: "year",
        fees: {
          agency_fee: rent_per_year.is_agency_fee_active
            ? rent_per_year.agency_fee
            : 0,
          commission_fee: rent_per_year.is_commission_fee_active
            ? rent_per_year.commission_fee
            : 0,
          caution_fee: rent_per_year.is_caution_fee_active
            ? rent_per_year.caution_fee
            : 0,
          legal_fee: rent_per_year.is_legal_fee_active
            ? rent_per_year.legal_fee
            : 0,
        },
      };
    }

    // For shortlet properties - return all available pricing options
    const pricingOptions = {};

    if (per_day?.is_active) {
      pricingOptions.day = {
        base_price: per_day.base_price,
        cleaning_fee: per_day.cleaning_fee,
        security_deposit: per_day.security_deposit,
        total:
          per_day.base_price + per_day.cleaning_fee + per_day.security_deposit,
      };
    }

    if (per_week?.is_active) {
      pricingOptions.week = {
        base_price: per_week.base_price,
        cleaning_fee: per_week.cleaning_fee,
        security_deposit: per_week.security_deposit,
        total:
          per_week.base_price +
          per_week.cleaning_fee +
          per_week.security_deposit,
      };
    }

    if (per_month?.is_active) {
      pricingOptions.month = {
        base_price: per_month.base_price,
        cleaning_fee: per_month.cleaning_fee,
        security_deposit: per_month.security_deposit,
        total:
          per_month.base_price +
          per_month.cleaning_fee +
          per_month.security_deposit,
      };
    }

    // If it's a shortlet with pricing options
    if (Object.keys(pricingOptions).length > 0) {
      return {
        type: "shortlet",
        options: pricingOptions,
      };
    }

    // Fallback to old behavior for backward compatibility
    if (per_month?.is_active) {
      return {
        price: per_month.base_price,
        period: "month",
      };
    }
    if (per_week?.is_active) {
      return {
        price: per_week.base_price,
        period: "week",
      };
    }
    if (per_day?.is_active) {
      return {
        price: per_day.base_price,
        period: "night",
      };
    }
    return null;
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
    <div className="flex items-center justify-between px-2 sm:px-4 py-2">
      <button
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        type="button"
        className="p-1 hover:bg-gray-100 rounded-full disabled:opacity-50"
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6"
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
      <div className="text-base sm:text-lg font-semibold text-gray-900">
        {date.toLocaleString("default", { month: "long" })} {date.getFullYear()}
      </div>
      <button
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        type="button"
        className="p-1 hover:bg-gray-100 rounded-full disabled:opacity-50"
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6"
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

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle = property?.property_name;
    const shareText = `Check out this amazing property: ${property?.property_name} in ${property?.location.city}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        toast.success("Shared successfully!");
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("Failed to share");
    }
  };

  const handleSocialShare = (platform) => {
    const shareUrl = window.location.href;
    // const shareTitle = encodeURIComponent(property?.property_name || "");
    const shareText = encodeURIComponent(
      `Check out this amazing property: ${property?.property_name} in ${property?.location.city}`
    );

    let url = "";
    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(
          shareUrl
        )}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl
        )}`;
        break;
      case "whatsapp":
        url = `https://api.whatsapp.com/send?text=${shareText}%20${encodeURIComponent(
          shareUrl
        )}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          shareUrl
        )}`;
        break;
      default:
        break;
    }

    if (url) {
      window.open(url, "_blank", "width=600,height=400");
    }
  };

  // Calculate total rent based on payment period and monthly payment option
  const calculateTotalRent = () => {
    if (!property?.pricing?.rent_per_year) return 0;

    const {
      annual_rent,
      agency_fee,
      commission_fee,
      caution_fee,
      legal_fee,
      is_agency_fee_active,
      is_commission_fee_active,
      is_caution_fee_active,
      is_legal_fee_active,
    } = property.pricing.rent_per_year;

    // For yearly payment, return the total annual amount
    if (paymentPeriod === "yearly") {
      let total = annual_rent;
      if (is_agency_fee_active) total += agency_fee;
      if (is_commission_fee_active) total += commission_fee;
      if (is_caution_fee_active) total += caution_fee;
      if (is_legal_fee_active) total += legal_fee;
      return total;
    }

    // For installment payments, calculate based on the selected option
    if (monthlyPaymentOption === "6months") {
      return calculate6MonthsPayment();
    } else if (monthlyPaymentOption === "12months") {
      return calculate12MonthsPayment();
    }

    return 0;
  };

  // Calculate 6 months payment (1.5% monthly interest)
  const calculate6MonthsPayment = () => {
    if (!property?.pricing?.rent_per_year) return 0;

    const {
      annual_rent,
      agency_fee,
      commission_fee,
      caution_fee,
      legal_fee,
      is_agency_fee_active,
      is_commission_fee_active,
      is_caution_fee_active,
      is_legal_fee_active,
    } = property.pricing.rent_per_year;

    // Calculate total base amount (rent + all fees)
    let totalAmount = annual_rent;
    if (is_agency_fee_active) totalAmount += agency_fee;
    if (is_commission_fee_active) totalAmount += commission_fee;
    if (is_caution_fee_active) totalAmount += caution_fee;
    if (is_legal_fee_active) totalAmount += legal_fee;

    // Calculate monthly interest (1.5% of total amount)
    const monthlyInterest = totalAmount * 0.015;

    // Monthly payment = (total amount / 6) + monthly interest
    const monthlyPayment = totalAmount / 6 + monthlyInterest;

    return monthlyPayment;
  };

  // Calculate 12 months payment (2% monthly interest)
  const calculate12MonthsPayment = () => {
    if (!property?.pricing?.rent_per_year) return 0;

    const {
      annual_rent,
      agency_fee,
      commission_fee,
      caution_fee,
      legal_fee,
      is_agency_fee_active,
      is_commission_fee_active,
      is_caution_fee_active,
      is_legal_fee_active,
    } = property.pricing.rent_per_year;

    // Calculate total base amount (rent + all fees)
    let totalAmount = annual_rent;
    if (is_agency_fee_active) totalAmount += agency_fee;
    if (is_commission_fee_active) totalAmount += commission_fee;
    if (is_caution_fee_active) totalAmount += caution_fee;
    if (is_legal_fee_active) totalAmount += legal_fee;

    // Calculate monthly interest (2% of total amount)
    const monthlyInterest = totalAmount * 0.02;

    // Monthly payment = (total amount / 12) + monthly interest
    const monthlyPayment = totalAmount / 12 + monthlyInterest;

    return monthlyPayment;
  };

  // Calculate price for shortlet based on selected pricing option and dates
  const calculateShortletPrice = () => {
    if (
      !property?.pricing ||
      !startDate ||
      !endDate ||
      !getActivePricing()?.type === "shortlet"
    ) {
      return 0;
    }

    const pricing = getActivePricing();

    // If no pricing options available
    if (!pricing.options || Object.keys(pricing.options).length === 0) {
      return 0;
    }

    // Get the selected pricing option
    const option = pricing.options[selectedPricingOption];
    if (!option) {
      return 0;
    }

    // For day pricing, multiply by number of days
    if (selectedPricingOption === "day") {
      return option.total * numberOfDays;
    }

    // For week pricing
    if (selectedPricingOption === "week") {
      const weeks = Math.ceil(numberOfDays / 7);
      return option.total * weeks;
    }

    // For month pricing
    if (selectedPricingOption === "month") {
      const months = Math.ceil(numberOfDays / 30);
      return option.total * months;
    }

    return 0;
  };

  // Calculate initial payment based on payment option
  const calculateInitialPayment = () => {
    if (!property?.pricing?.rent_per_year) return 0;

    if (paymentPeriod === "yearly") {
      // For yearly payment, return the total annual amount
      return calculateTotalRent();
    }

    // For installment payments, return the first month's payment
    if (monthlyPaymentOption === "6months") {
      return calculate6MonthsPayment();
    } else if (monthlyPaymentOption === "12months") {
      return calculate12MonthsPayment();
    }

    return 0;
  };

  const handleRentNow = () => {
    // Check if user is logged in
    if (!user) {
      toast.error("Please login to rent this property");
      navigate("/auth/login");
      return;
    }

    if (user?.kyc?.tier1?.status !== "verified") {
      toast.error("KYC verification required for renting properties");
      navigate("/user/settings/kyc");
      return;
    }

    // Update payment amount based on selected options
    const paymentAmount = calculateInitialPayment();

    // Create a new config for this specific payment
    const paymentConfig = {
      ...paystackConfig({
        ...user,
        amount: paymentAmount,
      }),
      metadata: {
        custom_fields: [
          {
            display_name: "Customer Name",
            variable_name: "customer_name",
            value: user?.first_name + " " + user?.last_name,
          },
          {
            display_name: "Customer ID",
            variable_name: "customer_id",
            value: user?._id,
          },
          {
            display_name: "Property",
            variable_name: "property_name",
            value: property?.property_name || "",
          },
          {
            display_name: "Booking Type",
            variable_name: "booking_type",
            value: "rent",
          },
          {
            display_name: "Payment Period",
            variable_name: "payment_period",
            value: paymentPeriod,
          },
          {
            display_name: "Payment Option",
            variable_name: "payment_option",
            value: paymentPeriod === "yearly" ? "yearly" : monthlyPaymentOption,
          },
        ],
      },
    };

    // Initialize Paystack payment
    const onSuccess = (response) => {
      console.log("Payment response:", response);
      handlePaymentSuccess(response);
    };

    const onClose = () => {
      toast.error("Payment was not completed");
    };

    // Use the hook at the component level and call the function here
    initializePayment(onSuccess, onClose, paymentConfig);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Property Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
          <div className="w-full sm:w-auto">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold break-words">
                {property?.property_name}
              </h1>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded">
                Ref: {property?.short_id}
              </span>
            </div>
            <div className="flex items-start sm:items-center text-gray-600 mb-2">
              <IoLocationOutline className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5 sm:mt-0" />
              <span className="text-sm sm:text-base">{`${property?.location.street_address}, ${property?.location.city}, ${property?.location.state}`}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  property?.property_category === "shortlet"
                    ? "bg-blue-500 text-white"
                    : "bg-green-500 text-white"
                }`}
              >
                {property?.property_category === "shortlet"
                  ? "Shortlet"
                  : "Rent"}
              </span>
              <span className="px-2 py-1 rounded-full bg-gray-200 text-gray-800 text-xs font-medium">
                {property?.property_type.charAt(0).toUpperCase() +
                  property?.property_type.slice(1)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 sm:mt-0 self-start">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border hover:bg-gray-50 transition-colors duration-200 active:bg-gray-100"
            >
              <BsShare className="w-4 h-4" />
              <span className="text-sm sm:text-base">Share</span>
            </button>
            <div className="flex gap-1 sm:gap-2">
              <button
                onClick={() => handleSocialShare("twitter")}
                className="p-2 rounded-full border hover:bg-gray-50 transition-colors duration-200 active:bg-gray-100"
                title="Share on Twitter"
              >
                <BsTwitterX className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleSocialShare("facebook")}
                className="p-2 rounded-full border hover:bg-gray-50 transition-colors duration-200 active:bg-gray-100"
                title="Share on Facebook"
              >
                <BsFacebook className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleSocialShare("whatsapp")}
                className="p-2 rounded-full border hover:bg-gray-50 transition-colors duration-200 active:bg-gray-100"
                title="Share on WhatsApp"
              >
                <BsWhatsapp className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleSocialShare("linkedin")}
                className="p-2 rounded-full border hover:bg-gray-50 transition-colors duration-200 active:bg-gray-100"
                title="Share on LinkedIn"
              >
                <BsLinkedin className="w-4 h-4" />
              </button>
            </div>
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
              className="h-[250px] sm:h-[300px] rounded-3xl"
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
          <div className="fixed inset-0 bg-black/95 z-50 overflow-hidden">
            <button
              onClick={closeFullScreen}
              className="absolute top-4 right-4 text-white z-[60] p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <BsX className="w-8 h-8" />
            </button>
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-full h-full max-w-[1200px] mx-auto px-4 relative">
                {/* Custom navigation buttons */}
                <button className="swiper-button-prev absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-[55] bg-white/10 hover:bg-white/20 transition-colors p-2 sm:p-3 rounded-full">
                  <BsChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </button>
                <button className="swiper-button-next absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-[55] bg-white/10 hover:bg-white/20 transition-colors p-2 sm:p-3 rounded-full">
                  <BsChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </button>

                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={0}
                  slidesPerView={1}
                  navigation={{
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                  }}
                  pagination={{
                    clickable: true,
                    dynamicBullets: true,
                  }}
                  className="w-full h-full gallery-swiper"
                  initialSlide={fullScreenIndex}
                >
                  {property?.property_images.map((image, index) => (
                    <SwiperSlide
                      key={image._id}
                      className="flex items-center justify-center h-full"
                    >
                      <div className="flex items-center justify-center w-full h-full px-2 sm:px-4">
                        <img
                          src={image.url}
                          alt={`Gallery ${index + 1}`}
                          className="max-h-[85vh] max-w-full w-auto h-auto object-contain mx-auto shadow-xl"
                          loading="lazy"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
        )}

        {/* Property Details */}
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          <div className="w-full lg:w-[65%]">
            {/* Basic Info */}
            <div className="bg-white rounded-3xl p-3 md:p-8 mb-8">
              <div className="flex flex-wrap items-center justify-between mb-6">
                <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                  <div className="flex items-center gap-2">
                    <BiBed className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-semibold">{property?.bedroom_count}</p>
                      <p className="text-sm text-gray-500">Bedrooms</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <BiBath className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-semibold">
                        {property?.bathroom_count}
                      </p>
                      <p className="text-sm text-gray-500">Bathrooms</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiOutlineUsers className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-semibold">{property?.max_guests}</p>
                      <p className="text-sm text-gray-500">Max Guests</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0">
                  <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
                    <BsInfoCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">
                      Reference: {property?.short_id}
                    </span>
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-semibold mb-4">
                About this {property?.property_type}
              </h2>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                {property?.property_description}
              </p>

              {/* Amenities */}
              <h2 className="text-xl font-semibold mb-4">
                What this place offers
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {property?.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-gray-600 text-sm sm:text-base"
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
                      <span className="text-primary-900">•</span>
                      <p className="text-gray-600 text-sm sm:text-base">
                        {rule}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:w-[35%]  sticky top-8">
            {property?.property_category === "shortlet" && (
              <div className="bg-white rounded-3xl p-6 shadow-lg">
                <div className="flex justify-between items-start mb-6">
                  {getActivePricing() ? (
                    <div className="space-y-4 w-full">
                      <div className="flex justify-between items-center w-full">
                        <h3 className="text-lg font-semibold text-gray-800">
                          Pricing Options
                        </h3>
                        {/* <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                          <span className="text-sm font-semibold">4.5</span>
                          <span className="text-xs text-yellow-500">★</span>
                        </div> */}
                      </div>

                      {getActivePricing().type === "shortlet" ? (
                        <div className="space-y-3 w-full">
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                              Select pricing option:
                            </h4>
                            <div className="grid grid-cols-1 gap-2">
                              {getActivePricing().options.day && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSelectedPricingOption("day")
                                  }
                                  className={`flex flex-col p-4 rounded-lg border-2 transition-all ${
                                    selectedPricingOption === "day"
                                      ? "border-blue-500 bg-blue-50"
                                      : "border-gray-200 bg-gray-50 hover:border-blue-300"
                                  }`}
                                >
                                  <div className="flex justify-between items-center w-full mb-2">
                                    <div>
                                      <p className="font-bold text-gray-900">
                                        {fCurrency(
                                          getActivePricing().options.day
                                            .base_price
                                        )}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        per day
                                      </p>
                                    </div>
                                    <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                      Daily Rate
                                    </div>
                                  </div>

                                  <div className="border-t border-gray-200 pt-2 w-full">
                                    <div className="flex justify-between text-xs text-gray-600">
                                      <span>Base price:</span>
                                      <span>
                                        {fCurrency(
                                          getActivePricing().options.day
                                            .base_price
                                        )}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-600">
                                      <span>Cleaning fee:</span>
                                      <span>
                                        {fCurrency(
                                          getActivePricing().options.day
                                            .cleaning_fee
                                        )}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-600">
                                      <span>Security deposit:</span>
                                      <span>
                                        {fCurrency(
                                          getActivePricing().options.day
                                            .security_deposit
                                        )}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-xs font-semibold text-gray-800 mt-1 pt-1 border-t border-gray-200">
                                      <span>Total per day:</span>
                                      <span>
                                        {fCurrency(
                                          getActivePricing().options.day.total
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                </button>
                              )}

                              {getActivePricing().options.week && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSelectedPricingOption("week")
                                  }
                                  className={`flex flex-col p-4 rounded-lg border-2 transition-all ${
                                    selectedPricingOption === "week"
                                      ? "border-blue-500 bg-blue-50"
                                      : "border-gray-200 bg-gray-50 hover:border-blue-300"
                                  }`}
                                >
                                  <div className="flex justify-between items-center w-full mb-2">
                                    <div>
                                      <p className="font-bold text-gray-900">
                                        {fCurrency(
                                          getActivePricing().options.week
                                            .base_price
                                        )}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        per week
                                      </p>
                                    </div>
                                    <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                      Weekly Rate
                                    </div>
                                  </div>

                                  <div className="border-t border-gray-200 pt-2 w-full">
                                    <div className="flex justify-between text-xs text-gray-600">
                                      <span>Base price:</span>
                                      <span>
                                        {fCurrency(
                                          getActivePricing().options.week
                                            .base_price
                                        )}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-600">
                                      <span>Cleaning fee:</span>
                                      <span>
                                        {fCurrency(
                                          getActivePricing().options.week
                                            .cleaning_fee
                                        )}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-600">
                                      <span>Security deposit:</span>
                                      <span>
                                        {fCurrency(
                                          getActivePricing().options.week
                                            .security_deposit
                                        )}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-xs font-semibold text-gray-800 mt-1 pt-1 border-t border-gray-200">
                                      <span>Total per week:</span>
                                      <span>
                                        {fCurrency(
                                          getActivePricing().options.week.total
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                </button>
                              )}

                              {getActivePricing().options.month && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSelectedPricingOption("month")
                                  }
                                  className={`flex flex-col p-4 rounded-lg border-2 transition-all ${
                                    selectedPricingOption === "month"
                                      ? "border-blue-500 bg-blue-50"
                                      : "border-gray-200 bg-gray-50 hover:border-blue-300"
                                  }`}
                                >
                                  <div className="flex justify-between items-center w-full mb-2">
                                    <div>
                                      <p className="font-bold text-gray-900">
                                        {fCurrency(
                                          getActivePricing().options.month
                                            .base_price
                                        )}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        per month
                                      </p>
                                    </div>
                                    <div className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                      Monthly Rate
                                    </div>
                                  </div>

                                  <div className="border-t border-gray-200 pt-2 w-full">
                                    <div className="flex justify-between text-xs text-gray-600">
                                      <span>Base price:</span>
                                      <span>
                                        {fCurrency(
                                          getActivePricing().options.month
                                            .base_price
                                        )}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-600">
                                      <span>Cleaning fee:</span>
                                      <span>
                                        {fCurrency(
                                          getActivePricing().options.month
                                            .cleaning_fee
                                        )}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-600">
                                      <span>Security deposit:</span>
                                      <span>
                                        {fCurrency(
                                          getActivePricing().options.month
                                            .security_deposit
                                        )}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-xs font-semibold text-gray-800 mt-1 pt-1 border-t border-gray-200">
                                      <span>Total per month:</span>
                                      <span>
                                        {fCurrency(
                                          getActivePricing().options.month.total
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-2xl font-bold mb-1">
                            {fCurrency(getActivePricing().price)}
                          </p>
                          <p className="text-gray-600">
                            per {getActivePricing().period}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="text-xl text-gray-600">
                        Contact for pricing
                      </p>
                    </div>
                  )}
                </div>

                <div className="border rounded-xl p-4 mb-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Select dates
                    </label>
                    <div className="w-full overflow-hidden">
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
                        className="w-full"
                        calendarClassName="!border-0 !shadow-lg !rounded-xl w-full"
                        dayClassName={(date) =>
                          date.getDate() === new Date().getDate() &&
                          date.getMonth() === new Date().getMonth()
                            ? "!text-blue-600 font-semibold"
                            : undefined
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Guests
                    </label>
                    <select className="w-full border rounded-lg p-2 text-sm sm:text-base">
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
                      className="w-full border rounded-lg p-2 text-sm sm:text-base"
                    />
                  </div>
                </div>

                {/* Pricing Breakdown */}
                {startDate && endDate && getActivePricing() && (
                  <div className="space-y-2 text-sm border-t pt-4 mt-4">
                    {getActivePricing()?.period === "year" && (
                      <>
                        <div className="flex justify-between">
                          <span>Annual Rent</span>
                          <span>{fCurrency(getActivePricing().price)}</span>
                        </div>
                        {getActivePricing().fees.agency_fee > 0 && (
                          <div className="flex justify-between">
                            <span>Agency Fee</span>
                            <span>
                              {fCurrency(getActivePricing().fees.agency_fee)}
                            </span>
                          </div>
                        )}
                        {getActivePricing().fees.commission_fee > 0 && (
                          <div className="flex justify-between">
                            <span>Commission Fee</span>
                            <span>
                              {fCurrency(
                                getActivePricing().fees.commission_fee
                              )}
                            </span>
                          </div>
                        )}
                        {getActivePricing().fees.caution_fee > 0 && (
                          <div className="flex justify-between">
                            <span>Caution Fee</span>
                            <span>
                              {fCurrency(getActivePricing().fees.caution_fee)}
                            </span>
                          </div>
                        )}
                        {getActivePricing().fees.legal_fee > 0 && (
                          <div className="flex justify-between">
                            <span>Legal Fee</span>
                            <span>
                              {fCurrency(getActivePricing().fees.legal_fee)}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                    {property?.pricing?.per_month?.is_active && (
                      <div className="flex justify-between">
                        <span>
                          Base price ({Math.floor(numberOfDays / 30)}{" "}
                          {Math.floor(numberOfDays / 30) === 1
                            ? "month"
                            : "months"}
                          {numberOfDays % 30 > 0 &&
                            property?.pricing?.per_day?.is_active &&
                            ` + ${numberOfDays % 30} days`}
                          )
                        </span>
                        <span>
                          {fCurrency(
                            Math.floor(numberOfDays / 30) *
                              property?.pricing?.per_month?.base_price +
                              (numberOfDays % 30 > 0 &&
                              property?.pricing?.per_day?.is_active
                                ? (numberOfDays % 30) *
                                  property?.pricing?.per_day?.base_price
                                : 0)
                          )}
                        </span>
                      </div>
                    )}
                    {property?.pricing?.per_week?.is_active &&
                      !property?.pricing?.per_month.is_active && (
                        <div className="flex justify-between">
                          <span>
                            Base price ({Math.floor(numberOfDays / 7)}{" "}
                            {Math.floor(numberOfDays / 7) === 1
                              ? "week"
                              : "weeks"}
                            {numberOfDays % 7 > 0 &&
                              property?.pricing?.per_day?.is_active &&
                              ` + ${numberOfDays % 7} days`}
                            )
                          </span>
                          <span>
                            {fCurrency(
                              Math.floor(numberOfDays / 7) *
                                property?.pricing?.per_week?.base_price +
                                (numberOfDays % 7 > 0 &&
                                property?.pricing?.per_day?.is_active
                                  ? (numberOfDays % 7) *
                                    property?.pricing?.per_day?.base_price
                                  : 0)
                            )}
                          </span>
                        </div>
                      )}
                    {property?.pricing?.per_day?.is_active &&
                      !property?.pricing?.per_week?.is_active &&
                      !property?.pricing?.per_month?.is_active && (
                        <div className="flex justify-between">
                          <span>
                            Base price ({numberOfDays}{" "}
                            {numberOfDays === 1 ? "night" : "nights"})
                          </span>
                          <span>
                            {fCurrency(
                              property?.pricing?.per_day?.base_price *
                                numberOfDays
                            )}
                          </span>
                        </div>
                      )}
                    {getActivePricing()?.period === "month" &&
                      property?.pricing?.per_month?.cleaning_fee > 0 && (
                        <div className="flex justify-between">
                          <span>Cleaning fee</span>
                          <span>
                            {fCurrency(
                              property?.pricing?.per_month?.cleaning_fee
                            )}
                          </span>
                        </div>
                      )}
                    {getActivePricing()?.period === "week" &&
                      property?.pricing?.per_week?.cleaning_fee > 0 && (
                        <div className="flex justify-between">
                          <span>Cleaning fee</span>
                          <span>
                            {fCurrency(
                              property?.pricing?.per_week?.cleaning_fee
                            )}
                          </span>
                        </div>
                      )}
                    {getActivePricing()?.period === "night" &&
                      property?.pricing?.per_day?.cleaning_fee > 0 && (
                        <div className="flex justify-between">
                          <span>Cleaning fee</span>
                          <span>
                            {fCurrency(
                              property?.pricing?.per_day?.cleaning_fee
                            )}
                          </span>
                        </div>
                      )}
                    {getActivePricing()?.period === "month" &&
                      property?.pricing?.per_month?.security_deposit > 0 && (
                        <div className="flex justify-between">
                          <span>Security deposit</span>
                          <span>
                            {fCurrency(
                              property?.pricing?.per_month?.security_deposit
                            )}
                          </span>
                        </div>
                      )}
                    {getActivePricing()?.period === "week" &&
                      property?.pricing?.per_week?.security_deposit > 0 && (
                        <div className="flex justify-between">
                          <span>Security deposit</span>
                          <span>
                            {fCurrency(
                              property?.pricing?.per_week?.security_deposit
                            )}
                          </span>
                        </div>
                      )}
                    {getActivePricing()?.period === "night" &&
                      property?.pricing?.per_day?.security_deposit > 0 && (
                        <div className="flex justify-between">
                          <span>Security deposit</span>
                          <span>
                            {fCurrency(
                              property?.pricing?.per_day?.security_deposit
                            )}
                          </span>
                        </div>
                      )}
                    <div className="flex justify-between pt-2 border-t font-semibold">
                      <span>Total</span>
                      <span>{fCurrency(totalPrice)}</span>
                    </div>
                  </div>
                )}

                {/* Payment Summary */}
                {startDate && endDate && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg mb-4">
                    <h4 className="font-medium text-blue-800 mb-2">
                      Payment Summary
                    </h4>

                    {/* Duration */}
                    <div className="flex justify-between text-sm text-blue-700 mb-2">
                      <span>Duration:</span>
                      <span>
                        {numberOfDays} {numberOfDays === 1 ? "day" : "days"}
                      </span>
                    </div>

                    {/* Rate Type */}
                    <div className="flex justify-between text-sm text-blue-700 mb-2">
                      <span>Rate Type:</span>
                      <span className="capitalize">
                        {selectedPricingOption}ly
                      </span>
                    </div>

                    {/* Fee Breakdown */}
                    <div className="border-t border-blue-200 pt-2 mt-2">
                      {(() => {
                        const option =
                          getActivePricing()?.options?.[selectedPricingOption];
                        if (!option) return null;

                        // Calculate units (days, weeks, or months)
                        let units = 1;
                        if (selectedPricingOption === "day") {
                          units = numberOfDays;
                        } else if (selectedPricingOption === "week") {
                          units = Math.ceil(numberOfDays / 7);
                        } else if (selectedPricingOption === "month") {
                          units = Math.ceil(numberOfDays / 30);
                        }

                        return (
                          <>
                            <div className="flex justify-between text-sm text-blue-700">
                              <span>
                                Base price ({units}{" "}
                                {units === 1
                                  ? selectedPricingOption
                                  : selectedPricingOption + "s"}
                                ):
                              </span>
                              <span>
                                {fCurrency(option.base_price * units)}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm text-blue-700">
                              <span>Cleaning fee:</span>
                              <span>{fCurrency(option.cleaning_fee)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-blue-700">
                              <span>Security deposit:</span>
                              <span>{fCurrency(option.security_deposit)}</span>
                            </div>
                            <div className="flex justify-between text-sm font-semibold text-blue-800 mt-2 pt-2 border-t border-blue-200">
                              <span>Total Payment:</span>
                              <span>{fCurrency(calculateShortletPrice())}</span>
                            </div>
                          </>
                        );
                      })()}
                    </div>

                    <div className="text-xs text-blue-600 mt-3 pt-2 border-t border-blue-200">
                      <p>
                        * Security deposit is refundable after checkout, subject
                        to property condition
                      </p>
                      <p>* Cleaning fee is a one-time charge per stay</p>
                    </div>
                  </div>
                )}

                {/* KYC Verification Status */}
                {user &&
                  user?._id !== property?.owner._id &&
                  startDate &&
                  endDate &&
                  !kycVerified && (
                    <div className="mt-4 mb-2">
                      <KycVerificationStatus
                        // requiredTier={paymentPeriod === "monthly" ? "tier2" : "tier1"}
                        requiredTier={"tier1"}
                        actionText="Continue to Payment"
                        onVerified={() => setKycVerified(true)}
                      />
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
                    Pay & Book Now
                  </button>
                )}
              </div>
            )}

            {property?.property_category === "rent" && (
              <div className="bg-white rounded-3xl p-6 shadow-lg">
                <div className="flex flex-col gap-4">
                  {/* Total Purchase Display */}
                  <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">
                        Total Purchase:
                      </span>
                      <span className="text-2xl font-bold text-blue-600">
                        {fCurrency(calculateTotalRent())}
                      </span>
                    </div>
                  </div>

                  {/* Payment Options */}
                  <div className="space-y-3">
                    {/* Yearly Payment Option */}
                    <div
                      className={`border-2 rounded-2xl p-4 cursor-pointer transition-all ${
                        paymentPeriod === "yearly"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                      onClick={() => setPaymentPeriod("yearly")}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              paymentPeriod === "yearly"
                                ? "border-blue-500 bg-blue-500"
                                : "border-gray-300"
                            }`}
                          >
                            {paymentPeriod === "yearly" && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-lg">One-off Payment</p>
                            <p className="text-sm text-gray-600">for 1 Year</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Interest Rate:</span>
                          <span className="font-medium">0%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Interest Value:</span>
                          <span className="font-medium">{fCurrency(0)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2">
                          <span>Total:</span>
                          <span>{fCurrency(calculateTotalRent())}</span>
                        </div>
                      </div>
                    </div>

                    {/* 6 Months Payment Option */}
                    <div
                      className={`border-2 rounded-2xl p-4 cursor-pointer transition-all ${
                        paymentPeriod === "6months"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                      onClick={() => {
                        setPaymentPeriod("6months");
                        setMonthlyPaymentOption("6months");
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              paymentPeriod === "6months"
                                ? "border-blue-500 bg-blue-500"
                                : "border-gray-300"
                            }`}
                          >
                            {paymentPeriod === "6months" && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-lg">
                              {fCurrency(calculate6MonthsPayment())}/month
                            </p>
                            <p className="text-sm text-gray-600">
                              for 6 months
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Interest rate:</span>
                          <span className="font-medium">1.50%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Interest value:</span>
                          <span className="font-medium">
                            {fCurrency(calculateTotalRent() * 0.015)}
                          </span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2">
                          <span>Total:</span>
                          <span>
                            {fCurrency(calculate6MonthsPayment() * 6)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 12 Months Payment Option */}
                    <div
                      className={`border-2 rounded-2xl p-4 cursor-pointer transition-all ${
                        paymentPeriod === "12months"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                      onClick={() => {
                        setPaymentPeriod("12months");
                        setMonthlyPaymentOption("12months");
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              paymentPeriod === "12months"
                                ? "border-blue-500 bg-blue-500"
                                : "border-gray-300"
                            }`}
                          >
                            {paymentPeriod === "12months" && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-lg">
                              {fCurrency(calculate12MonthsPayment())}/month
                            </p>
                            <p className="text-sm text-gray-600">
                              for 12 months
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Interest rate:</span>
                          <span className="font-medium">2.00%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Interest value:</span>
                          <span className="font-medium">
                            {fCurrency(calculateTotalRent() * 0.02)}
                          </span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2">
                          <span>Total:</span>
                          <span>
                            {fCurrency(calculate12MonthsPayment() * 12)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Simple Breakdown */}
                  <div className="bg-gray-50 rounded-2xl p-4 mt-4">
                    <h4 className="font-semibold text-gray-800 mb-3">
                      Pay Now
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Yearly Rent:</span>
                        <span>
                          {fCurrency(
                            property?.pricing?.rent_per_year?.annual_rent || 0
                          )}
                        </span>
                      </div>
                      {property?.pricing?.rent_per_year
                        ?.is_agency_fee_active && (
                        <div className="flex justify-between">
                          <span>Agency Fee:</span>
                          <span>
                            {fCurrency(
                              property?.pricing?.rent_per_year?.agency_fee || 0
                            )}
                          </span>
                        </div>
                      )}
                      {property?.pricing?.rent_per_year
                        ?.is_commission_fee_active && (
                        <div className="flex justify-between">
                          <span>Agreement Fee:</span>
                          <span>
                            {fCurrency(
                              property?.pricing?.rent_per_year
                                ?.commission_fee || 0
                            )}
                          </span>
                        </div>
                      )}
                      {property?.pricing?.rent_per_year
                        ?.is_caution_fee_active && (
                        <div className="flex justify-between">
                          <span>Caution Fee:</span>
                          <span>
                            {fCurrency(
                              property?.pricing?.rent_per_year?.caution_fee || 0
                            )}
                          </span>
                        </div>
                      )}
                      {property?.pricing?.rent_per_year
                        ?.is_legal_fee_active && (
                        <div className="flex justify-between">
                          <span>Legal Fee:</span>
                          <span>
                            {fCurrency(
                              property?.pricing?.rent_per_year?.legal_fee || 0
                            )}
                          </span>
                        </div>
                      )}
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between font-bold">
                          <span>Total:</span>
                          <span>{fCurrency(calculateTotalRent())}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {user &&
                    user?._id !== property?.owner._id &&
                    !kycVerified && (
                      <div className="mt-4 mb-2">
                        <KycVerificationStatus
                          // requiredTier={paymentPeriod === "monthly" ? "tier2" : "tier1"}
                          requiredTier={"tier1"}
                          actionText="Continue to Payment"
                          onVerified={() => setKycVerified(true)}
                        />
                      </div>
                    )}
                  {/* Book Now Button */}
                  {user?._id === property?.owner._id ? (
                    <button
                      onClick={handleEdit}
                      className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 mt-4"
                    >
                      Edit
                    </button>
                  ) : (
                    <button
                      onClick={handleRentNow}
                      className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 mt-4"
                    >
                      {paymentPeriod === "yearly"
                        ? "Pay Yearly Rent"
                        : paymentPeriod === "6months"
                        ? "Pay First Month (6 Months Plan)"
                        : "Pay First Month (12 Months Plan)"}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
