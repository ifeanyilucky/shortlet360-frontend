import { useState } from "react";
import { FiX, FiUser, FiMail, FiPhone, FiMapPin, FiBriefcase } from "react-icons/fi";
import toast from "react-hot-toast";
import { formService } from "../services/api";

const RNPLWaitlistForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    occupation: "",
    address: "",
    jobType: "",
    monthlyIncome: "",
    currentRentAmount: "",
    preferredLocation: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const jobTypeOptions = [
    "Employed",
    "Self-Employed", 
    "Business Owner",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Submit form data to API
      await formService.submitRNPLWaitlistForm(formData);

      // Show success message
      toast.success("You've been added to our RNPL waitlist! We'll notify you when the service launches.");
      
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        occupation: "",
        address: "",
        jobType: "",
        monthlyIncome: "",
        currentRentAmount: "",
        preferredLocation: "",
      });

      // Close modal after success
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error submitting RNPL waitlist form:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to join waitlist. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-tertiary-900">
              Join RNPL Waitlist
            </h2>
            <p className="text-tertiary-600 mt-1">
              Pre-qualify for our Rent Now Pay Later solution
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-tertiary-400 hover:text-tertiary-600 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-tertiary-900 flex items-center gap-2">
              <FiUser className="text-primary-900" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-tertiary-700 mb-2">
                  Full Name*
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-tertiary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-900"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-tertiary-700 mb-2">
                  Email Address*
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-tertiary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-900"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-tertiary-700 mb-2">
                  Phone Number*
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-tertiary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-900"
                  placeholder="+234 800 000 0000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-tertiary-700 mb-2">
                  Occupation*
                </label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-tertiary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-900"
                  placeholder="e.g., Software Engineer, Teacher, etc."
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-tertiary-700 mb-2">
                Current Address*
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border border-tertiary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-900"
                placeholder="Enter your current residential address"
                required
              />
            </div>
          </div>

          {/* Employment Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-tertiary-900 flex items-center gap-2">
              <FiBriefcase className="text-primary-900" />
              Employment Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-tertiary-700 mb-2">
                  Job Type*
                </label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-tertiary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-900"
                  required
                >
                  <option value="">Select job type</option>
                  {jobTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-tertiary-700 mb-2">
                  Monthly Income Range
                </label>
                <select
                  name="monthlyIncome"
                  value={formData.monthlyIncome}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-tertiary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-900"
                >
                  <option value="">Select income range</option>
                  <option value="Below ₦100,000">Below ₦100,000</option>
                  <option value="₦100,000 - ₦300,000">₦100,000 - ₦300,000</option>
                  <option value="₦300,000 - ₦500,000">₦300,000 - ₦500,000</option>
                  <option value="₦500,000 - ₦1,000,000">₦500,000 - ₦1,000,000</option>
                  <option value="Above ₦1,000,000">Above ₦1,000,000</option>
                </select>
              </div>
            </div>
          </div>

          {/* Rental Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-tertiary-900 flex items-center gap-2">
              <FiMapPin className="text-primary-900" />
              Rental Preferences
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-tertiary-700 mb-2">
                  Current Rent Amount (Optional)
                </label>
                <input
                  type="text"
                  name="currentRentAmount"
                  value={formData.currentRentAmount}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-tertiary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-900"
                  placeholder="e.g., ₦500,000 per year"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-tertiary-700 mb-2">
                  Preferred Location
                </label>
                <input
                  type="text"
                  name="preferredLocation"
                  value={formData.preferredLocation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-tertiary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-900"
                  placeholder="e.g., Lagos Island, Lekki, etc."
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-tertiary-300 text-tertiary-700 rounded-md hover:bg-tertiary-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-primary-900 text-white rounded-md hover:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Joining Waitlist...
                </>
              ) : (
                "Join Waitlist"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RNPLWaitlistForm;
