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

  // If authenticated but account is not active, redirect to registration payment
  if (!user?.is_active || user?.registration_payment_status === "pending") {
    toast.error("Please complete your registration payment to access this page");
    return <Navigate to="/auth/registration-payment" />;
  }

  // If user is authenticated and active, allow access
  return <>{children}</>;
}

ActiveUserGuard.propTypes = {
  children: PropTypes.node,
};
