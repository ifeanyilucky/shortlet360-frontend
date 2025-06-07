import { useState } from "react";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiMessageSquare,
} from "react-icons/fi";
import {
  BsTwitterX,
  BsWhatsapp,
  BsFacebook,
  BsLinkedin,
  BsInstagram,
  BsYoutube,
} from "react-icons/bs";
import InteractiveButton from "../components/InteractiveButton";
import { Link } from "react-router-dom";
import { formService } from "../services/api";
import { toast } from "react-hot-toast";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
      // Submit form data to API
      await formService.submitContactForm(formData);

      // Show success message
      toast.success("Your message has been sent successfully!");
      setSubmitSuccess(true);

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to send message. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            We're here to help with all your apartment rental needs. Reach out
            to our team.
          </p>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>

              {submitSuccess ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                  Thank you for your message! We'll get back to you shortly.
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name*
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-900"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address*
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-900"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-900"
                      placeholder="+234 123 456 7890"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject*
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-900"
                      placeholder="How can we help you?"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Message*
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-900"
                    placeholder="Please provide details about your inquiry..."
                    required
                  ></textarea>
                </div>

                <div>
                  <InteractiveButton
                    type="submit"
                    isLoading={isSubmitting}
                    className="w-full md:w-auto px-8"
                  >
                    Send Message
                  </InteractiveButton>
                </div>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>

              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiMapPin className="w-6 h-6 text-primary-900" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Our Office</h3>
                    <p className="text-gray-600">
                      38, Opebi Road, Adebola House,
                      <br /> Ikeja Lagos.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiPhone className="w-6 h-6 text-primary-900" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Phone Number</h3>
                    <p className="text-gray-600">09122842288</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiMail className="w-6 h-6 text-primary-900" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Email Addresses
                    </h3>
                    <p className="text-gray-600 mb-1">
                      General Inquiries: info@aplet360.com
                    </p>
                    <p className="text-gray-600 mb-1">
                      Support: support@aplet360.com
                    </p>
                    <p className="text-gray-600 mb-1">
                      Careers: careers@aplet360.com
                    </p>
                    <p className="text-gray-600">
                      Operations: operations@aplet360.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiClock className="w-6 h-6 text-primary-900" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Business Hours
                    </h3>
                    <p className="text-gray-600 mb-1">
                      Monday - Friday: 8:00 AM - 6:00 PM
                    </p>
                    <p className="text-gray-600">Saturday: 9:00 AM - 3:00 PM</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Connect With Us
                  </h3>
                  <div className="flex space-x-4">
                    <a
                      href="https://www.linkedin.com/company/aplet360/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center hover:bg-primary-200 transition-colors"
                    >
                      <BsLinkedin className="w-5 h-5 text-primary-900" />
                    </a>
                    <a
                      href="https://www.instagram.com/aplet360properties?igsh=MWpqZGl4OW9sbTkzYQ%3D%3D&utm_source=qr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center hover:bg-primary-200 transition-colors"
                    >
                      <BsInstagram className="w-5 h-5 text-primary-900" />
                    </a>
                    <a
                      href="https://www.facebook.com/share/1ATyYoWpQF/?mibextid=wwXIfr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center hover:bg-primary-200 transition-colors"
                    >
                      <BsFacebook className="w-5 h-5 text-primary-900" />
                    </a>
                    <a
                      href="https://x.com/aplet360?s=21"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center hover:bg-primary-200 transition-colors"
                    >
                      <BsTwitterX className="w-5 h-5 text-primary-900" />
                    </a>
                    <a
                      href="https://youtube.com/@aplet360?si=xlxqbodjVnmvdXb8"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center hover:bg-primary-200 transition-colors"
                    >
                      <BsYoutube className="w-5 h-5 text-primary-900" />
                    </a>
                    <a
                      href="https://wa.me/2349122842288"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center hover:bg-primary-200 transition-colors"
                    >
                      <BsWhatsapp className="w-5 h-5 text-primary-900" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Find Us</h2>
          <div className="h-96 bg-gray-200 rounded-lg overflow-hidden">
            {/* Placeholder for map - in a real implementation, you would use Google Maps or similar */}
            <div className="w-full h-full flex items-center justify-center bg-primary-100">
              <FiMapPin className="w-16 h-16 text-primary-900" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Find quick answers to common questions about our services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <FiMessageSquare className="w-5 h-5 mr-2 text-primary-900" />
                How do I rent an apartment?
              </h3>
              <p className="text-gray-600">
                Browse our listings, select an apartment, choose your preferred
                payment option, and complete the booking process. Our team will
                guide you through the rest.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <FiMessageSquare className="w-5 h-5 mr-2 text-primary-900" />
                What payment options are available?
              </h3>
              <p className="text-gray-600">
                We offer two monthly payment options: Option 1 with 1.5% monthly
                interest of yearly rent paid monthly (18% annually) or Option 2
                with 2% monthly interest of yearly rent paid monthly (24%
                annually).
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <FiMessageSquare className="w-5 h-5 mr-2 text-primary-900" />
                How long is the rental process?
              </h3>
              <p className="text-gray-600">
                Our streamlined process typically takes just 4 minutes to
                complete a booking. Move-in can be arranged as quickly as 24-48
                hours after approval.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <FiMessageSquare className="w-5 h-5 mr-2 text-primary-900" />
                Do you offer short-term stays?
              </h3>
              <p className="text-gray-600">
                Yes, while we focus on apartment rentals, we also offer
                short-term accommodations for those needing temporary housing
                solutions.
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              to="/faq"
              className="text-primary-900 font-medium inline-flex items-center hover:underline"
            >
              View All FAQs
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Find Your Perfect Apartment?
          </h2>
          <p className="max-w-3xl mx-auto mb-8 text-primary-100">
            Browse our selection of quality apartments with flexible payment
            options designed to suit your needs.
          </p>
          <Link to="/book-now">
            <button className="bg-white text-primary-900 px-8 py-3 rounded-full font-medium hover:bg-primary-50 transition-colors">
              Browse Apartments
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
