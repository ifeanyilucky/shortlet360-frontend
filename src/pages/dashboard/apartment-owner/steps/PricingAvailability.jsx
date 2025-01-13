import { useState } from "react";
import { IoMdCheckmark } from "react-icons/io";

export default function PricingAvailability({ formData, setFormData }) {
  const handlePricingChange = (type, field, value) => {
    setFormData((prev) => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [type]: {
          ...prev.pricing[type],
          [field]: parseFloat(value) || 0,
        },
      },
    }));
  };

  const togglePricingType = (type) => {
    setFormData((prev) => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [type]: {
          ...prev.pricing[type],
          is_active: !prev.pricing[type].is_active,
        },
      },
    }));
  };

  // Check if at least one pricing type is active
  const isAnyPricingActive = Object.values(formData.pricing).some(
    (type) => type.is_active
  );

  const PricingTypeSection = ({ type, title }) => (
    <div
      className={`p-6 border rounded-lg ${
        formData.pricing[type].is_active
          ? "border-primary-500 bg-primary-50"
          : "border-gray-200"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-medium">{title}</h4>
        <button
          onClick={() => togglePricingType(type)}
          className={`px-4 py-2 rounded-md flex items-center gap-2 ${
            formData.pricing[type].is_active
              ? "bg-primary-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {formData.pricing[type].is_active && <IoMdCheckmark />}
          {formData.pricing[type].is_active ? "Active" : "Activate"}
        </button>
      </div>

      <div
        className={`flex gap-5 ${
          !formData.pricing[type].is_active && "opacity-50 pointer-events-none"
        }`}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Base Price
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2">$</span>
            <input
              type="number"
              min="0"
              value={formData.pricing[type].base_price}
              onChange={(e) =>
                handlePricingChange(type, "base_price", e.target.value)
              }
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cleaning Fee
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2">$</span>
            <input
              type="number"
              min="0"
              value={formData.pricing[type].cleaning_fee}
              onChange={(e) =>
                handlePricingChange(type, "cleaning_fee", e.target.value)
              }
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Security Deposit
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2">$</span>
            <input
              type="number"
              min="0"
              value={formData.pricing[type].security_deposit}
              onChange={(e) =>
                handlePricingChange(type, "security_deposit", e.target.value)
              }
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Pricing Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Pricing Options</h3>
          {!isAnyPricingActive && (
            <p className="text-red-500 text-sm">
              Please activate at least one pricing type
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 gap-6">
          <PricingTypeSection type="per_day" title="Daily Pricing" />
          <PricingTypeSection type="per_week" title="Weekly Pricing" />
          <PricingTypeSection type="per_month" title="Monthly Pricing" />
        </div>
      </div>
    </div>
  );
}
