import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

export default function ActiveUserGuard({ children }) {
  const { isAuthenticated, user } = useAuth();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  // Admin users don't need KYC or payment verification
  if (user?.role === "admin") {
    return <>{children}</>;
  }

  // For owners: check if account is active and payment is completed
  if (
    user?.role === "owner" &&
    (!user?.is_active || user?.registration_payment_status === "pending")
  ) {
    toast.error(
      "Please complete your registration payment to access this page"
    );
    return <Navigate to="/auth/registration-payment" />;
  }

  // // For users: no payment required, just check if account is active
  // if (user?.role === "user" && !user?.is_active) {
  //   toast.error("Your account is not active. Please contact support.");
  //   return <Navigate to="/" />;
  // }

  // If user is authenticated and active, allow access
  return <>{children}</>;
}

ActiveUserGuard.propTypes = {
  children: PropTypes.node,
};
