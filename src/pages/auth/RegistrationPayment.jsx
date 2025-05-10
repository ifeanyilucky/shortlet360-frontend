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
              <p className="mt-2 text-xl font-bold text-gray-900">
                ₦{REGISTRATION_FEE.toLocaleString()}
              </p>
            </div>

            <div className="mt-6 bg-primary-50 p-4 rounded-lg border border-primary-100">
              <h4 className="font-medium text-primary-700 mb-3">
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
                  <li>
                    Access to exclusive home services (Solar System, ApLet360
                    TeleMed, ApLet360 Pharmacy)
                  </li>
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
