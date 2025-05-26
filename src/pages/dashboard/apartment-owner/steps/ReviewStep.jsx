import {
  FiHome,
  FiMapPin,
  FiList,
  FiDollarSign,
  FiImage,
  FiCalendar,
} from "react-icons/fi";
import { fCurrency } from "@utils/formatNumber";

export default function ReviewStep({ formData = {} }) {
  // Helper function to render shortlet pricing section
  const renderShortletPricingSection = (type, title) => {
    const pricing = formData?.pricing?.[type] || {};
    if (!pricing.is_active) return null;
    console.log({ pricing, type, title });
    return (
      <div className="border-b last:border-b-0 py-3">
        <h4 className="font-medium text-gray-700 mb-2">{title}</h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Base Price</p>
            <p className="text-gray-900">
              {fCurrency(pricing.base_price || 0)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Cleaning Fee</p>
            <p className="text-gray-900">
              {fCurrency(pricing.cleaning_fee || 0)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">
              Security Deposit
            </p>
            <p className="text-gray-900">
              {fCurrency(pricing.security_deposit || 0)}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Helper function to render rental pricing section
  const renderRentalPricingSection = () => {
    const rental = formData?.pricing?.rent_per_year || {};
    if (!rental.is_active) return null;

    return (
      <div className="border-b last:border-b-0 py-3">
        <h4 className="font-medium text-gray-700 mb-2">Annual Rental</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Annual Rent</p>
            <p className="text-gray-900">
              {fCurrency(rental.annual_rent || 0)}
            </p>
          </div>
          {rental.is_agency_fee_active && (
            <div>
              <p className="text-sm font-medium text-gray-500">Agency Fee</p>
              <p className="text-gray-900">
                {fCurrency(rental.agency_fee || 0)}
              </p>
            </div>
          )}
          {rental.is_commission_fee_active && (
            <div>
              <p className="text-sm font-medium text-gray-500">
                Commission Fee
              </p>
              <p className="text-gray-900">
                {fCurrency(rental.commission_fee || 0)}
              </p>
            </div>
          )}
          {rental.is_caution_fee_active && (
            <div>
              <p className="text-sm font-medium text-gray-500">Caution Fee</p>
              <p className="text-gray-900">
                {fCurrency(rental.caution_fee || 0)}
              </p>
            </div>
          )}
          {rental.is_legal_fee_active && (
            <div>
              <p className="text-sm font-medium text-gray-500">Legal Fee</p>
              <p className="text-gray-900">
                {fCurrency(rental.legal_fee || 0)}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Helper function to get image URL
  const getImageUrl = (image) => {
    if (!image) return "https://via.placeholder.com/400x400?text=No+Image";

    // If it's a File object (new upload)
    if (image instanceof File) return URL.createObjectURL(image);
    if (image instanceof Blob) return URL.createObjectURL(image);

    // If it's an existing image with preview property
    if (image.preview) {
      // If preview is an object with url property (from backend)
      if (typeof image.preview === "object" && image.preview.url) {
        return image.preview.url;
      }
      // If preview is a string (direct URL)
      if (typeof image.preview === "string") {
        return image.preview;
      }
    }

    // If image itself is an object with url property
    if (typeof image === "object" && image.url) {
      return image.url;
    }

    // If it's a direct string URL
    if (typeof image === "string") return image;

    // If it's a data URL
    if (typeof image === "string" && image.startsWith("data:")) return image;

    return "https://via.placeholder.com/400x400?text=Invalid+Image";
  };

  const location = formData?.location || {};
  const amenities = formData?.amenities || [];
  const houseRules = formData?.house_rules || [];
  const propertyImages = formData?.property_images || [];
  console.log({ formData });
  return (
    <div className="space-y-8">
      {/* Basic Info Review */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center mb-4">
          <FiHome className="text-primary-900 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">
            Property Details
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Name</p>
            <p className="text-gray-900">
              {formData?.property_name || "Not specified"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Type</p>
            <p className="text-gray-900">
              {formData?.property_type || "Not specified"}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-sm font-medium text-gray-500">Description</p>
            <p className="text-gray-900">
              {formData?.property_description || "No description provided"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Bedrooms</p>
            <p className="text-gray-900">{formData?.bedroom_count || 0}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Bathrooms</p>
            <p className="text-gray-900">{formData?.bathroom_count || 0}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Max Guests</p>
            <p className="text-gray-900">{formData?.max_guests || 0}</p>
          </div>
        </div>
      </div>

      {/* Location Review */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center mb-4">
          <FiMapPin className="text-primary-900 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Location</h3>
        </div>
        <p className="text-gray-900">
          {location.street_address || "No street address"}
          <br />
          {location.city && location.state
            ? `${location.city}, ${location.state}`
            : "No city/state"}
          <br />
          {location.country || "No country"}
        </p>
      </div>

      {/* Amenities & Rules Review */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center mb-4">
          <FiList className="text-primary-900 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">
            Amenities & Rules
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">Amenities</p>
            <div className="flex flex-wrap gap-2">
              {amenities.length > 0 ? (
                amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                  >
                    {amenity}
                  </span>
                ))
              ) : (
                <p className="text-gray-500 italic">No amenities specified</p>
              )}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">
              House Rules
            </p>
            {houseRules.length > 0 ? (
              <ul className="list-disc list-inside">
                {houseRules.map((rule, index) => (
                  <li key={index} className="text-gray-900">
                    {rule}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No house rules specified</p>
            )}
          </div>
        </div>
      </div>

      {/* Updated Pricing Review */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center mb-4">
          <span>
            <svg
              id="Layer_1"
              data-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 115.09 122.88"
            >
              <title>nigeria-naira</title>
              <path d="M13.42,0H32.1a1.25,1.25,0,0,1,1,.6L58,42.26H83.17v-41A1.23,1.23,0,0,1,84.39,0h17.28a1.23,1.23,0,0,1,1.23,1.23v41h11a1.23,1.23,0,0,1,1.23,1.23V54.55a1.23,1.23,0,0,1-1.23,1.23h-11v9.41h11a1.23,1.23,0,0,1,1.23,1.22V77.48a1.23,1.23,0,0,1-1.23,1.22h-11v43a1.23,1.23,0,0,1-1.23,1.23H84.39a1.25,1.25,0,0,1-1-.6L58,78.7H33.26v43A1.23,1.23,0,0,1,32,122.88H13.42a1.23,1.23,0,0,1-1.23-1.23V78.7h-11A1.23,1.23,0,0,1,0,77.48V66.41a1.23,1.23,0,0,1,1.23-1.22h11V55.78h-11A1.23,1.23,0,0,1,0,54.55V43.49a1.23,1.23,0,0,1,1.23-1.23h11v-41A1.23,1.23,0,0,1,13.42,0ZM33.26,55.78v9.41h17l-4.4-9.41ZM70,65.19H83.17V55.78H65.68L70,65.19ZM83.17,78.7H77.88l5.29,11v-11ZM33.26,32.76v9.5h4.57l-4.57-9.5Z" />
            </svg>
          </span>
          <h3 className="text-lg font-medium text-gray-900">Pricing</h3>
        </div>
        <div className="space-y-4">
          {formData.property_category === "rent" ? (
            renderRentalPricingSection()
          ) : (
            // Shortlet pricing sections
            <>
              {renderShortletPricingSection("per_day", "Daily Pricing")}
              {renderShortletPricingSection("per_week", "Weekly Pricing")}
              {renderShortletPricingSection("per_month", "Monthly Pricing")}
            </>
          )}
        </div>
      </div>

      {/* Images Review */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center mb-4">
          <FiImage className="text-primary-900 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Images</h3>
        </div>
        {propertyImages.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {propertyImages.map((image, index) => (
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
        ) : (
          <p className="text-gray-500 italic text-center py-8">
            No images uploaded yet
          </p>
        )}
      </div>
    </div>
  );
}
