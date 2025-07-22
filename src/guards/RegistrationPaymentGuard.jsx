import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../hooks/useAuth";

export default function RegistrationPaymentGuard({ children }) {
  const { isAuthenticated, user } = useAuth();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  // If user is not an owner, redirect to home
  if (user?.role !== "owner") {
    return <Navigate to="/" />;
  }

  // If owner is already active or has paid, redirect to owner dashboard
  if (user?.is_active || user?.registration_payment_status === "paid") {
    return <Navigate to="/owner/dashboard" />;
  }

  // If owner requires payment, allow access to the payment page
  return <>{children}</>;
}

RegistrationPaymentGuard.propTypes = {
  children: PropTypes.node,
};
