import { useState } from "react";
import { usePaystackPayment } from "react-paystack";
import { paystackConfig } from "../config/paystack";
import { useAuth } from "../hooks/useAuth";
import { formService } from "../services/api";
import toast from "react-hot-toast";
import { FiDollarSign, FiShield } from "react-icons/fi";
import PropTypes from "prop-types";

const DISPUTE_FEE = 2000; // ₦2,000 dispute resolution fee

export default function DisputePayment({ disputeData, onSuccess, onCancel }) {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  // Configure Paystack for dispute payment
  const paymentConfig = paystackConfig({
    email: user?.email || disputeData.email,
    amount: DISPUTE_FEE,
    first_name: user?.first_name || disputeData.name.split(" ")[0],
    last_name:
      user?.last_name || disputeData.name.split(" ").slice(1).join(" "),
    _id: user?._id || "guest",
  });

  // Add dispute-specific metadata
  const disputePaymentConfig = {
    ...paymentConfig,
    metadata: {
      ...paymentConfig.metadata,
      custom_fields: [
        ...paymentConfig.metadata.custom_fields,
        {
          display_name: "Payment Type",
          variable_name: "payment_type",
          value: "dispute_resolution",
        },
        {
          display_name: "Dispute Type",
          variable_name: "dispute_type",
          value: disputeData.disputeType,
        },
        {
          display_name: "Other Party ID",
          variable_name: "other_party_id",
          value: disputeData.otherPartyId || "Not provided",
        },
        {
          display_name: "Urgency Level",
          variable_name: "urgency_level",
          value: disputeData.urgencyLevel,
        },
      ],
    },
  };

  const initializePayment = usePaystackPayment({});

  const handlePaymentSuccess = async (reference) => {
    try {
      setIsProcessing(true);

      // Submit the dispute with payment information
      const disputeSubmission = {
        ...disputeData,
        userRole: user?.role === "owner" ? "Property Owner" : "User",
        paymentReference: reference.reference || reference,
        paymentStatus: "paid",
        amount: DISPUTE_FEE,
      };

      await formService.submitDisputeResolutionForm(disputeSubmission);

      toast.success(
        "Dispute payment successful! Your case has been submitted to our legal team."
      );

      // Call success callback
      if (onSuccess) {
        onSuccess(reference);
      }
    } catch (error) {
      console.error("Error submitting dispute after payment:", error);
      toast.error(
        "Payment successful but failed to submit dispute. Please contact support."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const initiatePayment = () => {
    const onSuccess = (reference) => {
      console.log("Dispute payment successful. Reference:", reference);
      handlePaymentSuccess(reference);
    };

    const onClose = () => {
      console.log("Dispute payment modal closed");
      toast.error("Payment was cancelled");
      if (onCancel) {
        onCancel();
      }
    };

    initializePayment({
      onSuccess,
      onClose,
      config: disputePaymentConfig,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiShield className="w-8 h-8 text-orange-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Dispute Resolution Payment
        </h2>
        <p className="text-gray-600">
          Complete payment to proceed with legal mediation
        </p>
      </div>

      {/* Payment Details */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-600">Service Fee:</span>
          <span className="text-2xl font-bold text-gray-800">
            ₦{DISPUTE_FEE.toLocaleString()}
          </span>
        </div>
        <div className="text-sm text-gray-500">
          <p className="mb-2">This fee covers:</p>
          <ul className="space-y-1 ml-4">
            <li>• Legal review of your case</li>
            <li>• Professional mediation services</li>
            <li>• Documentation and case management</li>
            <li>• Resolution enforcement</li>
          </ul>
        </div>
      </div>

      {/* Dispute Summary */}
      <div className="border rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">Dispute Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Type:</span>
            <span className="text-gray-800">{disputeData.disputeType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Urgency:</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                disputeData.urgencyLevel === "critical"
                  ? "bg-red-100 text-red-800"
                  : disputeData.urgencyLevel === "high"
                  ? "bg-orange-100 text-orange-800"
                  : disputeData.urgencyLevel === "medium"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {disputeData.urgencyLevel.toUpperCase()}
            </span>
          </div>
          {disputeData.otherPartyId && (
            <div className="flex justify-between">
              <span className="text-gray-600">Other Party ID:</span>
              <span className="text-gray-800 font-mono">
                {disputeData.otherPartyId}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Payment Button */}
      <div className="space-y-3">
        <button
          onClick={initiatePayment}
          disabled={isProcessing}
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <FiDollarSign className="w-5 h-5" />
          <span>{isProcessing ? "Processing..." : "Pay with Paystack"}</span>
        </button>

        <button
          onClick={onCancel}
          disabled={isProcessing}
          className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* Security Notice */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          🔒 Secure payment powered by Paystack. Your payment information is
          encrypted and secure.
        </p>
      </div>
    </div>
  );
}

DisputePayment.propTypes = {
  disputeData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    actionType: PropTypes.string.isRequired,
    disputeType: PropTypes.string.isRequired,
    bookingReference: PropTypes.string,
    propertyName: PropTypes.string,
    otherPartyId: PropTypes.string,
    description: PropTypes.string.isRequired,
    urgencyLevel: PropTypes.string.isRequired,
  }).isRequired,
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func,
};
