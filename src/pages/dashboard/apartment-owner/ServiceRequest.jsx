import { useState } from "react";
import { FiSend, FiTool } from "react-icons/fi";
import toast from "react-hot-toast";
import { formService } from "../../../services/api";
import { lagosLocationData } from "../../../utils/locations";

export default function OwnerServiceRequest() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    description: "",
    address: {
      street: "",
      state: "Lagos",
      localGovernment: "",
      area: "",
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const serviceOptions = [
    "Cleaning",
    "Plumbing",
    "Electrical",
    "Carpentry",
    "Painting",
    "Gardening",
    "Appliance Repair",
    "HVAC",
    "Locksmith",
    "Pest Control",
    "Furniture Assembly",
    "Moving Services",
    "Interior Design",
    "Home Security",
    "Property Maintenance",
    "Deep Cleaning",
    "Renovation Services",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
          // Reset dependent fields when parent changes
          ...(addressField === "localGovernment" && { area: "" }),
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await formService.submitHomeServiceForm({
        ...formData,
        userType: "Property Owner",
      });
      toast.success("Your service request has been submitted successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        description: "",
        address: {
          street: "",
          state: "Lagos",
          localGovernment: "",
          area: "",
        },
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
          <FiTool className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            ApletFix Service Request
          </h1>
          <p className="text-gray-600">
            Request professional services for your properties from vetted
            artisans
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <FiTool className="w-5 h-5 text-orange-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-orange-800">
              Property Owner Services
            </h3>
            <p className="text-sm text-orange-700 mt-1">
              Keep your properties in top condition with our professional
              maintenance and repair services. Perfect for preparing properties
              for new tenants, routine maintenance, or emergency repairs.
            </p>
          </div>
        </div>
      </div>

      {/* Service Request Form */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-6">Request a Service</h2>
        <p className="text-gray-600 mb-8">
          Fill out the form below to request a home service for your property.
          Our team of professionals will get back to you shortly with a quote
          and timeline.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-900 focus:border-primary-900"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-900 focus:border-primary-900"
                placeholder="Your email address"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-900 focus:border-primary-900"
                placeholder="Your phone number"
              />
            </div>
            <div>
              <label
                htmlFor="service"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Service Type *
              </label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-900 focus:border-primary-900"
              >
                <option value="">Select a service</option>
                {serviceOptions.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Property Address Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Property Address
            </h3>

            <div>
              <label
                htmlFor="street"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Street Number and Name *
              </label>
              <input
                type="text"
                id="street"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-900 focus:border-primary-900"
                placeholder="e.g., 123 Main Street"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  State *
                </label>
                <select
                  id="state"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-900 focus:border-primary-900"
                >
                  <option value="Lagos">Lagos</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Currently available in Lagos only
                </p>
              </div>

              <div>
                <label
                  htmlFor="localGovernment"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Local Government *
                </label>
                <select
                  id="localGovernment"
                  name="address.localGovernment"
                  value={formData.address.localGovernment}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-900 focus:border-primary-900"
                >
                  <option value="">Select LGA</option>
                  {Object.keys(lagosLocationData).map((lga) => (
                    <option key={lga} value={lga}>
                      {lga}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="area"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Area *
                </label>
                <select
                  id="area"
                  name="address.area"
                  value={formData.address.area}
                  onChange={handleChange}
                  required
                  disabled={!formData.address.localGovernment}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-900 focus:border-primary-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select Area</option>
                  {formData.address.localGovernment &&
                    lagosLocationData[formData.address.localGovernment]?.map(
                      (area) => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      )
                    )}
                </select>
                {!formData.address.localGovernment && (
                  <p className="text-xs text-gray-500 mt-1">
                    Please select a Local Government first
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Service Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-900 focus:border-primary-900"
              placeholder="Please describe the work needed, including any specific requirements, timeline, or property details..."
            ></textarea>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  <FiSend className="mr-2" /> Submit Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
