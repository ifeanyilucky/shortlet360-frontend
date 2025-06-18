import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import InteractiveButton from "../../components/InteractiveButton";
import { usePaystackPayment } from "react-paystack";
import { paystackConfig } from "../../config/paystack";
import { authService } from "../../services/api";
import LoadingOverlay from "../../components/LoadingOverlay";

// Registration fee in Naira - only for owner role
const REGISTRATION_FEE = 20000;

export default function RegistrationPayment() {
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [discountDetails, setDiscountDetails] = useState(null);
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  const [codeValidated, setCodeValidated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already active or doesn't require payment, redirect to home
    if (user?.is_active || user?.registration_payment_status === "paid") {
      navigate("/");
    }

    // If user is not an owner, redirect to home
    if (user?.role !== "owner") {
      navigate("/");
    }
  }, [user, navigate]);

  // Calculate final amount based on discount
  const finalAmount = discountDetails
    ? discountDetails.final_amount
    : REGISTRATION_FEE;

  // Configure Paystack
  const paystackPaymentConfig = user
    ? paystackConfig({
        ...user,
        amount: finalAmount,
      })
    : null;

  const initializePayment = usePaystackPayment(paystackPaymentConfig || {});

  // Validate discount code
  const validateDiscountCode = async () => {
    if (!discountCode.trim()) {
      toast.error("Please enter a discount code");
      return;
    }

    try {
      setIsValidatingCode(true);
      const result = await authService.validateDiscountCode(
        discountCode.trim(),
        REGISTRATION_FEE
      );

      setDiscountDetails(result.discount_details);
      setCodeValidated(true);
      toast.success(
        `Discount code applied! You save ₦${result.discount_details.discount_amount.toLocaleString()}`
      );
    } catch (error) {
      console.error("Discount code validation error:", error);
      toast.error(error?.response?.data?.message || "Invalid discount code");
      setDiscountDetails(null);
      setCodeValidated(false);
    } finally {
      setIsValidatingCode(false);
    }
  };

  // Remove discount code
  const removeDiscountCode = () => {
    setDiscountCode("");
    setDiscountDetails(null);
    setCodeValidated(false);
    toast.success("Discount code removed");
  };

  const handlePaymentSuccess = async (response) => {
    try {
      setIsLoading(true);

      // Call API to complete registration payment with discount code if applied
      const result = await authService.completeRegistrationPayment(
        response,
        codeValidated ? discountCode.trim() : null
      );

      // Update user in context
      setUser(result.user);

      if (result.discount_applied) {
        toast.success(
          `Registration payment completed successfully! You saved ₦${result.discount_applied.discount_amount.toLocaleString()} with discount code ${
            result.discount_applied.code
          }`
        );
      } else {
        toast.success("Registration payment completed successfully!");
      }

      // Navigate to owner dashboard
      navigate("/owner/dashboard");
    } catch (error) {
      console.error("Payment verification error:", error);
      toast.error(
        error?.response?.data?.message || "Payment verification failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !user) return <LoadingOverlay />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/">
          <img className="mx-auto h-24 w-auto" src="/logo.png" alt="Aplet360" />
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Complete Your Registration
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please make a payment to activate your Landlord/Property Manager
          account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Registration Fee
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                A one-time fee to activate your Landlord/Property Manager
                account
              </p>

              {/* Pricing Display */}
              <div className="mt-4">
                {discountDetails ? (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Original Price:
                        </span>
                        <span className="text-lg text-gray-500 line-through">
                          ₦{REGISTRATION_FEE.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-green-700 font-medium">
                            Discount Applied:
                          </span>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                            {discountDetails.discount_percentage
                              ? `${discountDetails.discount_percentage}% OFF`
                              : "FIXED DISCOUNT"}
                          </span>
                        </div>
                        <span className="text-lg text-green-600 font-semibold">
                          -₦{discountDetails.discount_amount.toLocaleString()}
                        </span>
                      </div>

                      <div className="border-t border-green-200 pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-900">
                            You Pay:
                          </span>
                          <div className="text-right">
                            <span className="text-2xl font-bold text-green-600">
                              ₦{discountDetails.final_amount.toLocaleString()}
                            </span>
                            <p className="text-xs text-green-600 mt-1">
                              You save ₦
                              {discountDetails.discount_amount.toLocaleString()}
                              !
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium text-gray-900">
                        Registration Fee:
                      </span>
                      <span className="text-2xl font-bold text-gray-900">
                        ₦{REGISTRATION_FEE.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      One-time payment to activate your account
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 bg-primary-50 p-4 rounded-lg border border-primary-100">
              <h4 className="font-medium text-primary-900 mb-3">
                Complete your registration to enjoy our comprehensive property
                management services
              </h4>

              <div className="space-y-2">
                <p className="text-sm text-gray-700 font-medium">
                  As a Landlord/Property Manager, you&apos;ll get:
                </p>
                <ul className="text-sm text-gray-600 space-y-1 ml-5 list-disc">
                  <li>
                    Rent Collection and Accounting (Receipt Issuing and Rental
                    Remittance)
                  </li>
                  <li>Rental Income Guarantee</li>
                  <li>
                    Rental Administration (Lease Payment, Renewal, Termination,
                    and Replacement)
                  </li>
                  <li>Quick Apartment Placement</li>
                  <li>Tenant Verification</li>
                  <li>Access to exclusive home services</li>
                  <li>Property Valuation/Rent Review</li>
                  <li>
                    Legal Support and Dispute Resolution (Optional if you
                    already have your lawyer)
                  </li>
                  <li>Property Advertising</li>
                  <li>
                    Access to quality and affordable property maintenance,
                    repair, renovation and improvement
                  </li>
                </ul>
                <p className="text-sm text-gray-700 font-medium mt-3">
                  Service Fee: 5% to 10% of annual rent
                </p>
              </div>
            </div>

            {/* Discount Code Section */}
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">%</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900">
                  Have a Discount Code?
                </h4>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Apply your discount code to save on your registration fee and
                unlock exclusive benefits!
              </p>

              {!codeValidated ? (
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={discountCode}
                        onChange={(e) =>
                          setDiscountCode(e.target.value.toUpperCase())
                        }
                        placeholder="Enter your discount code"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                        disabled={isValidatingCode}
                      />
                      {discountCode && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </div>
                    <InteractiveButton
                      onClick={validateDiscountCode}
                      disabled={!discountCode.trim() || isValidatingCode}
                      className="!px-6 !py-3 !text-sm !bg-blue-600 !hover:bg-blue-700 !shadow-md"
                    >
                      {isValidatingCode ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Validating...
                        </div>
                      ) : (
                        "Apply Code"
                      )}
                    </InteractiveButton>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-lg">✓</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-green-800">
                          Discount Code Applied Successfully!
                        </p>
                        <p className="text-xs text-green-600">
                          Code:{" "}
                          <span className="font-mono font-bold">
                            {discountCode}
                          </span>
                          {discountDetails && (
                            <span className="ml-2">
                              • You save ₦
                              {discountDetails.discount_amount.toLocaleString()}
                              {discountDetails.discount_percentage &&
                                ` (${discountDetails.discount_percentage}%)`}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={removeDiscountCode}
                      className="text-xs text-red-600 hover:text-red-800 underline font-medium"
                    >
                      Remove
                    </button>
                  </div>

                  {discountDetails?.description && (
                    <div className="mt-3 p-2 bg-white/50 rounded border border-green-100">
                      <p className="text-xs text-green-700">
                        <span className="font-medium">
                          About this discount:
                        </span>{" "}
                        {discountDetails.description}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6">
              <div className="grid grid-cols-1 gap-3">
                <InteractiveButton
                  disabled={!user || !paystackPaymentConfig}
                  onClick={() => {
                    const onSuccess = (reference) => {
                      console.log("Payment successful. Reference:", reference);
                      handlePaymentSuccess(reference);
                    };

                    const onClose = () => {
                      console.log("Payment modal closed");
                      toast.error("Payment was not completed");
                    };

                    initializePayment({
                      onSuccess,
                      onClose,
                      config: paystackConfig,
                    });
                  }}
                  className="!flex items-center justify-center gap-2"
                >
                  <span>
                    Pay ₦{finalAmount.toLocaleString()} with Paystack
                    {discountDetails && (
                      <span className="text-xs ml-1">
                        (Save ₦
                        {discountDetails.discount_amount.toLocaleString()})
                      </span>
                    )}
                  </span>
                  <span className="w-4 h-4"></span>
                </InteractiveButton>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-500">
              <p>
                By completing this payment, you agree to our{" "}
                <a
                  href="/terms"
                  className="text-primary-900 hover:text-primary-900"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  className="text-primary-900 hover:text-primary-900"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
