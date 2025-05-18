import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { kycService } from "../../services/kycService";
import { useAuth } from "../../hooks/useAuth";
import InteractiveButton from "../../components/InteractiveButton";
import { HiCheckCircle, HiExclamationCircle } from "react-icons/hi";
import toast from "react-hot-toast";

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [verificationStatus, setVerificationStatus] = useState("loading"); // loading, success, error
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const verifyEmailToken = async () => {
      try {
        if (!token) {
          setVerificationStatus("error");
          setErrorMessage("Verification token is missing");
          return;
        }

        await kycService.verifyEmail(token);
        setVerificationStatus("success");
      } catch (error) {
        console.error("Email verification error:", error);
        setVerificationStatus("error");
        setErrorMessage(
          error.response?.data?.message || "Email verification failed"
        );
      }
    };

    verifyEmailToken();
  }, [token]);

  const handleNavigate = () => {
    if (user) {
      navigate(`/${user.role}/settings/kyc`);
    } else {
      navigate("/auth/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        {verificationStatus === "loading" && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <h2 className="text-xl font-semibold mt-4">
              Verifying your email...
            </h2>
            <p className="text-gray-600 mt-2">
              Please wait while we verify your email address.
            </p>
          </div>
        )}

        {verificationStatus === "success" && (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <HiCheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold mt-4">
              Email Verified Successfully!
            </h2>
            <p className="text-gray-600 mt-2">
              Your email has been successfully verified. You can now continue
              with the KYC verification process.
            </p>
            <InteractiveButton onClick={handleNavigate} className="mt-6 w-full">
              {user ? "Continue to KYC Verification" : "Login to Your Account"}
            </InteractiveButton>
          </div>
        )}

        {verificationStatus === "error" && (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <HiExclamationCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold mt-4">Verification Failed</h2>
            <p className="text-gray-600 mt-2">
              {errorMessage ||
                "We couldn't verify your email. The verification link may be invalid or expired."}
            </p>
            <InteractiveButton onClick={handleNavigate} className="mt-6 w-full">
              {user ? "Return to KYC Verification" : "Return to Login"}
            </InteractiveButton>
          </div>
        )}
      </div>
    </div>
  );
}
