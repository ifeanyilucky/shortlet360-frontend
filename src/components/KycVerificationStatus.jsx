import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import useKycStore from "../store/kycStore";
import {
  HiShieldCheck,
  HiShieldExclamation,
  HiExclamationCircle,
} from "react-icons/hi";
import InteractiveButton from "./InteractiveButton";

/**
 * KYC Verification Status component
 * @param {Object} props
 * @param {string} props.requiredTier - The required KYC tier ("tier1", "tier2", or "tier3")
 * @param {string} props.actionText - Text to display on the action button
 * @param {Function} props.onVerified - Callback function when KYC is verified
 * @param {boolean} props.showButton - Whether to show the action button (default: true)
 * @param {string} props.className - Additional CSS classes
 */
export default function KycVerificationStatus({
  requiredTier = "tier1",
  actionText = "Continue",
  onVerified,
  showButton = true,
  className = "",
}) {
  const { user } = useAuth();
  const { kycStatus, getKycStatus, isLoading } = useKycStore();
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKycStatus = async () => {
      try {
        await getKycStatus();
      } catch (error) {
        console.error("Error fetching KYC status:", error);
      }
    };

    fetchKycStatus();
  }, [getKycStatus]);

  useEffect(() => {
    if (kycStatus) {
      // Check if the required tier is verified
      const tierVerified = kycStatus[requiredTier]?.status === "verified";
      setIsVerified(tierVerified);

      // Call onVerified callback if KYC is verified
      if (tierVerified && onVerified) {
        onVerified();
      }
    }
  }, [kycStatus, requiredTier, onVerified]);

  const handleCompleteKyc = () => {
    navigate(`/${user.role}/settings/kyc`);
  };

  // If still loading, show a loading state
  if (isLoading) {
    return (
      <div className={`bg-gray-50 p-4 rounded-lg ${className}`}>
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-300 h-10 w-10"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  // If KYC is verified, show success message
  if (isVerified) {
    return (
      <div
        className={`bg-green-50 p-4 rounded-lg flex items-start ${className}`}
      >
        <HiShieldCheck className="text-green-500 w-6 h-6 mr-3 mt-0.5" />
        <div>
          <h3 className="font-medium text-green-800">
            KYC Verification Complete
          </h3>
          <p className="text-sm text-green-600 mt-1">
            Your KYC verification has been successfully completed.
          </p>
          {showButton && onVerified && (
            <InteractiveButton onClick={onVerified} className="mt-3">
              {actionText}
            </InteractiveButton>
          )}
        </div>
      </div>
    );
  }

  // If KYC is pending, show pending message
  if (kycStatus && kycStatus[requiredTier]?.status === "pending") {
    return (
      <div
        className={`bg-yellow-50 p-4 rounded-lg flex items-start ${className}`}
      >
        <HiShieldExclamation className="text-yellow-500 w-6 h-6 mr-3 mt-0.5" />
        <div>
          <h3 className="font-medium text-yellow-800">
            KYC Verification Pending
          </h3>
          <p className="text-sm text-yellow-600 mt-1">
            Your KYC verification is currently being processed. This may take
            24-48 hours.
          </p>
          <InteractiveButton
            onClick={handleCompleteKyc}
            size="small"
            className="mt-3"
          >
            Check Status
          </InteractiveButton>
        </div>
      </div>
    );
  }

  // If KYC is not started or rejected, show action required message
  return (
    <div className={`bg-red-50 p-4 rounded-lg flex items-start ${className}`}>
      <HiExclamationCircle className="text-red-500 w-6 h-6 mr-3 mt-0.5" />
      <div>
        <h3 className="font-medium text-red-800">KYC Verification Required</h3>
        <p className="text-sm text-red-600 mt-1">
          {requiredTier === "tier1" &&
            "Basic verification (phone number and NIN) is required to proceed."}
          {requiredTier === "tier2" &&
            "Identity verification (address and NIN) is required to proceed."}
          {requiredTier === "tier3" &&
            "Financial verification (employment and bank statement) is required to proceed."}
        </p>
        <InteractiveButton onClick={handleCompleteKyc} className="mt-3">
          Complete Verification
        </InteractiveButton>
      </div>
    </div>
  );
}
