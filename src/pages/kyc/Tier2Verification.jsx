import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "../../hooks/useAuth";
import useKycStore from "../../store/kycStore";
import InteractiveButton from "../../components/InteractiveButton";
import { HiCheckCircle, HiIdentification, HiLocationMarker } from "react-icons/hi";

// Form validation schema
const tier2Schema = yup.object().shape({
  // Address fields
  street: yup.string().required("Street address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  postal_code: yup.string().required("Postal code is required"),
  country: yup.string().default("Nigeria"),
  
  // Identity fields
  nin: yup
    .string()
    .required("NIN is required")
    .matches(/^\d{11}$/, "NIN must be 11 digits"),
});

export default function Tier2Verification({ kycStatus }) {
  const { user } = useAuth();
  const { submitTier2Verification, isLoading } = useKycStore();
  const [activeSection, setActiveSection] = useState("address");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(tier2Schema),
    defaultValues: {
      street: kycStatus?.tier2?.address?.street || "",
      city: kycStatus?.tier2?.address?.city || "",
      state: kycStatus?.tier2?.address?.state || "",
      postal_code: kycStatus?.tier2?.address?.postal_code || "",
      country: "Nigeria",
      nin: kycStatus?.tier2?.identity?.nin || "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          postal_code: data.postal_code,
          country: data.country,
        },
        identity: {
          nin: data.nin,
        },
      };
      
      await submitTier2Verification(formattedData);
    } catch (error) {
      console.error("Error submitting Tier 2 verification:", error);
    }
  };

  const isAddressVerified = kycStatus?.tier2?.address?.verification_status === "verified";
  const isIdentityVerified = kycStatus?.tier2?.identity?.verification_status === "verified";
  const isTier2Verified = kycStatus?.tier2?.status === "verified";
  const isTier2Pending = kycStatus?.tier2?.status === "pending";

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Tier 2: Identity Verification</h2>
      <p className="text-gray-600 mb-6">
        Verify your address and identity to complete Tier 2 verification.
      </p>

      {isTier2Verified ? (
        <div className="bg-green-50 text-green-700 p-4 rounded-md">
          <div className="flex items-center">
            <HiCheckCircle className="w-6 h-6 mr-2" />
            <p className="font-medium">Tier 2 verification completed successfully!</p>
          </div>
          {kycStatus?.tier2?.completed_at && (
            <p className="mt-1 text-sm">
              Completed on: {new Date(kycStatus.tier2.completed_at).toLocaleDateString()}
            </p>
          )}
        </div>
      ) : isTier2Pending ? (
        <div className="bg-yellow-50 text-yellow-700 p-4 rounded-md mb-6">
          <p className="font-medium">Your Tier 2 verification is pending review.</p>
          <p className="mt-1 text-sm">
            We'll notify you once the verification is complete. This usually takes 24-48 hours.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Tab Navigation */}
          <div className="flex border-b mb-6">
            <button
              type="button"
              className={`py-2 px-4 font-medium ${
                activeSection === "address"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveSection("address")}
            >
              <div className="flex items-center">
                <HiLocationMarker className="w-5 h-5 mr-2" />
                Address Information
              </div>
            </button>
            <button
              type="button"
              className={`py-2 px-4 font-medium ${
                activeSection === "identity"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveSection("identity")}
            >
              <div className="flex items-center">
                <HiIdentification className="w-5 h-5 mr-2" />
                Identity Verification
              </div>
            </button>
          </div>

          {/* Address Section */}
          {activeSection === "address" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    id="street"
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.street ? "border-red-500" : "border-gray-300"
                    }`}
                    {...register("street")}
                  />
                  {errors.street && (
                    <p className="mt-1 text-sm text-red-600">{errors.street.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    }`}
                    {...register("city")}
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    id="state"
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.state ? "border-red-500" : "border-gray-300"
                    }`}
                    {...register("state")}
                  />
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    id="postal_code"
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.postal_code ? "border-red-500" : "border-gray-300"
                    }`}
                    {...register("postal_code")}
                  />
                  {errors.postal_code && (
                    <p className="mt-1 text-sm text-red-600">{errors.postal_code.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  id="country"
                  type="text"
                  value="Nigeria"
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>

              <div className="flex justify-end mt-4">
                <InteractiveButton
                  type="button"
                  onClick={() => setActiveSection("identity")}
                  className="px-4 py-2"
                >
                  Next: Identity Verification
                </InteractiveButton>
              </div>
            </div>
          )}

          {/* Identity Section */}
          {activeSection === "identity" && (
            <div className="space-y-4">
              <div>
                <label htmlFor="nin" className="block text-sm font-medium text-gray-700 mb-1">
                  National Identification Number (NIN)
                </label>
                <input
                  id="nin"
                  type="text"
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.nin ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("nin")}
                />
                {errors.nin && (
                  <p className="mt-1 text-sm text-red-600">{errors.nin.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Enter your 11-digit NIN without spaces or special characters
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-md mt-4">
                <p className="text-sm text-blue-700">
                  Your NIN will be verified against the National Identity Management Commission (NIMC) database.
                  Make sure the information matches your official records.
                </p>
              </div>

              <div className="flex justify-between mt-6">
                <InteractiveButton
                  type="button"
                  onClick={() => setActiveSection("address")}
                  className="px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300"
                >
                  Back to Address
                </InteractiveButton>
                
                <InteractiveButton
                  type="submit"
                  isLoading={isLoading}
                  className="px-4 py-2"
                >
                  Submit Verification
                </InteractiveButton>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
