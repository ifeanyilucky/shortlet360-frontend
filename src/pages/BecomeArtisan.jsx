import { useState } from "react";
import {
  FiSend,
  FiClock,
  FiDollarSign,
  FiShield,
  FiUsers,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { formService } from "../services/api";
import { lagosLocationData } from "../utils/locations";

export default function BecomeArtisan() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: {
      street: "",
      state: "Lagos",
      localGovernment: "",
      area: "",
    },
    skillCategory: "",
    experience: "",
    idType: "",
    idNumber: "",
    about: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const skillCategories = [
    "Plumbing",
    "Electrical",
    "Carpentry",
    "Painting",
    "Cleaning",
    "Gardening",
    "HVAC",
    "Appliance Repair",
    "Locksmith",
    "Pest Control",
    "Furniture Assembly",
    "Interior Design",
    "Other",
  ];

  const experienceOptions = [
    "Less than 1 year",
    "1-3 years",
    "3-5 years",
    "5-10 years",
    "More than 10 years",
  ];

  const idTypes = [
    "National ID Card",
    "Driver's License",
    "Voter's Card",
    "International Passport",
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
      await formService.submitBecomeArtisanForm(formData);
      toast.success("Your application has been submitted successfully!");
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        address: {
          street: "",
          state: "Lagos",
          localGovernment: "",
          area: "",
        },
        skillCategory: "",
        experience: "",
        idType: "",
        idNumber: "",
        about: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit your application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: <FiDollarSign className="h-8 w-8 text-primary-900" />,
      title: "Zero Deduction",
      description:
        "Earn 100% of your service charge for every job that you complete with HomeFix.",
    },
    {
      icon: <FiClock className="h-8 w-8 text-primary-900" />,
      title: "Flexible Schedule",
      description:
        "Choose when you work and manage your own availability. You have the option to accept or decline a job based on your availability.",
    },
    {
      icon: <FiUsers className="h-8 w-8 text-primary-900" />,
      title: "Steady Clients",
      description:
        "You have the opportunity to get your calendars fully booked with viable jobs from Aplet360 users.",
    },
    {
      icon: <FiShield className="h-8 w-8 text-primary-900" />,
      title: "Professional Support",
      description:
        "Get support from our team to help you succeed in your work.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Become an Artisan
          </h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Join our network of skilled professionals and grow your business
            with Aplet360
          </p>
        </div>
      </section>

      {/* Become an Artisan Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center lg:order-2">
              <img
                src="images/black-carpenter.webp"
                alt="Skilled artisan at work"
                className="rounded-lg shadow-lg max-w-full h-auto"
              />
            </div>
            <div className="lg:order-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary-900">
                Join Aplet360&apos;s HomeFix Network - Earn More, Work Freely
              </h2>
              <p className="text-lg text-tertiary-700 mb-8 leading-relaxed">
                Are you a skilled artisan or technician looking to expand beyond
                where you are currently and increase your income? Becoming an
                Artisan for Aplet360 is the best option for you. You can
                register to receive verified job requests directly with zero
                commission cuts. Just pay an affordable monthly fee to stay
                active and visible on our dashboard while you keep 100% of what
                you earn. No hidden charges, no middlemen, just real work from
                real customers (Users of Aplet360).
              </p>
              <p className="text-lg text-tertiary-700 mb-8 leading-relaxed">
                Whether you are a plumber, electrician, painter, or tiler or
                name it, we connect you to clients who need your expertise. Join
                Aplet360 today and enjoy freedom, flexibility, and full earnings
                on every job you complete. Let&apos;s build your business
                together.
              </p>
              <div className="flex justify-center lg:justify-start">
                <a
                  href="#apply"
                  className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                >
                  Become an Artisan
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Why Join Aplet360
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-tertiary-50 p-6 rounded-lg text-center"
              >
                <div className="flex justify-center mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-tertiary-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 bg-tertiary-50" id="apply">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Apply to Join Our Artisan Network
            </h2>
            <p className="text-tertiary-600 mb-8 text-center">
              Fill out the form below to apply as an artisan. Our team will
              review your application and get back to you within 48 hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-tertiary-700 mb-1"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
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
              </div>

              {/* Address Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-tertiary-900 border-b border-tertiary-200 pb-2">
                  Address Information
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="skillCategory"
                    className="block text-sm font-medium text-tertiary-700 mb-1"
                  >
                    Skill Category *
                  </label>
                  <select
                    id="skillCategory"
                    name="skillCategory"
                    value={formData.skillCategory}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-tertiary-300 rounded-md focus:ring-primary-900 focus:border-primary-900"
                  >
                    <option value="">Select your skill category</option>
                    {skillCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="experience"
                    className="block text-sm font-medium text-tertiary-700 mb-1"
                  >
                    Years of Experience *
                  </label>
                  <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-tertiary-300 rounded-md focus:ring-primary-900 focus:border-primary-900"
                  >
                    <option value="">Select your experience</option>
                    {experienceOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="idType"
                    className="block text-sm font-medium text-tertiary-700 mb-1"
                  >
                    ID Type *
                  </label>
                  <select
                    id="idType"
                    name="idType"
                    value={formData.idType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-tertiary-300 rounded-md focus:ring-primary-900 focus:border-primary-900"
                  >
                    <option value="">Select ID type</option>
                    {idTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="idNumber"
                    className="block text-sm font-medium text-tertiary-700 mb-1"
                  >
                    ID Number *
                  </label>
                  <input
                    type="text"
                    id="idNumber"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-tertiary-300 rounded-md focus:ring-primary-900 focus:border-primary-900"
                    placeholder="Your ID number"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="about"
                  className="block text-sm font-medium text-tertiary-700 mb-1"
                >
                  Tell Us About Yourself *
                </label>
                <textarea
                  id="about"
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-tertiary-300 rounded-md focus:ring-primary-900 focus:border-primary-900"
                  placeholder="Describe your skills, experience, and why you want to join our network..."
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
                      <FiSend className="mr-2" /> Submit Application
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
