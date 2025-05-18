import { useState } from "react";
import { FiSend } from "react-icons/fi";
import toast from "react-hot-toast";
import { formService } from "../services/api";

export default function HomeServices() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    description: "",
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
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await formService.submitHomeServiceForm(formData);
      toast.success("Your service request has been submitted successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        description: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Home Services</h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Professional home services to keep your living space in perfect
            condition.
          </p>
        </div>
      </section>

      {/* Service Request Form */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Request a Service
            </h2>
            <p className="text-tertiary-600 mb-8 text-center">
              Fill out the form below to request a home service. Our team of
              professionals will get back to you shortly.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-tertiary-700 mb-1"
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
                    className="w-full px-4 py-2 border border-tertiary-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-tertiary-700 mb-1"
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
                    className="w-full px-4 py-2 border border-tertiary-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Your email address"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-tertiary-700 mb-1"
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
                    className="w-full px-4 py-2 border border-tertiary-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Your phone number"
                  />
                </div>
                <div>
                  <label
                    htmlFor="service"
                    className="block text-sm font-medium text-tertiary-700 mb-1"
                  >
                    Service Type *
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-tertiary-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
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

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-tertiary-700 mb-1"
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
                  className="w-full px-4 py-2 border border-tertiary-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Please describe what you need help with..."
                ></textarea>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
      </section>

      {/* Services Overview */}
      <section className="py-16 bg-tertiary-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Our Home Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {serviceOptions.slice(0, 9).map((service) => (
              <div
                key={service}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-3 text-primary-600">
                  {service}
                </h3>
                <p className="text-tertiary-600">
                  Professional {service.toLowerCase()} services for your home,
                  delivered by our vetted and skilled artisans.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
