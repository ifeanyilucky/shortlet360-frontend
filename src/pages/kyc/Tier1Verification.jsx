import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import PropTypes from "prop-types";
import { useAuth } from "../../hooks/useAuth";
import useKycStore from "../../store/kycStore";
import InteractiveButton from "../../components/InteractiveButton";
import { HiCheckCircle, HiIdentification, HiPhone } from "react-icons/hi";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

// Custom styles for PhoneInput
const phoneInputStyles = `
  .PhoneInput {
    display: flex;
    align-items: center;
  }

  .PhoneInputCountry {
    margin-right: 0.5rem;
  }

  .PhoneInputCountryIcon {
    width: 1.5rem;
    height: 1rem;
  }

  .PhoneInputInput {
    flex: 1;
    min-width: 0;
    border: none;
    padding: 0;
    outline: none;
  }
`;

// Form validation schemas
const tier1Schema = yup.object().shape({
  phone_number: yup
    .string()
    .required("Phone number is required")
    .test(
      "is-valid-nigerian-number",
      "Please enter a valid Nigerian phone number",
      (value) => {
        if (!value) return false;

        // Clean the value
        const cleanValue = String(value).replace(/\s+/g, "");

        // Check if it's a valid Nigerian number format
        return (
          cleanValue.startsWith("+234") ||
          cleanValue.startsWith("234") ||
          (cleanValue.startsWith("0") && cleanValue.length === 11) ||
          (cleanValue.length === 10 && /^[789][01]\d{8}$/.test(cleanValue))
        );
      }
    ),
  nin: yup
    .string()
    .required("NIN is required")
    .test("is-valid-nin", "NIN must be exactly 11 digits", (value) => {
      if (!value) return false;
      const cleanValue = String(value).replace(/\D/g, "");
      return cleanValue.length === 11;
    }),
});

export default function Tier1Verification({ kycStatus }) {
  const { user, setUser } = useAuth();
  const { submitTier1Verification, isLoading } = useKycStore();

  // Tier 1 form
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(tier1Schema),
    defaultValues: {
      phone_number: user?.phone_number || "",
      nin: kycStatus?.tier1?.nin || "",
    },
  });

  useEffect(() => {
    if (user?.phone_number) {
      setValue("phone_number", user.phone_number);
    }
  }, [user, setValue]);

  const isPhoneVerified = kycStatus?.tier1?.phone_verified;
  const isNinVerified = kycStatus?.tier1?.nin_verified;
  const isTier1Verified = kycStatus?.tier1?.status === "verified";

  const onSubmit = async (data) => {
    try {
      // Ensure phone_number is a string and clean it
      const phoneNumber = data.phone_number
        ? String(data.phone_number).trim()
        : "";
      const nin = data.nin ? String(data.nin).trim() : "";

      console.log("Submitting Tier 1 verification with data:", {
        phone_number: phoneNumber,
        nin: nin,
      });

      await submitTier1Verification(
        {
          phone_number: phoneNumber,
          nin: nin,
        },
        setUser
      );
    } catch (error) {
      console.error("Error submitting Tier 1 verification:", error);
    }
  };

  return (
    <div>
      <style>{phoneInputStyles}</style>
      <h2 className="text-xl font-semibold mb-4">Tier 1: Basic Verification</h2>
      <p className="text-gray-600 mb-6">
        Verify your phone number and NIN to complete the basic verification.
      </p>

      {isTier1Verified ? (
        <div className="bg-green-50 text-green-700 p-4 rounded-md">
          <div className="flex items-center">
            <HiCheckCircle className="w-6 h-6 mr-2" />
            <p className="font-medium">
              Tier 1 verification completed successfully!
            </p>
          </div>
          {kycStatus?.tier1?.completed_at && (
            <p className="mt-1 text-sm">
              Completed on:{" "}
              {new Date(kycStatus.tier1.completed_at).toLocaleDateString()}
            </p>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Phone Verification */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center mb-4">
                <HiPhone className="w-6 h-6 text-blue-500 mr-2" />
                <h3 className="text-lg font-medium">Phone Verification</h3>
                {isPhoneVerified && (
                  <HiCheckCircle className="w-5 h-5 text-green-600 ml-auto" />
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="phone_number"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <Controller
                  name="phone_number"
                  control={control}
                  render={({ field }) => (
                    <PhoneInput
                      id="phone_number"
                      placeholder="Enter phone number"
                      defaultCountry="NG"
                      countries={["NG"]}
                      international={false}
                      disabled={isPhoneVerified}
                      className={`w-full px-3 py-2 border rounded-md ${
                        errors.phone_number
                          ? "border-red-500"
                          : isPhoneVerified
                          ? "border-green-500 bg-green-50"
                          : "border-gray-300"
                      }`}
                      value={field.value || ""}
                      onChange={(value) => {
                        // Ensure we always pass a string value
                        const stringValue = value ? String(value) : "";
                        field.onChange(stringValue);
                      }}
                    />
                  )}
                />
                {errors.phone_number && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.phone_number.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Enter a valid Nigerian phone number. The country code (+234)
                  will be automatically formatted for you. You can enter your
                  number with or without the leading zero.
                </p>
              </div>
            </div>

            {/* NIN Verification */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center mb-4">
                <HiIdentification className="w-6 h-6 text-blue-500 mr-2" />
                <h3 className="text-lg font-medium">NIN Verification</h3>
                {isNinVerified && (
                  <HiCheckCircle className="w-5 h-5 text-green-600 ml-auto" />
                )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="nin"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  National Identification Number (NIN)
                </label>
                <input
                  id="nin"
                  type="text"
                  disabled={isNinVerified}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.nin
                      ? "border-red-500"
                      : isNinVerified
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300"
                  }`}
                  {...register("nin")}
                />
                {errors.nin && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.nin.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Enter your 11-digit NIN without spaces or special characters
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <InteractiveButton
              type="submit"
              isLoading={isLoading}
              disabled={isPhoneVerified && isNinVerified}
              className="px-8 py-3"
            >
              {isPhoneVerified && isNinVerified
                ? "Verification Complete"
                : "Submit Verification"}
            </InteractiveButton>
          </div>
        </form>
      )}
    </div>
  );
}

// PropTypes validation
Tier1Verification.propTypes = {
  kycStatus: PropTypes.shape({
    tier1: PropTypes.shape({
      phone_verified: PropTypes.bool,
      nin_verified: PropTypes.bool,
      nin: PropTypes.string,
      completed_at: PropTypes.string,
      status: PropTypes.string,
    }),
  }),
};

// Default props
Tier1Verification.defaultProps = {
  kycStatus: {
    tier1: {
      phone_verified: false,
      nin_verified: false,
      nin: "",
    },
  },
};
