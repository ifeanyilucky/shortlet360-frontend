import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "../../hooks/useAuth";
import useKycStore from "../../store/kycStore";
import InteractiveButton from "../../components/InteractiveButton";
import { HiCheckCircle, HiMail, HiPhone } from "react-icons/hi";
import toast from "react-hot-toast";

// Form validation schema
const phoneSchema = yup.object().shape({
  phone_number: yup
    .string()
    .required("Phone number is required")
    .matches(
      /^(\+?234|0)[789]\d{9}$/,
      "Please enter a valid Nigerian phone number"
    ),
});

export default function Tier1Verification({ kycStatus }) {
  const { user } = useAuth();
  const { initiateTier1Verification, verifyPhoneNumber, isLoading } = useKycStore();
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(phoneSchema),
    defaultValues: {
      phone_number: user?.phone_number || "",
    },
  });

  useEffect(() => {
    if (user?.phone_number) {
      setValue("phone_number", user.phone_number);
    }
  }, [user, setValue]);

  const handleSendVerificationEmail = async () => {
    try {
      await initiateTier1Verification();
      setEmailSent(true);
    } catch (error) {
      console.error("Error sending verification email:", error);
    }
  };

  const onSubmitPhone = async (data) => {
    try {
      await verifyPhoneNumber(data.phone_number);
    } catch (error) {
      console.error("Error verifying phone number:", error);
    }
  };

  const isEmailVerified = kycStatus?.tier1?.email_verified;
  const isPhoneVerified = kycStatus?.tier1?.phone_verified;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Tier 1: Basic Verification</h2>
      <p className="text-gray-600 mb-6">
        Verify your email and phone number to complete the basic verification.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Email Verification */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center mb-4">
            <HiMail className="w-6 h-6 text-blue-500 mr-2" />
            <h3 className="text-lg font-medium">Email Verification</h3>
          </div>

          {isEmailVerified ? (
            <div className="flex items-center text-green-600">
              <HiCheckCircle className="w-5 h-5 mr-2" />
              <span>Email verified successfully</span>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-4">
                We'll send a verification link to your email address:{" "}
                <strong>{user?.email}</strong>
              </p>

              {emailSent ? (
                <div className="bg-blue-50 text-blue-700 p-3 rounded-md mb-4">
                  <p>
                    Verification email sent! Please check your inbox and click on the
                    verification link.
                  </p>
                  <p className="mt-2 text-sm">
                    Didn't receive the email?{" "}
                    <button
                      type="button"
                      onClick={handleSendVerificationEmail}
                      className="text-blue-600 underline"
                      disabled={isLoading}
                    >
                      Resend email
                    </button>
                  </p>
                </div>
              ) : (
                <InteractiveButton
                  onClick={handleSendVerificationEmail}
                  isLoading={isLoading}
                  className="w-full"
                >
                  Send Verification Email
                </InteractiveButton>
              )}
            </div>
          )}
        </div>

        {/* Phone Verification */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center mb-4">
            <HiPhone className="w-6 h-6 text-blue-500 mr-2" />
            <h3 className="text-lg font-medium">Phone Verification</h3>
          </div>

          {isPhoneVerified ? (
            <div className="flex items-center text-green-600">
              <HiCheckCircle className="w-5 h-5 mr-2" />
              <span>Phone number verified successfully</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmitPhone)}>
              <div className="mb-4">
                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  id="phone_number"
                  type="tel"
                  placeholder="e.g. 08012345678"
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.phone_number ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("phone_number")}
                />
                {errors.phone_number && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone_number.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Enter a valid Nigerian phone number (e.g., 08012345678 or +2348012345678)
                </p>
              </div>

              <InteractiveButton
                type="submit"
                isLoading={isLoading}
                className="w-full"
              >
                Verify Phone Number
              </InteractiveButton>
            </form>
          )}
        </div>
      </div>

      {isEmailVerified && isPhoneVerified && (
        <div className="mt-6 bg-green-50 text-green-700 p-4 rounded-md">
          <div className="flex items-center">
            <HiCheckCircle className="w-6 h-6 mr-2" />
            <p className="font-medium">Tier 1 verification completed successfully!</p>
          </div>
          {kycStatus?.tier1?.completed_at && (
            <p className="mt-1 text-sm">
              Completed on: {new Date(kycStatus.tier1.completed_at).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
