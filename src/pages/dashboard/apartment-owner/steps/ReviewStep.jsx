import {
  FiHome,
  FiMapPin,
  FiList,
  FiDollarSign,
  FiImage,
  FiCalendar,
} from "react-icons/fi";
import { fCurrency } from "@utils/formatNumber";

export default function ReviewStep({ formData }) {
  // Helper function to render pricing section
  const renderPricingSection = (type, title) => {
    const pricing = formData.pricing[type];
    if (!pricing.is_active) return null;

    return (
      <div className="border-b last:border-b-0 py-3">
        <h4 className="font-medium text-gray-700 mb-2">{title}</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Base Price</p>
            <p className="text-gray-900">{fCurrency(pricing.base_price)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Cleaning Fee</p>
            <p className="text-gray-900">{fCurrency(pricing.cleaning_fee)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">
              Security Deposit
            </p>
            <p className="text-gray-900">
              {fCurrency(pricing.security_deposit)}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Add this helper function at the top of the component
  const getImageUrl = (image) => {
    if (typeof image === "string") return image;
    if (image instanceof File) return URL.createObjectURL(image);
    if (image instanceof Blob) return URL.createObjectURL(image);
    // If it's a base64 string or data URL
    if (typeof image === "string" && image.startsWith("data:")) return image;
    // Fallback to empty string or placeholder
    return "";
  };

  return (
    <div className="space-y-8">
      {/* Basic Info Review */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center mb-4">
          <FiHome className="text-blue-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">
            Property Details
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Name</p>
            <p className="text-gray-900">{formData.property_name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Type</p>
            <p className="text-gray-900">{formData.property_type}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Description</p>
            <p className="text-gray-900">{formData.property_description}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Bedrooms</p>
            <p className="text-gray-900">{formData.bedroom_count}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Bathrooms</p>
            <p className="text-gray-900">{formData.bathroom_count}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Max Guests</p>
            <p className="text-gray-900">{formData.max_guests}</p>
          </div>
        </div>
      </div>

      {/* Location Review */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center mb-4">
          <FiMapPin className="text-blue-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Location</h3>
        </div>
        <p className="text-gray-900">
          {formData.location.street_address}
          <br />
          {formData.location.city}, {formData.location.state}
          <br />
          {formData.location.country}
        </p>
      </div>

      {/* Amenities & Rules Review */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center mb-4">
          <FiList className="text-blue-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">
            Amenities & Rules
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">Amenities</p>
            <div className="flex flex-wrap gap-2">
              {formData.amenities.map((amenity, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">
              House Rules
            </p>
            <ul className="list-disc list-inside">
              {formData.house_rules.map((rule, index) => (
                <li key={index} className="text-gray-900">
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Pricing Review */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center mb-4">
          <FiDollarSign className="text-blue-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Pricing</h3>
        </div>
        <div className="space-y-4">
          {renderPricingSection("per_day", "Daily Pricing")}
          {renderPricingSection("per_week", "Weekly Pricing")}
          {renderPricingSection("per_month", "Monthly Pricing")}
        </div>
      </div>

      {/* Availability Review */}
      {/* <div className="border rounded-lg p-4">
                <div className="flex items-center mb-4">
                    <FiCalendar className="text-blue-500 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">Available Dates</h3>
                </div>
                <div className="space-y-2">
                    {formData.available_dates.map((range, index) => (
                        <div key={index} className="bg-gray-50 p-2 rounded">
                            {new Date(range.start_date).toLocaleDateString()} - {new Date(range.end_date).toLocaleDateString()}
                        </div>
                    ))}
                </div>
            </div> */}

      {/* Images Review */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center mb-4">
          <FiImage className="text-blue-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Images</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {formData.property_images.map((image, index) => (
            <div key={index} className="aspect-square relative">
              <img
                src={getImageUrl(image)}
                alt={`Property ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/400x400?text=Image+Not+Found";
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
