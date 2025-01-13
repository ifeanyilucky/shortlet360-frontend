import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { bookingService } from "../services/api";
import toast from "react-hot-toast";

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

export default function AvailabilityCalendar({ propertyId }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [availabilityData, setAvailabilityData] = useState(null);

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
    const fetchAvailability = async () => {
      try {
        const response = await bookingService.getPropertyAvailability(
          propertyId
        );
        setAvailabilityData(response.data.data);
      } catch (error) {
        console.error("Error fetching availability:", error);
        toast.error("Error fetching property availability");
      }
    };

    if (propertyId) {
      fetchAvailability();
    }
  }, [propertyId]);

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

  return (
    <div className="p-4">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Select dates to check availability
        </h3>
        <p className="text-sm text-gray-500">
          Dates marked in red are unavailable. Select a range to see
          availability.
        </p>
      </div>
      <DatePicker
        selected={startDate}
        onChange={(dates) => {
          const [start, end] = dates;
          setStartDate(start);
          setEndDate(end);
        }}
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
      {startDate && endDate && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            Selected dates: {startDate.toLocaleDateString()} -{" "}
            {endDate.toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
}
