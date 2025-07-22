import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
// hooks
import { useAuth } from "../hooks/useAuth";

// ----------------------------------------------------------------------

export default function GuestGuard({ children }) {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    // For owners, check if they need to complete payment first
    if (
      user.role === "owner" &&
      user.registration_payment_status === "pending"
    ) {
      return <Navigate to="/auth/registration-payment" />;
    }

    // Redirect to appropriate dashboard based on role
    if (user.role === "owner") {
      return <Navigate to="/owner/dashboard" />;
    } else if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else if (user.role === "user") {
      return <Navigate to="/user/dashboard" />;
    }

    // Fallback to home if role is not recognized
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

GuestGuard.propTypes = {
  children: PropTypes.node,
};
