import { useState } from "react";
import {
  FiSend,
  FiTool,
  FiClock,
  FiDollarSign,
  FiShield,
  FiUsers,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { formService } from "../services/api";

export default function BecomeArtisan() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        address: "",
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
      icon: <FiDollarSign className="h-8 w-8 text-primary-500" />,
      title: "Competitive Pay",
      description:
        "Earn competitive rates for your services with transparent payment terms.",
    },
    {
      icon: <FiClock className="h-8 w-8 text-primary-500" />,
      title: "Flexible Schedule",
      description: "Choose when you work and manage your own availability.",
    },
    {
      icon: <FiUsers className="h-8 w-8 text-primary-500" />,
      title: "Steady Clients",
      description:
        "Access a large customer base without having to find clients yourself.",
    },
    {
      icon: <FiShield className="h-8 w-8 text-primary-500" />,
      title: "Professional Support",
      description:
        "Get support from our team to help you succeed in your work.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary-500 text-white py-20">
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
      <section className="py-16 bg-tertiary-50">
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
                    htmlFor="address"
                    className="block text-sm font-medium text-tertiary-700 mb-1"
                  >
                    Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-tertiary-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Your residential address"
                  />
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
                    className="w-full px-4 py-2 border border-tertiary-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
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
                    className="w-full px-4 py-2 border border-tertiary-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
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
                    className="w-full px-4 py-2 border border-tertiary-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
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
                    className="w-full px-4 py-2 border border-tertiary-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
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
                  className="w-full px-4 py-2 border border-tertiary-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Describe your skills, experience, and why you want to join our network..."
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
