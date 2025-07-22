import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import useKycStore from "../../store/kycStore";
import LoadingOverlay from "../../components/LoadingOverlay";
import Tier1Verification from "./Tier1Verification";
import {
  HiCheckCircle,
  HiExclamationCircle,
  HiClock,
  HiPhone,
  HiInformationCircle,
} from "react-icons/hi";

export default function KycVerification() {
  const { user } = useAuth();
  const { kycStatus, isLoading, getKycStatus } = useKycStore();
  const [activeTab, setActiveTab] = useState("tier1");

  // Determine required tiers based on user role
  const getRequiredTiers = () => {
    // Both owners and users now only need Tier 1 (Phone + NIN) verification
    return ["tier1"];
  };

  const requiredTiers = getRequiredTiers();

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
    // Set active tab based on verification status - only Tier 1 is available
    if (kycStatus) {
      setActiveTab("tier1");
    }
  }, [kycStatus, user?.role]);

  if (isLoading || !kycStatus) {
    return <LoadingOverlay />;
  }

  const getStatusIcon = (tier) => {
    if (!kycStatus[tier]) {
      return <HiExclamationCircle className="w-6 h-6 text-gray-400" />;
    }

    switch (kycStatus[tier].status) {
      case "verified":
        return <HiCheckCircle className="w-6 h-6 text-green-500" />;
      case "pending":
        return <HiClock className="w-6 h-6 text-yellow-500" />;
      case "rejected":
        return <HiExclamationCircle className="w-6 h-6 text-red-500" />;
      default:
        return <HiExclamationCircle className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusText = (tier) => {
    if (!kycStatus[tier]) {
      return "Not Started";
    }

    switch (kycStatus[tier].status) {
      case "verified":
        return "Verified";
      case "pending":
        return "Pending";
      case "rejected":
        return "Rejected";
      default:
        return "Not Started";
    }
  };

  const getStatusColor = (tier) => {
    if (!kycStatus[tier]) {
      return "bg-gray-100 text-gray-600";
    }

    switch (kycStatus[tier].status) {
      case "verified":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Calculate overall verification status
  const getOverallStatus = () => {
    const completedRequired = requiredTiers.every(
      (tier) => kycStatus[tier]?.status === "verified"
    );

    if (completedRequired) return "complete";

    const hasPending = requiredTiers.some(
      (tier) => kycStatus[tier]?.status === "pending"
    );

    if (hasPending) return "pending";
    return "incomplete";
  };

  const overallStatus = getOverallStatus();

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          KYC Verification
        </h1>
        <p className="text-gray-600 mb-4">
          Complete the verification process to access all features of the
          platform.
        </p>

        {/* Role-specific information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <HiInformationCircle className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">
                Verification Requirements
              </h3>
              <p className="text-sm text-blue-800">
                Complete Tier 1 verification (Phone + NIN) to access all
                platform features.
                {user?.role === "owner"
                  ? " This verification is required to list properties."
                  : " This verification is required to book properties and access all payment options."}
              </p>
            </div>
          </div>
        </div>

        {/* Overall Status */}
        <div
          className={`p-4 rounded-lg border-l-4 ${
            overallStatus === "complete"
              ? "bg-green-50 border-green-400"
              : overallStatus === "pending"
              ? "bg-yellow-50 border-yellow-400"
              : "bg-gray-50 border-gray-400"
          }`}
        >
          <div className="flex items-center">
            {overallStatus === "complete" && (
              <HiCheckCircle className="w-5 h-5 text-green-500 mr-2" />
            )}
            {overallStatus === "pending" && (
              <HiClock className="w-5 h-5 text-yellow-500 mr-2" />
            )}
            {overallStatus === "incomplete" && (
              <HiExclamationCircle className="w-5 h-5 text-gray-500 mr-2" />
            )}
            <span className="font-medium">
              {overallStatus === "complete" && "Verification Complete"}
              {overallStatus === "pending" && "Verification Pending"}
              {overallStatus === "incomplete" && "Verification Required"}
            </span>
          </div>
        </div>
      </div>

      {/* KYC Progress */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold mb-6">Verification Status</h2>
        <div className="max-w-md mx-auto">
          {/* Tier 1 - Only verification tier */}
          <div
            className={`p-6 rounded-lg border-2 transition-all ${
              activeTab === "tier1"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <HiPhone className="w-6 h-6 text-blue-500 mr-2" />
                <h3 className="font-semibold">Tier 1 Verification</h3>
              </div>
              {getStatusIcon("tier1")}
            </div>
            <h4 className="font-medium mb-2">Basic Verification</h4>
            <p className="text-sm text-gray-600 mb-3">
              Phone Number & NIN Verification
            </p>
            <div className="flex items-center justify-between">
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(
                  "tier1"
                )}`}
              >
                {getStatusText("tier1")}
              </span>
              <span className="text-xs text-red-600 font-medium">Required</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Verification Form */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <Tier1Verification kycStatus={kycStatus} />
      </div>
    </div>
  );
}
