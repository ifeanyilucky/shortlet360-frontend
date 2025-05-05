import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../hooks/useAuth";

export default function RegistrationPaymentGuard({ children }) {
  const { isAuthenticated, user } = useAuth();
  console.log("user", { isAuthenticated, user });
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  // If authenticated but doesn't require payment, redirect to home
  if (!user?.registration_payment_status === "pending") {
    return <Navigate to="/" />;
  }

  // If user requires payment, allow access to the payment page
  return <>{children}</>;
}

RegistrationPaymentGuard.propTypes = {
  children: PropTypes.node,
};
