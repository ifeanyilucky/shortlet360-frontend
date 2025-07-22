import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HiShieldCheck,
  HiShieldExclamation,
  HiExclamationCircle,
  HiPhone,
  HiDocumentText,
  HiCreditCard,
  HiCheckCircle,
  HiClock,
  HiXCircle,
} from "react-icons/hi";
import { useAuth } from "../hooks/useAuth";
import useKycStore from "../store/kycStore";

/**
 * Detailed KYC Status Card component for dashboards
 * Shows comprehensive KYC verification status with detailed breakdown
 */
export default function KycStatusCard() {
  const { user } = useAuth();
  const { kycStatus, getKycStatus, isLoading } = useKycStore();

  // Get required tiers based on user role
  const getRequiredTiers = () => {
    if (user?.role === "owner") {
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

  // Calculate progress percentage
  const getProgress = () => {
    if (!kycStatus || requiredTiers.length === 0) return 0;

    let completedTiers = 0;
    requiredTiers.forEach((tier) => {
      if (kycStatus[tier]?.status === "verified") {
        completedTiers++;
      }
    });

    return (completedTiers / requiredTiers.length) * 100;
  };

  const progress = getProgress();

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

  // Get status icon and color
  const getStatusIcon = (status) => {
    switch (status) {
      case "verified":
        return <HiCheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <HiClock className="w-4 h-4 text-yellow-500" />;
      case "rejected":
        return <HiXCircle className="w-4 h-4 text-red-500" />;
      default:
        return <HiExclamationCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  // Get tier details
  const getTierDetails = () => {
    const tiers = [
      {
        id: "tier1",
        name: "Phone & NIN Verification",
        description: "Verify your phone number and NIN",
        icon: <HiPhone className="w-5 h-5" />,
        required: requiredTiers.includes("tier1"),
        status: kycStatus?.tier1?.status || "not_started",
      },
      // {
      //   id: "tier2",
      //   name: "Document Verification",
      //   description: "Upload utility bill for address verification",
      //   icon: <HiDocumentText className="w-5 h-5" />,
      //   required: requiredTiers.includes("tier2"),
      //   status: kycStatus?.tier2?.status || "not_started",
      // },
      // {
      //   id: "tier3",
      //   name: "Financial Verification",
      //   description: "BVN, bank account & business verification",
      //   icon: <HiCreditCard className="w-5 h-5" />,
      //   required: false, // Optional for users
      //   status: kycStatus?.tier3?.status || "not_started",
      // },
    ];

    return tiers.filter(
      (tier) => tier.required || (user?.role === "user" && tier.id === "tier3")
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow p-6 animate-pulse">
        <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          KYC Verification
        </h2>
        <div className="flex items-center">
          {overallStatus === "complete" ? (
            <HiShieldCheck className="text-green-500 w-6 h-6 mr-2" />
          ) : overallStatus === "pending" ? (
            <HiShieldExclamation className="text-yellow-500 w-6 h-6 mr-2" />
          ) : (
            <HiExclamationCircle className="text-red-500 w-6 h-6 mr-2" />
          )}
          <span
            className={`text-sm font-medium ${
              overallStatus === "complete"
                ? "text-green-700"
                : overallStatus === "pending"
                ? "text-yellow-700"
                : "text-red-700"
            }`}
          >
            {overallStatus === "complete"
              ? "Verified"
              : overallStatus === "pending"
              ? "Pending"
              : "Incomplete"}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              progress === 100
                ? "bg-green-500"
                : progress > 50
                ? "bg-blue-500"
                : "bg-yellow-500"
            }`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Tier Status */}
      <div className="space-y-3 mb-4">
        {getTierDetails().map((tier) => (
          <div
            key={tier.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center">
              <div
                className={`p-2 rounded-full mr-3 ${
                  tier.status === "verified"
                    ? "bg-green-100 text-green-600"
                    : tier.status === "pending"
                    ? "bg-yellow-100 text-yellow-600"
                    : tier.status === "rejected"
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {tier.icon}
              </div>
              <div>
                <p className="font-medium text-gray-800">
                  {tier.name}
                  {!tier.required && (
                    <span className="text-gray-500 text-sm ml-1">
                      (Optional)
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-600">{tier.description}</p>
              </div>
            </div>
            {getStatusIcon(tier.status)}
          </div>
        ))}
      </div>

      {/* Action Section */}
      <div className="border-t pt-4">
        {overallStatus === "complete" ? (
          <div className="text-center">
            <p className="text-sm text-green-700 mb-2">
              ✅ Your account is fully verified!
            </p>
            <Link
              to={`/${user.role}/settings/kyc`}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View Verification Details
            </Link>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">
              {user?.role === "owner"
                ? "Complete KYC verification to add properties and start earning"
                : "Complete KYC verification to rent apartments and book shortlets"}
            </p>
            <Link
              to={`/${user.role}/settings/kyc`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue Verification
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
