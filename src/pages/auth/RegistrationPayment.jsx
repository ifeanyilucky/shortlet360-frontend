import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import InteractiveButton from "../../components/InteractiveButton";
import { usePaystackPayment } from "react-paystack";
import { paystackConfig } from "../../config/paystack";
import { authService } from "../../services/api";
import LoadingOverlay from "../../components/LoadingOverlay";

// Registration fee in Naira - same for both user and owner roles
const REGISTRATION_FEE = 2000;

export default function RegistrationPayment() {
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already active or doesn't require payment, redirect to home
    if (user?.is_active || !user?.registration_payment_status === "pending") {
      navigate("/");
    }
  }, [user, navigate]);

  // Configure Paystack
  const paystackPaymentConfig = user
    ? paystackConfig({
        ...user,
        amount: REGISTRATION_FEE,
      })
    : null;

  const initializePayment = usePaystackPayment(paystackPaymentConfig || {});

  const handlePaymentSuccess = async (response) => {
    try {
      setIsLoading(true);

      // Call API to complete registration payment
      const result = await authService.completeRegistrationPayment(response);

      // Update user in context
      setUser(result.user);

      toast.success("Registration payment completed successfully!");

      // Navigate based on user role
      if (result.user.role === "owner") {
        navigate("/owner/dashboard");
      } else {
        navigate("/user/dashboard");
      }
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
          {user?.role === "owner"
            ? "Please make a payment to activate your Landlord/Property Manager account"
            : "Please make a payment to activate your Rental/Shortlet account"}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Registration Fee
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                A one-time fee to activate your account
              </p>
              <p className="mt-2 text-xl font-bold text-gray-900">
                ₦{REGISTRATION_FEE.toLocaleString()}
              </p>
            </div>

            <div className="mt-6 bg-primary-50 p-4 rounded-lg border border-primary-100">
              <h4 className="font-medium text-primary-700 mb-3">
                Complete your registration to enjoy the endless value that comes
                with using Aplet360
              </h4>

              {user?.role === "owner" ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-700 font-medium">
                    As a Landlord/Property Manager, you&apos;ll get:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 ml-5 list-disc">
                    <li>Listing creation and management tools</li>
                    <li>Access to verified tenants</li>
                    <li>Booking sourcing and management</li>
                    <li>Secure payment processing</li>
                    {/* <li>Property promotion to targeted audiences</li> */}
                    <li>24/7 maintenance and support services</li>
                  </ul>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-gray-700 font-medium">
                    As a Rental/Shortlet user, you&apos;ll get:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 ml-5 list-disc">
                    <li>Access to verified quality apartments</li>
                    <li>Flexible monthly payment options</li>
                    <li>Tenant protection and security</li>
                    <li>Transparent pricing with no hidden fees</li>
                    <li>Comprehensive home services</li>
                    <li>24/7 customer support</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-6">
              <div className="grid grid-cols-1 gap-3">
                <InteractiveButton
                  disabled={!user || !paystackPaymentConfig}
                  onClick={() => {
                    // Define onSuccess callback - this will be called by Paystack after successful payment
                    const onSuccess = (reference) => {
                      console.log("Payment successful. Reference:", reference);
                      handlePaymentSuccess(reference);
                    };

                    // Define onClose callback - this will be called if the user closes the payment modal
                    const onClose = () => {
                      console.log("Payment modal closed");
                      toast.error("Payment was not completed");
                    };

                    // Initialize Paystack payment with the callbacks
                    // This opens the Paystack payment modal
                    initializePayment({
                      onSuccess,
                      onClose,
                      config: paystackConfig,
                    });
                  }}
                  className="!flex items-center justify-center gap-2"
                >
                  <span>Pay with Paystack</span>
                  <span className="w-4 h-4"></span>
                </InteractiveButton>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-500">
              <p>
                By completing this payment, you agree to our{" "}
                <a
                  href="/terms"
                  className="text-primary-600 hover:text-primary-500"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  className="text-primary-600 hover:text-primary-500"
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
