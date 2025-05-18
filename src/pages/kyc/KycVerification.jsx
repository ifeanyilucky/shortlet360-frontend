import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import useKycStore from "../../store/kycStore";
import LoadingOverlay from "../../components/LoadingOverlay";
import Tier1Verification from "./Tier1Verification";
import Tier2Verification from "./Tier2Verification";
import Tier3Verification from "./Tier3Verification";
import { HiCheckCircle, HiExclamationCircle, HiClock } from "react-icons/hi";

export default function KycVerification() {
  const { user } = useAuth();
  const { kycStatus, requiredTiers, overallStatus, isLoading, getKycStatus } =
    useKycStore();
  const [activeTab, setActiveTab] = useState("tier1");

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
    // Set active tab based on verification status
    if (kycStatus) {
      if (!kycStatus.tier1 || kycStatus.tier1.status !== "verified") {
        setActiveTab("tier1");
      } else if (
        requiredTiers.includes("tier2") &&
        (!kycStatus.tier2 || kycStatus.tier2.status !== "verified")
      ) {
        setActiveTab("tier2");
      } else if (
        requiredTiers.includes("tier3") &&
        (!kycStatus.tier3 || kycStatus.tier3.status !== "verified")
      ) {
        setActiveTab("tier3");
      }
    }
  }, [kycStatus, requiredTiers]);

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

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          KYC Verification
        </h1>
        <p className="text-gray-600">
          Complete the verification process to access all features of the
          platform.
        </p>
      </div>

      {/* KYC Progress */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
        <h2 className="text-lg font-semibold mb-4">Verification Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className={`p-4 rounded-lg border ${
              activeTab === "tier1" ? "border-blue-500" : "border-gray-200"
            } cursor-pointer`}
            onClick={() => setActiveTab("tier1")}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Tier 1: Basic Verification</h3>
              {getStatusIcon("tier1")}
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Phone Number & NIN Verification
            </p>
            <span
              className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                "tier1"
              )}`}
            >
              {getStatusText("tier1")}
            </span>
          </div>

          {requiredTiers.includes("tier2") && (
            <div
              className={`p-4 rounded-lg border ${
                activeTab === "tier2" ? "border-blue-500" : "border-gray-200"
              } cursor-pointer ${
                !kycStatus.tier1 || kycStatus.tier1.status !== "verified"
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={() => {
                if (kycStatus.tier1 && kycStatus.tier1.status === "verified") {
                  setActiveTab("tier2");
                }
              }}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Tier 2: Identity Verification</h3>
                {getStatusIcon("tier2")}
              </div>
              <p className="text-sm text-gray-600 mb-2">Address Verification</p>
              <span
                className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                  "tier2"
                )}`}
              >
                {getStatusText("tier2")}
              </span>
            </div>
          )}

          {requiredTiers.includes("tier3") && (
            <div
              className={`p-4 rounded-lg border ${
                activeTab === "tier3" ? "border-blue-500" : "border-gray-200"
              } cursor-pointer ${
                !kycStatus.tier2 || kycStatus.tier2.status !== "verified"
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={() => {
                if (kycStatus.tier2 && kycStatus.tier2.status === "verified") {
                  setActiveTab("tier3");
                }
              }}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Tier 3: Financial Verification</h3>
                {getStatusIcon("tier3")}
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Employment Check & Credit History Check
              </p>
              <span
                className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                  "tier3"
                )}`}
              >
                {getStatusText("tier3")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Active Verification Form */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        {activeTab === "tier1" && <Tier1Verification kycStatus={kycStatus} />}
        {activeTab === "tier2" && <Tier2Verification kycStatus={kycStatus} />}
        {activeTab === "tier3" && <Tier3Verification kycStatus={kycStatus} />}
      </div>
    </div>
  );
}
