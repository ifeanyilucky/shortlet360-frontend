import { propertyTypes } from "../../../../constants";
import { useFormContext } from "react-hook-form";

export default function BasicInfo() {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();

  const propertyCategory = watch("property_category");

  return (
    <div className="space-y-6">
      {/* Property Category Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Property Category
        </label>
        <div className="flex gap-4">
          {/* <label className="flex items-center">
            <input
              type="radio"
              value="shortlet"
              {...register("property_category")}
              className="h-4 w-4 text-primary-900 focus:ring-primary-900 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">Shortlet</span>
          </label> */}
          <label className="flex items-center">
            <input
              type="radio"
              value="rent"
              {...register("property_category")}
              className="h-4 w-4 text-primary-900 focus:ring-primary-900 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">Rent</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="office"
              {...register("property_category")}
              className="h-4 w-4 text-primary-900 focus:ring-primary-900 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">Office</span>
          </label>
        </div>
      </div>

      {/* Property Details Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Property Details
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Name *
            </label>
            <input
              type="text"
              {...register("property_name", {
                required: "Property name is required",
                minLength: {
                  value: 3,
                  message: "Property name must be at least 3 characters",
                },
              })}
              placeholder="Enter property name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-900"
            />
            {errors.property_name && (
              <p className="mt-1 text-sm text-red-600">
                {errors.property_name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Description *
            </label>
            <textarea
              {...register("property_description", {
                required: "Property description is required",
                minLength: {
                  value: 20,
                  message: "Description must be at least 20 characters",
                },
              })}
              placeholder="Describe your property"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-900"
            />
            {errors.property_description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.property_description.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Type *
            </label>
            <select
              {...register("property_type", {
                required: "Please select a property type",
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-900"
            >
              <option value="">Select property type</option>
              {propertyTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.property_type && (
              <p className="mt-1 text-sm text-red-600">
                {errors.property_type.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bedrooms *
              </label>
              <input
                type="number"
                min="0"
                {...register("bedroom_count", {
                  required: "Number of bedrooms is required",
                  min: { value: 0, message: "Cannot be negative" },
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-900"
              />
              {errors.bedroom_count && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.bedroom_count.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bathrooms *
              </label>
              <input
                type="number"
                min="0"
                {...register("bathroom_count", {
                  required: "Number of bathrooms is required",
                  min: { value: 0, message: "Cannot be negative" },
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-900"
              />
              {errors.bathroom_count && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.bathroom_count.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Guests *
              </label>
              <input
                type="number"
                min="1"
                {...register("max_guests", {
                  required: "Maximum number of guests is required",
                  min: { value: 1, message: "Must be at least 1" },
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-900"
              />
              {errors.max_guests && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.max_guests.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Location Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Location</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address *
            </label>
            <input
              type="text"
              {...register("location.street_address", {
                required: "Street address is required",
              })}
              placeholder="Enter street address"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-900"
            />
            {errors.location?.street_address && (
              <p className="mt-1 text-sm text-red-600">
                {errors.location.street_address.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                {...register("location.city", { required: "City is required" })}
                placeholder="Enter city"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-900"
              />
              {errors.location?.city && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.location.city.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State *
              </label>
              <input
                type="text"
                {...register("location.state", {
                  required: "State is required",
                })}
                placeholder="Enter state"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-900"
              />
              {errors.location?.state && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.location.state.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country *
            </label>
            <input
              type="text"
              {...register("location.country", {
                required: "Country is required",
              })}
              placeholder="Enter country"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-900"
            />
            {errors.location?.country && (
              <p className="mt-1 text-sm text-red-600">
                {errors.location.country.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
