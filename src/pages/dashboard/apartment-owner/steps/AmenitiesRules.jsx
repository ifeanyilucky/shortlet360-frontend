import { useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import { useFormContext } from "react-hook-form";

export default function AmenitiesRules() {
  const [newAmenity, setNewAmenity] = useState("");
  const [newRule, setNewRule] = useState("");
  const { watch, setValue } = useFormContext();

  const amenities = watch("amenities") || [];
  const houseRules = watch("house_rules") || [];

  const commonAmenities = [
    "WiFi",
    "Air Conditioning",
    "Kitchen",
    "TV",
    "Washing Machine",
    "Free Parking",
    "Pool",
    "Hot Tub",
    "Gym",
    "Elevator",
    "Security Cameras",
    "24/7 Security",
    "Balcony",
    "Garden View",
  ];

  const handleAddAmenity = () => {
    if (newAmenity && !amenities.includes(newAmenity)) {
      setValue("amenities", [...amenities, newAmenity], {
        shouldValidate: true,
      });
      setNewAmenity("");
    }
  };

  const handleAddRule = () => {
    if (newRule && !houseRules.includes(newRule)) {
      setValue("house_rules", [...houseRules, newRule], {
        shouldValidate: true,
      });
      setNewRule("");
    }
  };

  const removeAmenity = (amenity) => {
    setValue(
      "amenities",
      amenities.filter((a) => a !== amenity),
      { shouldValidate: true }
    );
  };

  const removeRule = (rule) => {
    setValue(
      "house_rules",
      houseRules.filter((r) => r !== rule),
      { shouldValidate: true }
    );
  };

  const handleCommonAmenityClick = (amenity) => {
    if (!amenities.includes(amenity)) {
      setValue("amenities", [...amenities, amenity], { shouldValidate: true });
    }
  };

  return (
    <div className="space-y-8">
      {/* Amenities Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Amenities</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {commonAmenities.map((amenity) => (
            <button
              type="button"
              key={amenity}
              onClick={() => handleCommonAmenityClick(amenity)}
              className={`p-2 text-sm rounded-md text-left ${
                amenities.includes(amenity)
                  ? "bg-primary-100 text-primary-800"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              {amenity}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newAmenity}
            onChange={(e) => setNewAmenity(e.target.value)}
            placeholder="Add custom amenity"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-900"
          />
          <button
            type="button"
            onClick={handleAddAmenity}
            className="px-4 py-2 bg-primary-900 text-white rounded-md hover:bg-primary-900 flex items-center"
          >
            <FiPlus className="mr-1" /> Add
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {amenities.map((amenity) => (
            <span
              key={amenity}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
            >
              {amenity}
              <button
                type="button"
                onClick={() => removeAmenity(amenity)}
                className="ml-2 text-primary-900 hover:text-primary-800"
              >
                <FiX />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* House Rules Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">House Rules</h3>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newRule}
            onChange={(e) => setNewRule(e.target.value)}
            placeholder="Add a house rule"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-900"
          />
          <button
            type="button"
            onClick={handleAddRule}
            className="px-4 py-2 bg-primary-900 text-white rounded-md hover:bg-primary-900 flex items-center"
          >
            <FiPlus className="mr-1" /> Add
          </button>
        </div>

        <div className="space-y-2">
          {houseRules.map((rule) => (
            <div
              key={rule}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
            >
              <span>{rule}</span>
              <button
                type="button"
                onClick={() => removeRule(rule)}
                className="text-red-500 hover:text-red-700"
              >
                <FiX />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
