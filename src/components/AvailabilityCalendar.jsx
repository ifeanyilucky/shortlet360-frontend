import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { bookingService } from "../services/api";
import toast from "react-hot-toast";
import { IoAdd, IoTrash } from "react-icons/io5";

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

export default function AvailabilityCalendar({ propertyId, isOwner = false }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [availabilityData, setAvailabilityData] = useState(null);
  const [isAddingBlock, setIsAddingBlock] = useState(false);
  const [blockReason, setBlockReason] = useState("");
  const [blockDates, setBlockDates] = useState({ start: null, end: null });

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

  const handleAddBlock = async () => {
    if (!blockDates.start || !blockDates.end || !blockReason) {
      toast.error("Please select dates and provide a reason");
      return;
    }

    try {
      const updatedUnavailableDates = [
        ...(availabilityData?.unavailable_dates || []),
        {
          start_date: blockDates.start,
          end_date: blockDates.end,
          reason: blockReason,
        },
      ];

      await bookingService.updatePropertyUnavailableDates(propertyId, {
        unavailable_dates: updatedUnavailableDates,
      });

      // Refresh availability data
      const response = await bookingService.getPropertyAvailability(propertyId);
      setAvailabilityData(response.data.data);

      // Reset form
      setIsAddingBlock(false);
      setBlockDates({ start: null, end: null });
      setBlockReason("");
      toast.success("Dates blocked successfully");
    } catch (error) {
      console.error("Error blocking dates:", error);
      toast.error("Error blocking dates");
    }
  };

  const handleRemoveBlock = async (indexToRemove) => {
    try {
      const updatedUnavailableDates = availabilityData.unavailable_dates.filter(
        (_, index) => index !== indexToRemove
      );

      await bookingService.updatePropertyUnavailableDates(propertyId, {
        unavailable_dates: updatedUnavailableDates,
      });

      // Refresh availability data
      const response = await bookingService.getPropertyAvailability(propertyId);
      setAvailabilityData(response.data.data);
      toast.success("Block removed successfully");
    } catch (error) {
      console.error("Error removing block:", error);
      toast.error("Error removing block");
    }
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
          {isOwner
            ? "Manage Property Availability"
            : "Select dates to check availability"}
        </h3>
        <p className="text-sm text-gray-500">
          Dates marked with a line through are unavailable for booking.
        </p>
      </div>

      {isOwner && (
        <div className="mb-6">
          {!isAddingBlock ? (
            <button
              onClick={() => setIsAddingBlock(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <IoAdd className="w-5 h-5" />
              <span>Block Dates</span>
            </button>
          ) : (
            <div className="space-y-4 ">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Dates to Block
                </label>
                <DatePicker
                  selected={blockDates.start}
                  onChange={(dates) => {
                    const [start, end] = dates;
                    setBlockDates({ start, end });
                  }}
                  startDate={blockDates.start}
                  endDate={blockDates.end}
                  selectsRange
                  inline
                  minDate={new Date()}
                  filterDate={(date) => !isDateUnavailable(date)}
                  className="w-full"
                  renderCustomHeader={renderCustomHeader}
                  calendarClassName="!border-0 !shadow-lg !rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason
                </label>
                <input
                  type="text"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="e.g., Maintenance, Personal use"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddBlock}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Confirm Block
                </button>
                <button
                  onClick={() => {
                    setIsAddingBlock(false);
                    setBlockDates({ start: null, end: null });
                    setBlockReason("");
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* List of blocked dates */}
          {availabilityData?.unavailable_dates?.length > 0 && (
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-900 mb-2">
                Blocked Dates
              </h4>
              <div className="space-y-2">
                {availabilityData.unavailable_dates.map((block, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white p-3 rounded-lg border"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {new Date(block.start_date).toLocaleDateString()} -{" "}
                        {new Date(block.end_date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">{block.reason}</p>
                    </div>
                    {block.reason !== "Booking" && (
                      <button
                        onClick={() => handleRemoveBlock(index)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <IoTrash className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!isOwner && (
        <>
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
        </>
      )}
    </div>
  );
}
