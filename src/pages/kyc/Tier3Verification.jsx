import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import PropTypes from "prop-types";
import useKycStore from "../../store/kycStore";
import InteractiveButton from "../../components/InteractiveButton";
import {
  HiCheckCircle,
  HiCreditCard,
  HiOfficeBuilding,
  HiIdentification,
  HiInformationCircle,
  HiExclamationCircle,
} from "react-icons/hi";

// Nigerian banks data
const nigerianBanks = [
  { code: "044", name: "Access Bank" },
  { code: "014", name: "Afribank Nigeria Plc" },
  { code: "023", name: "Citibank Nigeria Limited" },
  { code: "050", name: "Ecobank Nigeria Plc" },
  { code: "084", name: "Enterprise Bank Limited" },
  { code: "070", name: "Fidelity Bank Plc" },
  { code: "011", name: "First Bank of Nigeria Limited" },
  { code: "214", name: "First City Monument Bank Plc" },
  { code: "058", name: "Guaranty Trust Bank Plc" },
  { code: "030", name: "Heritage Banking Company Ltd" },
  { code: "082", name: "Keystone Bank Limited" },
  { code: "076", name: "Skye Bank Plc" },
  { code: "068", name: "Standard Chartered Bank Nigeria Limited" },
  { code: "232", name: "Sterling Bank Plc" },
  { code: "032", name: "Union Bank of Nigeria Plc" },
  { code: "033", name: "United Bank for Africa Plc" },
  { code: "215", name: "Unity Bank Plc" },
  { code: "035", name: "Wema Bank Plc" },
  { code: "057", name: "Zenith Bank Plc" },
];

// Form validation schema
const tier3Schema = yup.object().shape({
  // BVN field
  bvn_number: yup
    .string()
    .required("BVN is required")
    .matches(/^\d{11}$/, "BVN must be exactly 11 digits"),

  // Bank account fields
  account_number: yup
    .string()
    .required("Account number is required")
    .matches(/^\d{10}$/, "Account number must be exactly 10 digits"),
  bank_code: yup.string().required("Bank is required"),

  // Business fields
  business_name: yup.string().required("Business/Company name is required"),
  business_type: yup.string().required("Business type is required"),
  rc_number: yup.string().when("business_type", {
    is: "company",
    then: (schema) => schema.required("RC number is required for companies"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export default function Tier3Verification({ kycStatus }) {
  const { submitTier3Verification, isLoading } = useKycStore();
  const [activeSection, setActiveSection] = useState("bvn");

  // Get verification results if available
  const getVerificationStatus = (section) => {
    const sectionData = kycStatus?.tier3?.[section];
    if (!sectionData) return "not_started";
    return sectionData.verification_status || "not_started";
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(tier3Schema),
    defaultValues: {
      bvn_number: kycStatus?.tier3?.bvn?.bvn_number || "",
      account_number: kycStatus?.tier3?.bank_account?.account_number || "",
      bank_code: kycStatus?.tier3?.bank_account?.bank_code || "",
      business_name: kycStatus?.tier3?.business?.business_name || "",
      business_type: kycStatus?.tier3?.business?.business_type || "",
      rc_number: kycStatus?.tier3?.business?.rc_number || "",
    },
  });

  const watchedBusinessType = watch("business_type");

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        bvn_number: data.bvn_number,
        account_number: data.account_number,
        bank_code: data.bank_code,
        business_name: data.business_name,
        business_type: data.business_type,
        rc_number: data.rc_number || null,
      };

      await submitTier3Verification(formattedData);
    } catch (error) {
      console.error("Error submitting Tier 3 verification:", error);
    }
  };

  const isBvnVerified =
    kycStatus?.tier3?.bvn?.verification_status === "verified";
  const isBankVerified =
    kycStatus?.tier3?.bank_account?.verification_status === "verified";
  const isBusinessVerified =
    kycStatus?.tier3?.business?.verification_status === "verified";
  const isTier3Verified = kycStatus?.tier3?.status === "verified";
  const isTier3Pending = kycStatus?.tier3?.status === "pending";
  const isTier3Rejected = kycStatus?.tier3?.status === "rejected";

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Tier 3: Financial Verification
      </h2>
      <p className="text-gray-600 mb-6">
        Complete BVN, bank account, and business verification to enable monthly
        payment options and enhanced features.
      </p>

      {/* Information Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <HiInformationCircle className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-blue-900 mb-1">
              About Tier 3 Verification
            </h3>
            <p className="text-sm text-blue-800">
              This verification uses YouVerify's automated system to verify your
              BVN, bank account, and business information. All verifications are
              processed instantly and securely.
            </p>
          </div>
        </div>
      </div>

      {isTier3Verified ? (
        <div className="bg-green-50 text-green-700 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <HiCheckCircle className="w-6 h-6 mr-2" />
            <p className="font-medium text-lg">
              Tier 3 verification completed successfully!
            </p>
          </div>
          {kycStatus?.tier3?.completed_at && (
            <p className="mb-4 text-sm">
              Completed on:{" "}
              {new Date(kycStatus.tier3.completed_at).toLocaleDateString()}
            </p>
          )}

          {/* Show verification details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded border">
              <div className="flex items-center">
                <HiIdentification className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm font-medium">BVN Verified</span>
              </div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="flex items-center">
                <HiCreditCard className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm font-medium">
                  Bank Account Verified
                </span>
              </div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="flex items-center">
                <HiOfficeBuilding className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm font-medium">Business Verified</span>
              </div>
            </div>
          </div>
        </div>
      ) : isTier3Pending ? (
        <div className="bg-yellow-50 text-yellow-700 p-4 rounded-md mb-6">
          <p className="font-medium">
            Your Tier 3 verification is being processed.
          </p>
          <p className="mt-1 text-sm">
            This usually takes a few minutes. Please wait while we verify your
            information with YouVerify.
          </p>
        </div>
      ) : (
        <>
          {isTier3Rejected && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
              <div className="flex items-center mb-2">
                <HiExclamationCircle className="w-5 h-5 mr-2" />
                <p className="font-medium">Some verifications failed.</p>
              </div>
              <div className="text-sm space-y-1">
                {getVerificationStatus("bvn") === "rejected" && (
                  <p>
                    • BVN verification failed - please check your BVN number
                  </p>
                )}
                {getVerificationStatus("bank_account") === "rejected" && (
                  <p>
                    • Bank account verification failed - please check your
                    account details
                  </p>
                )}
                {getVerificationStatus("business") === "rejected" && (
                  <p>
                    • Business verification failed - please check your business
                    information
                  </p>
                )}
              </div>
              <p className="mt-2 text-sm">
                Please correct the information below and try again.
              </p>
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Tab Navigation */}
            <div className="flex border-b mb-6 overflow-x-auto">
              <button
                type="button"
                className={`py-3 px-4 font-medium whitespace-nowrap relative ${
                  activeSection === "bvn"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : getVerificationStatus("bvn") === "rejected"
                    ? "text-red-600 hover:text-red-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveSection("bvn")}
              >
                <div className="flex items-center">
                  <HiIdentification className="w-5 h-5 mr-2" />
                  BVN Verification
                  {getVerificationStatus("bvn") === "rejected" && (
                    <HiExclamationCircle className="w-4 h-4 ml-1 text-red-500" />
                  )}
                </div>
              </button>
              <button
                type="button"
                className={`py-3 px-4 font-medium whitespace-nowrap relative ${
                  activeSection === "bank"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : getVerificationStatus("bank_account") === "rejected"
                    ? "text-red-600 hover:text-red-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveSection("bank")}
              >
                <div className="flex items-center">
                  <HiCreditCard className="w-5 h-5 mr-2" />
                  Bank Account
                  {getVerificationStatus("bank_account") === "rejected" && (
                    <HiExclamationCircle className="w-4 h-4 ml-1 text-red-500" />
                  )}
                </div>
              </button>
              <button
                type="button"
                className={`py-3 px-4 font-medium whitespace-nowrap relative ${
                  activeSection === "business"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : getVerificationStatus("business") === "rejected"
                    ? "text-red-600 hover:text-red-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => {
                  console.log("Tab navigation to business");
                  setActiveSection("business");
                }}
              >
                <div className="flex items-center">
                  <HiOfficeBuilding className="w-5 h-5 mr-2" />
                  Business Info
                  {getVerificationStatus("business") === "rejected" && (
                    <HiExclamationCircle className="w-4 h-4 ml-1 text-red-500" />
                  )}
                </div>
              </button>
            </div>

            {/* BVN Section */}
            {activeSection === "bvn" && (
              <div className="space-y-6">
                <div
                  className={`p-4 rounded-lg ${
                    getVerificationStatus("bvn") === "rejected"
                      ? "bg-red-50 border border-red-200"
                      : "bg-gray-50"
                  }`}
                >
                  <h3 className="font-medium text-gray-900 mb-2">
                    BVN Verification
                    {getVerificationStatus("bvn") === "rejected" && (
                      <span className="ml-2 text-red-600 text-sm">
                        (Failed - Please retry)
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Your Bank Verification Number (BVN) will be verified
                    automatically using YouVerify.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="bvn_number"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Bank Verification Number (BVN)
                  </label>
                  <input
                    id="bvn_number"
                    type="text"
                    maxLength="11"
                    placeholder="Enter your 11-digit BVN"
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.bvn_number ? "border-red-500" : "border-gray-300"
                    }`}
                    {...register("bvn_number")}
                  />
                  {errors.bvn_number && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.bvn_number.message}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Your BVN is used to verify your identity and will be
                    processed securely.
                  </p>
                </div>

                <div className="flex justify-end">
                  <InteractiveButton
                    type="button"
                    onClick={() => setActiveSection("bank")}
                    className="px-6 py-2"
                  >
                    Next: Bank Account
                  </InteractiveButton>
                </div>
              </div>
            )}

            {/* Bank Section */}
            {activeSection === "bank" && (
              <div className="space-y-6">
                <div
                  className={`p-4 rounded-lg ${
                    getVerificationStatus("bank_account") === "rejected"
                      ? "bg-red-50 border border-red-200"
                      : "bg-gray-50"
                  }`}
                >
                  <h3 className="font-medium text-gray-900 mb-2">
                    Bank Account Verification
                    {getVerificationStatus("bank_account") === "rejected" && (
                      <span className="ml-2 text-red-600 text-sm">
                        (Failed - Please retry)
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Your bank account details will be verified automatically
                    using YouVerify.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="bank_code"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Bank
                    </label>
                    <select
                      id="bank_code"
                      className={`w-full px-3 py-2 border rounded-md ${
                        errors.bank_code ? "border-red-500" : "border-gray-300"
                      }`}
                      {...register("bank_code")}
                    >
                      <option value="">Select your bank</option>
                      {nigerianBanks.map((bank) => (
                        <option key={bank.code} value={bank.code}>
                          {bank.name}
                        </option>
                      ))}
                    </select>
                    {errors.bank_code && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.bank_code.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="account_number"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Account Number
                    </label>
                    <input
                      id="account_number"
                      type="text"
                      maxLength="10"
                      placeholder="Enter your 10-digit account number"
                      className={`w-full px-3 py-2 border rounded-md ${
                        errors.account_number
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      {...register("account_number")}
                    />
                    {errors.account_number && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.account_number.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-md">
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> Your account details will be verified
                    with your bank to confirm ownership. This process is secure
                    and no funds will be accessed.
                  </p>
                </div>

                <div className="flex justify-between">
                  <InteractiveButton
                    type="button"
                    onClick={() => setActiveSection("bvn")}
                    className="px-6 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300"
                  >
                    Back to BVN
                  </InteractiveButton>

                  <InteractiveButton
                    type="button"
                    onClick={() => {
                      console.log("Navigating to business section");
                      setActiveSection("business");
                    }}
                    className="px-6 py-2"
                  >
                    Next: Business Info
                  </InteractiveButton>
                </div>
              </div>
            )}

            {/* Business Section */}
            {activeSection === "business" && (
              <div className="space-y-6">
                <div
                  className={`p-4 rounded-lg ${
                    getVerificationStatus("business") === "rejected"
                      ? "bg-red-50 border border-red-200"
                      : "bg-gray-50"
                  }`}
                >
                  <h3 className="font-medium text-gray-900 mb-2">
                    Business/Workplace Verification
                    {getVerificationStatus("business") === "rejected" && (
                      <span className="ml-2 text-red-600 text-sm">
                        (Failed - Please retry)
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Provide your business or workplace information for
                    verification.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="business_name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Business/Company Name
                    </label>
                    <input
                      id="business_name"
                      type="text"
                      placeholder="Enter business or company name"
                      className={`w-full px-3 py-2 border rounded-md ${
                        errors.business_name
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      {...register("business_name")}
                    />
                    {errors.business_name && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.business_name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="business_type"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Business Type
                    </label>
                    <select
                      id="business_type"
                      className={`w-full px-3 py-2 border rounded-md ${
                        errors.business_type
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      {...register("business_type")}
                    >
                      <option value="">Select business type</option>
                      <option value="company">Registered Company</option>
                      <option value="business">Business</option>
                      <option value="workplace">Workplace/Employer</option>
                    </select>
                    {errors.business_type && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.business_type.message}
                      </p>
                    )}
                  </div>
                </div>

                {watchedBusinessType === "company" && (
                  <div>
                    <label
                      htmlFor="rc_number"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      RC Number (Registration Certificate)
                    </label>
                    <input
                      id="rc_number"
                      type="text"
                      placeholder="Enter RC number"
                      className={`w-full px-3 py-2 border rounded-md ${
                        errors.rc_number ? "border-red-500" : "border-gray-300"
                      }`}
                      {...register("rc_number")}
                    />
                    {errors.rc_number && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.rc_number.message}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Required for registered companies. Will be verified with
                      CAC.
                    </p>
                  </div>
                )}

                <div className="bg-blue-50 p-4 rounded-md">
                  <p className="text-sm text-blue-700">
                    <strong>Business Verification:</strong> For registered
                    companies, we'll verify your RC number with the Corporate
                    Affairs Commission (CAC). For other business types, the
                    information will be stored for reference.
                  </p>
                </div>

                <div className="flex justify-between">
                  <InteractiveButton
                    type="button"
                    onClick={() => setActiveSection("bank")}
                    className="px-6 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300"
                  >
                    Back to Bank Account
                  </InteractiveButton>

                  <InteractiveButton
                    type="submit"
                    isLoading={isLoading}
                    className="px-6 py-2"
                  >
                    Submit Verification
                  </InteractiveButton>
                </div>
              </div>
            )}
          </form>
        </>
      )}
    </div>
  );
}

// PropTypes validation
Tier3Verification.propTypes = {
  kycStatus: PropTypes.shape({
    tier3: PropTypes.shape({
      status: PropTypes.string,
      completed_at: PropTypes.string,
      bvn: PropTypes.shape({
        bvn_number: PropTypes.string,
        verification_status: PropTypes.string,
      }),
      bank_account: PropTypes.shape({
        account_number: PropTypes.string,
        bank_code: PropTypes.string,
        verification_status: PropTypes.string,
      }),
      business: PropTypes.shape({
        business_name: PropTypes.string,
        business_type: PropTypes.string,
        rc_number: PropTypes.string,
        verification_status: PropTypes.string,
      }),
    }),
  }),
};

// Default props
Tier3Verification.defaultProps = {
  kycStatus: {
    tier3: {
      status: "",
      bvn: { bvn_number: "", verification_status: "" },
      bank_account: {
        account_number: "",
        bank_code: "",
        verification_status: "",
      },
      business: {
        business_name: "",
        business_type: "",
        rc_number: "",
        verification_status: "",
      },
    },
  },
};
