import { useState } from "react";
import { FiSend } from "react-icons/fi";
import toast from "react-hot-toast";
import { formService } from "../services/api";
import { lagosLocationData } from "../utils/locations";

export default function HomeServices() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    customService: "",
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
    "Other",
  ];

  const serviceDescriptions = {
    Cleaning:
      "Professional cleaning services for your home, delivered by our experienced and reliable cleaning specialists.",
    Plumbing:
      "Expert plumbing solutions for your home, provided by our qualified and licensed plumbing professionals.",
    Electrical:
      "Seasoned electrical services for your home, handled by our certified and skilled electrical technicians.",
    Carpentry:
      "Proficient carpentry work for your home, crafted by our experienced and detail-oriented carpenters.",
    Painting:
      "Professional painting services for your home, executed by our qualified and artistic painting experts.",
    Gardening:
      "Expert gardening and landscaping services for your home, maintained by our seasoned horticulture specialists.",
    "Appliance Repair":
      "Skilled appliance repair services for your home, performed by our experienced and certified repair technicians.",
    HVAC: "Professional heating, ventilation, and air conditioning services for your home, delivered by our qualified HVAC specialists.",
    Locksmith:
      "Expert locksmith services for your home, provided by our experienced and trusted security professionals.",
    "Pest Control":
      "Seasoned pest control solutions for your home, handled by our qualified and licensed pest management experts.",
    "Furniture Assembly":
      "Proficient furniture assembly services for your home, completed by our skilled and detail-focused assembly specialists.",
    "Moving Services":
      "Professional moving and relocation services for your home, managed by our experienced and reliable moving experts.",
    "Interior Design":
      "Expert interior design consultation for your home, provided by our qualified and creative design professionals.",
    "Home Security":
      "Skilled home security installation and maintenance for your home, delivered by our experienced security system specialists.",
    Other:
      "Specialized services for your home, handled by our qualified and versatile service professionals.",
  };

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
      await formService.submitHomeServiceForm(formData);
      toast.success("Your service request has been submitted successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        customService: "",
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
    <div className="min-h-screen">
      {/* Hero Section - ApletFix */}
      <section className="bg-primary-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                ApletFix
                {/* Your trusted solution for Hassle-free Home Repairs */}
              </h1>
              <p className="text-xl text-primary-100 mb-8 leading-relaxed">
                Need a plumber, electrician, or appliance repair? With ApletFix,
                get connected to vetted, reliable artisans across Nigeria, fast,
                affordable, and stress-free. No hidden charges, no unverified
                technicians. Just trusted home services you can book with a
                click.
              </p>
              <p className="text-lg text-primary-100 font-semibold">
                Book a service today, and get it fixed the right way.
              </p>
              <div className="mt-8">
                <a href="#aplet-fix">
                  <button className="bg-white text-primary-900 px-8 py-4 rounded-full inline-flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium">
                    <span>Request a Service</span>
                    <FiSend className="w-5 h-5" />
                  </button>
                </a>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <img
                src="/images/professional-technician.jpg"
                alt="Professional technician ready to fix home"
                className="rounded-lg shadow-lg max-w-full h-auto"
              />
              <p className="text-lg text-primary-100 font-semibold mt-4 text-center">
                Say goodbye to unprofessional fixes and unattended/overdue
                repairs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Request Form */}
      <section className="py-16 bg-white" id="aplet-fix">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Get Expert Help
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
                    className="w-full px-4 py-2 border border-tertiary-300 rounded-md focus:ring-primary-900 focus:border-primary-900"
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
                    className="w-full px-4 py-2 border border-tertiary-300 rounded-md focus:ring-primary-900 focus:border-primary-900"
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
                    className="w-full px-4 py-2 border border-tertiary-300 rounded-md focus:ring-primary-900 focus:border-primary-900"
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
                    className="w-full px-4 py-2 border border-tertiary-300 rounded-md focus:ring-primary-900 focus:border-primary-900"
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

              {/* Custom Service Field */}
              <div>
                <label
                  htmlFor="customService"
                  className="block text-sm font-medium text-tertiary-700 mb-1"
                >
                  Preferred Service (if not listed above)
                </label>
                <input
                  type="text"
                  id="customService"
                  name="customService"
                  value={formData.customService}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-tertiary-300 rounded-md focus:ring-primary-900 focus:border-primary-900"
                  placeholder="e.g., Pool cleaning, Solar panel installation, etc."
                />
                <p className="text-xs text-tertiary-500 mt-1">
                  If your preferred service is not in the dropdown above, please
                  specify it here
                </p>
              </div>

              {/* Address Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-tertiary-900 border-b border-tertiary-200 pb-2">
                  Service Address
                </h3>

                <div>
                  <label
                    htmlFor="street"
                    className="block text-sm font-medium text-tertiary-700 mb-1"
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
                    className="w-full px-4 py-2 border border-tertiary-300 rounded-md focus:ring-primary-900 focus:border-primary-900"
                    placeholder="e.g., 123 Main Street"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-tertiary-700 mb-1"
                    >
                      State *
                    </label>
                    <select
                      id="state"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-tertiary-300 rounded-md focus:ring-primary-900 focus:border-primary-900"
                    >
                      <option value="Lagos">Lagos</option>
                    </select>
                    <p className="text-xs text-tertiary-500 mt-1">
                      Currently available in Lagos only
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="localGovernment"
                      className="block text-sm font-medium text-tertiary-700 mb-1"
                    >
                      Local Government *
                    </label>
                    <select
                      id="localGovernment"
                      name="address.localGovernment"
                      value={formData.address.localGovernment}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-tertiary-300 rounded-md focus:ring-primary-900 focus:border-primary-900"
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
                      className="block text-sm font-medium text-tertiary-700 mb-1"
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
                      className="w-full px-4 py-2 border border-tertiary-300 rounded-md focus:ring-primary-900 focus:border-primary-900 disabled:bg-tertiary-100 disabled:cursor-not-allowed"
                    >
                      <option value="">Select Area</option>
                      {formData.address.localGovernment &&
                        lagosLocationData[
                          formData.address.localGovernment
                        ]?.map((area) => (
                          <option key={area} value={area}>
                            {area}
                          </option>
                        ))}
                    </select>
                    {!formData.address.localGovernment && (
                      <p className="text-xs text-tertiary-500 mt-1">
                        Please select a Local Government first
                      </p>
                    )}
                  </div>
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
                  className="w-full px-4 py-2 border border-tertiary-300 rounded-md focus:ring-primary-900 focus:border-primary-900"
                  placeholder="Please describe what you need help with..."
                ></textarea>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-900 hover:bg-primary-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-900 disabled:opacity-50 disabled:cursor-not-allowed"
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
                <h3 className="text-xl font-semibold mb-3 text-primary-900">
                  {service}
                </h3>
                <p className="text-tertiary-600">
                  {serviceDescriptions[service]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
