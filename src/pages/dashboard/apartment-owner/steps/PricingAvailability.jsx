import { useState, useEffect, useCallback } from "react";
import { IoMdCheckmark, IoMdAdd, IoMdTrash } from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useFormContext } from "react-hook-form";

const PriceInput = ({ type, field, value, onChange, error, hideLabel }) => {
  const [localValue, setLocalValue] = useState("");

  // Update local value when form value changes
  useEffect(() => {
    setLocalValue(value?.toString() || "");
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value.replace(/[^0-9]/g, "");
    setLocalValue(newValue);
  };

  const handleBlur = () => {
    onChange(type, field, localValue === "" ? 0 : Number(localValue));
  };

  return (
    <div>
      {!hideLabel && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {field
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </label>
      )}
      <div className="relative">
        <span className="absolute left-3 top-2">₦</span>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default function PricingAvailability() {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const pricing = watch("pricing");
  const propertyCategory = watch("property_category");
  const unavailableDates = watch("unavailable_dates") || [];

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handlePriceChange = (period, field, value) => {
    setValue(`pricing.${period}.${field}`, value, {
      shouldValidate: true,
    });
  };

  const handlePricingChange = useCallback(
    (period, field, value) => {
      if (field === "is_active") {
        setValue(`pricing.${period}.${field}`, value, {
          shouldValidate: true,
        });
      }
    },
    [setValue]
  );

  const getInputValue = (type, field) => {
    const localValue = pricing[type]?.[field];
    if (localValue !== undefined) return localValue;
    return pricing[type]?.[field] ?? "";
  };

  const togglePricingType = (type) => {
    setValue(`pricing.${type}.is_active`, !pricing[type].is_active, {
      shouldValidate: true,
    });
  };

  const addUnavailableRange = () => {
    if (startDate && endDate && startDate < endDate) {
      setValue(
        "unavailable_dates",
        [...unavailableDates, { start_date: startDate, end_date: endDate }],
        { shouldValidate: true }
      );
      setStartDate(null);
      setEndDate(null);
    }
  };

  const removeUnavailableRange = (index) => {
    setValue(
      "unavailable_dates",
      unavailableDates.filter((_, i) => i !== index),
      { shouldValidate: true }
    );
  };

  // Check if at least one pricing type is active
  const isAnyPricingActive = Object.values(pricing).some(
    (type) => type.is_active
  );

  const ShortletPricingSection = ({ type, title }) => (
    <div className="border p-4 rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{title}</h3>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={pricing[type].is_active}
            onChange={(e) =>
              handlePricingChange(type, "is_active", e.target.checked)
            }
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-600">Enable</span>
        </label>
      </div>
      <div
        className={`grid grid-cols-3 gap-4 ${
          !pricing[type].is_active && "opacity-50 pointer-events-none"
        }`}
      >
        {[
          { field: "base_price", label: "Base Price" },
          { field: "cleaning_fee", label: "Cleaning Fee" },
          { field: "security_deposit", label: "Security Deposit" },
        ].map(({ field, label }) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            <PriceInput
              type={type}
              field={field}
              value={pricing[type]?.[field]}
              onChange={handlePriceChange}
              error={errors?.pricing?.[type]?.[field]?.message}
              hideLabel
            />
          </div>
        ))}
      </div>
    </div>
  );

  const RentalPricingSection = () => (
    <div className="border p-4 rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Rental Pricing</h3>
        <span className="text-sm text-primary-600 font-medium">Required</span>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Annual Rent
          </label>
          <PriceInput
            type="rent_per_year"
            field="annual_rent"
            value={pricing.rent_per_year?.annual_rent}
            onChange={handlePriceChange}
            error={errors?.pricing?.rent_per_year?.annual_rent?.message}
            hideLabel
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { field: "agency_fee", label: "Agency Fee" },
            { field: "commission_fee", label: "Commission Fee" },
            { field: "caution_fee", label: "Caution Fee" },
            { field: "legal_fee", label: "Legal Fee" },
          ].map(({ field, label }) => (
            <div key={field} className="border p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">
                  {label}
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={pricing.rent_per_year[`is_${field}_active`]}
                    onChange={(e) => {
                      setValue(
                        `pricing.rent_per_year.is_${field}_active`,
                        e.target.checked,
                        { shouldValidate: true }
                      );
                    }}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600">Enable</span>
                </label>
              </div>
              <PriceInput
                type="rent_per_year"
                field={field}
                value={pricing.rent_per_year?.[field]}
                onChange={handlePriceChange}
                error={errors?.pricing?.rent_per_year?.[field]?.message}
                hideLabel
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {propertyCategory === "shortlet" ? (
        <>
          <ShortletPricingSection type="per_day" title="Daily Pricing" />
          <ShortletPricingSection type="per_week" title="Weekly Pricing" />
          <ShortletPricingSection type="per_month" title="Monthly Pricing" />
        </>
      ) : (
        <RentalPricingSection />
      )}

      {/* Blocked Dates Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Block Out Dates
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Set dates when your property will not be available for booking (e.g.,
          external bookings, maintenance, personal use)
        </p>
        <div className="space-y-4">
          <div className="flex gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From
              </label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                minDate={new Date()}
                dateFormat="MMMM d, yyyy"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholderText="Select start date"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To
              </label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                dateFormat="MMMM d, yyyy"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholderText="Select end date"
              />
            </div>
            <button
              type="button"
              onClick={addUnavailableRange}
              disabled={!startDate || !endDate || startDate >= endDate}
              className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                startDate && endDate && startDate < endDate
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              <IoMdAdd />
              Block Dates
            </button>
          </div>

          {/* Display blocked date ranges */}
          <div className="space-y-2">
            {unavailableDates.map((range, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-red-50 rounded-md border border-red-100"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-red-800">
                    Blocked Period
                  </span>
                  <span className="text-sm text-red-600">
                    {new Date(range.start_date).toLocaleDateString()} -{" "}
                    {new Date(range.end_date).toLocaleDateString()}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeUnavailableRange(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  <IoMdTrash size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Error message for pricing validation */}
      {!isAnyPricingActive && (
        <p className="text-red-500 text-sm">
          Please activate at least one pricing type
          {propertyCategory === "shortlet"
            ? " (Daily or Weekly for Shortlet)"
            : " (Monthly for Rent)"}
        </p>
      )}
    </div>
  );
}
