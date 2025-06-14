import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HiShieldCheck,
  HiShieldExclamation,
  HiExclamationCircle,
  HiPhone,
  HiDocumentText,
  HiCreditCard,
} from "react-icons/hi";
import { useAuth } from "../hooks/useAuth";
import useKycStore from "../store/kycStore";

/**
 * KYC Progress Indicator component for dashboards
 * Shows the current KYC verification status and progress based on user role
 */
export default function KycProgressIndicator() {
  const { user } = useAuth();
  const { kycStatus, getKycStatus, isLoading } = useKycStore();
  const [progress, setProgress] = useState(0);

  // Get required tiers based on user role
  const getRequiredTiers = () => {
    if (user?.role === "apartment_owner") {
      return ["tier1", "tier2"]; // Owners must complete Tier 1 + Tier 2
    } else {
      return ["tier1"]; // Users only need Tier 1
    }
  };

  const requiredTiers = getRequiredTiers();

  // Calculate overall status
  const getOverallStatus = () => {
    if (!kycStatus) return "incomplete";

    const allRequiredVerified = requiredTiers.every(
      (tier) => kycStatus[tier]?.status === "verified"
    );

    if (allRequiredVerified) return "complete";

    const anyPending = requiredTiers.some(
      (tier) => kycStatus[tier]?.status === "pending"
    );

    if (anyPending) return "pending";

    return "incomplete";
  };

  const overallStatus = getOverallStatus();

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
    if (kycStatus && requiredTiers) {
      // Calculate progress percentage based on verified tiers
      const totalTiers = requiredTiers.length;
      if (totalTiers === 0) return;

      let completedTiers = 0;
      requiredTiers.forEach((tier) => {
        if (kycStatus[tier]?.status === "verified") {
          completedTiers++;
        }
      });

      setProgress((completedTiers / totalTiers) * 100);
    }
  }, [kycStatus, requiredTiers]);

  // If still loading or no KYC data, show loading state
  if (isLoading || !kycStatus) {
    return (
      <div className="px-4 py-3 mb-4 bg-gray-100 rounded-lg animate-pulse">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-2 bg-gray-300 rounded w-full"></div>
      </div>
    );
  }

  // If KYC is complete, show success message
  if (overallStatus === "complete") {
    return (
      <div className="px-4 py-3 mb-4 bg-green-50 rounded-lg border border-green-100">
        <div className="flex items-center">
          <HiShieldCheck className="text-green-500 w-5 h-5 mr-2" />
          <span className="text-sm font-medium text-green-800">
            KYC Verified
          </span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-green-500 h-1.5 rounded-full"
            style={{ width: "100%" }}
          ></div>
        </div>
      </div>
    );
  }

  // If KYC is pending or incomplete, show progress
  return (
    <div className="px-4 py-3 mb-4 bg-blue-50 rounded-lg border border-blue-100">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center">
          {overallStatus === "pending" ? (
            <HiShieldExclamation className="text-yellow-500 w-5 h-5 mr-2" />
          ) : (
            <HiExclamationCircle className="text-red-500 w-5 h-5 mr-2" />
          )}
          <span className="text-sm font-medium text-blue-800">
            KYC Verification
          </span>
        </div>
        <span className="text-xs font-medium text-blue-800">
          {Math.round(progress)}%
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
        <div
          className={`h-1.5 rounded-full ${
            progress === 100
              ? "bg-green-500"
              : progress > 50
              ? "bg-blue-500"
              : "bg-yellow-500"
          }`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Tier status indicators */}
      <div className="mt-2 mb-2">
        {requiredTiers.includes("tier1") && (
          <div className="flex items-center text-xs mb-1">
            <HiPhone
              className={`w-3 h-3 mr-1 ${
                kycStatus.tier1?.status === "verified"
                  ? "text-green-500"
                  : kycStatus.tier1?.status === "pending"
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            />
            <span
              className={`${
                kycStatus.tier1?.status === "verified"
                  ? "text-green-700"
                  : kycStatus.tier1?.status === "pending"
                  ? "text-yellow-700"
                  : "text-red-700"
              }`}
            >
              Phone & NIN Verification
            </span>
          </div>
        )}

        {requiredTiers.includes("tier2") && (
          <div className="flex items-center text-xs mb-1">
            <HiDocumentText
              className={`w-3 h-3 mr-1 ${
                kycStatus.tier2?.status === "verified"
                  ? "text-green-500"
                  : kycStatus.tier2?.status === "pending"
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            />
            <span
              className={`${
                kycStatus.tier2?.status === "verified"
                  ? "text-green-700"
                  : kycStatus.tier2?.status === "pending"
                  ? "text-yellow-700"
                  : "text-red-700"
              }`}
            >
              Document Verification
            </span>
          </div>
        )}

        {/* Show Tier 3 for users as optional */}
        {user?.role === "user" && (
          <div className="flex items-center text-xs mb-1">
            <HiCreditCard
              className={`w-3 h-3 mr-1 ${
                kycStatus.tier3?.status === "verified"
                  ? "text-green-500"
                  : kycStatus.tier3?.status === "pending"
                  ? "text-yellow-500"
                  : "text-gray-400"
              }`}
            />
            <span
              className={`${
                kycStatus.tier3?.status === "verified"
                  ? "text-green-700"
                  : kycStatus.tier3?.status === "pending"
                  ? "text-yellow-700"
                  : "text-gray-500"
              }`}
            >
              Financial Verification {!kycStatus.tier3?.status && "(Optional)"}
            </span>
          </div>
        )}
      </div>

      {/* Action message based on role and status */}
      <div className="mt-2">
        {user?.role === "apartment_owner" && overallStatus !== "complete" && (
          <p className="text-xs text-orange-700 mb-2">
            Complete KYC to list properties
          </p>
        )}
        {user?.role === "user" && overallStatus !== "complete" && (
          <p className="text-xs text-blue-700 mb-2">
            Complete KYC to book properties
          </p>
        )}

        <Link
          to={`/${user.role}/settings/kyc`}
          className="text-xs text-blue-700 hover:text-blue-800 font-medium flex justify-end"
        >
          {overallStatus === "complete"
            ? "View Verification"
            : "Complete Verification"}
        </Link>
      </div>
    </div>
  );
}
