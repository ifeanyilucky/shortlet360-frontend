import { useState } from "react";
import {
  FiSend,
  FiShield,
  FiAlertTriangle,
  FiDollarSign,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { formService } from "../../../services/api";
import DisputePayment from "../../../components/DisputePayment";

export default function DisputeResolution() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    actionType: "", // "report" or "dispute"
    disputeType: "",
    bookingReference: "",
    propertyName: "",
    otherPartyId: "", // ID of landlord/tenant
    description: "",
    urgencyLevel: "medium",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const disputeTypes = [
    "Property Condition Issues",
    "Payment Disputes",
    "Booking Cancellation Issues",
    "Host/Owner Communication Problems",
    "Safety and Security Concerns",
    "Cleanliness Issues",
    "Amenities Not as Described",
    "Overcharging/Hidden Fees",
    "Refund Issues",
    "Property Access Problems",
    "Noise Complaints",
    "Other",
  ];

  const urgencyLevels = [
    { value: "low", label: "Low - General inquiry", color: "text-green-600" },
    {
      value: "medium",
      label: "Medium - Standard issue",
      color: "text-yellow-600",
    },
    { value: "high", label: "High - Urgent matter", color: "text-orange-600" },
    { value: "critical", label: "Critical - Emergency", color: "text-red-600" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Show modal when user selects "dispute"
    if (name === "actionType" && value === "dispute") {
      setShowDisputeModal(true);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDisputeConfirm = () => {
    setShowDisputeModal(false);
    // Keep the dispute selection
  };

  const handleDisputeCancel = () => {
    setShowDisputeModal(false);
    setFormData((prev) => ({
      ...prev,
      actionType: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (formData.actionType === "dispute") {
        // For disputes, show payment component
        setShowPayment(true);
        setIsSubmitting(false);
        return;
      }

      // For reports, submit directly
      await formService.submitDisputeResolutionForm({
        ...formData,
        userRole: "User",
      });

      toast.success(
        "Your report has been submitted successfully! Our team will contact you within 24 hours."
      );

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        actionType: "",
        disputeType: "",
        bookingReference: "",
        propertyName: "",
        otherPartyId: "",
        description: "",
        urgencyLevel: "medium",
      });
    } catch (error) {
      console.error("Error submitting:", error);
      toast.error("Failed to submit your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      actionType: "",
      disputeType: "",
      bookingReference: "",
      propertyName: "",
      otherPartyId: "",
      description: "",
      urgencyLevel: "medium",
    });
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
  };

  // Show payment component if dispute is selected
  if (showPayment) {
    return (
      <div className="p-4 md:p-6">
        <DisputePayment
          disputeData={formData}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
        />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <FiShield className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            User Protect - Dispute Resolution
          </h1>
          <p className="text-gray-600">
            Get help resolving issues with your bookings or property experiences
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <FiAlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">
              How User Protect Works
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              Our User Protect service ensures fair resolution of disputes
              between guests and property owners. Submit your concern below and
              our mediation team will investigate and work towards a fair
              solution within 24-48 hours.
            </p>
          </div>
        </div>
      </div>

      {/* Dispute Form */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-6">Submit a Dispute</h2>
        <p className="text-gray-600 mb-8">
          Please provide detailed information about your dispute. The more
          information you provide, the better we can assist you in resolving the
          issue.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Action Type Selection */}
          <div>
            <label
              htmlFor="actionType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Action *
            </label>
            <select
              id="actionType"
              name="actionType"
              value={formData.actionType}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choose an action</option>
              <option value="report">Report an Issue (Free)</option>
              <option value="dispute">
                Enter a Dispute (₦2,000 - Involves Legal Team)
              </option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Reports are free and handled by our support team. Disputes involve
              our legal team and cost ₦2,000.
            </p>
          </div>

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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your phone number"
              />
            </div>
            <div>
              <label
                htmlFor="disputeType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Dispute Type *
              </label>
              <select
                id="disputeType"
                name="disputeType"
                value={formData.disputeType}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select dispute type</option>
                {disputeTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="bookingReference"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Booking Reference
              </label>
              <input
                type="text"
                id="bookingReference"
                name="bookingReference"
                value={formData.bookingReference}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., APL123456"
              />
              <p className="text-xs text-gray-500 mt-1">
                If applicable, provide your booking reference number
              </p>
            </div>
            <div>
              <label
                htmlFor="propertyName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Property Name
              </label>
              <input
                type="text"
                id="propertyName"
                name="propertyName"
                value={formData.propertyName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Name of the property"
              />
            </div>
            <div>
              <label
                htmlFor="otherPartyId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Landlord/Owner ID {formData.actionType === "dispute" && "*"}
              </label>
              <input
                type="text"
                id="otherPartyId"
                name="otherPartyId"
                value={formData.otherPartyId}
                onChange={handleChange}
                required={formData.actionType === "dispute"}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., USR123456"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.actionType === "dispute"
                  ? "Required for disputes - Enter the ID of the landlord/owner"
                  : "Optional - Enter the ID of the landlord/owner if known"}
              </p>
            </div>
          </div>

          <div>
            <label
              htmlFor="urgencyLevel"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Urgency Level *
            </label>
            <select
              id="urgencyLevel"
              name="urgencyLevel"
              value={formData.urgencyLevel}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              {urgencyLevels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Detailed Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Please provide a detailed description of the issue, including dates, times, and any relevant circumstances..."
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">
              Include as much detail as possible to help us understand and
              resolve your dispute quickly
            </p>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  <FiSend className="mr-2" /> Submit Dispute
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Contact Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-800 mb-2">
          Need Immediate Assistance?
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          For urgent matters, you can also contact our support team directly:
        </p>
        <div className="text-sm text-gray-600">
          <p>📧 Email: support@aplet360.com</p>
          <p>📞 Phone: 09038775464</p>
          <p>🕒 Hours: Monday - Friday, 8:00 AM - 6:00 PM</p>
        </div>
      </div>

      {/* Dispute Confirmation Modal */}
      {showDisputeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-90">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <FiDollarSign className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Dispute Resolution Fee
              </h3>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Entering a dispute involves our legal team and costs{" "}
                <strong>₦2,000</strong>. This fee covers:
              </p>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Legal review of your case</li>
                <li>• Professional mediation services</li>
                <li>• Documentation and case management</li>
                <li>• Resolution enforcement</li>
              </ul>
              <p className="text-sm text-gray-500 mt-4">
                You will be redirected to the payment page to complete the
                ₦2,000 fee before your dispute is processed.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleDisputeCancel}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDisputeConfirm}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Continue with Dispute
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
