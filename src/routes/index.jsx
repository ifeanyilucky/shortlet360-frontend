import { Navigate, useRoutes, Outlet } from "react-router-dom";
import AuthLayout from "../layout/Auth";
import NavLayout from "../layout/NavLayout";
import GuestGuard from "../guards/GuestGuard";
import AuthGuard from "../guards/AuthGuard";
import RoleBasedGuard from "../guards/RoleBasedGuard";
import RegistrationPaymentGuard from "../guards/RegistrationPaymentGuard";
import ActiveUserGuard from "../guards/ActiveUserGuard";
import { About, Blog, LandingPage, BookNow, ContactUs, FAQ } from "../pages";
import Login from "../pages/auth/login";
import Register from "../pages/auth/register";
import RegistrationPayment from "../pages/auth/RegistrationPayment";
import UserDashboard from "../pages/dashboard/user/dashboard";
import OwnerDashboard from "../pages/dashboard/apartment-owner/dashboard";
import OwnerLayout from "../layout/OwnerLayout";
// Apartment Owner
import AddApartment from "../pages/dashboard/apartment-owner/add-apartment";
import EditApartment from "../pages/dashboard/apartment-owner/edit-apartment";
import Availability from "../pages/dashboard/apartment-owner/availability";
import Apartments from "../pages/dashboard/apartment-owner/apartments";
import Bookings from "../pages/dashboard/apartment-owner/bookings";
import Settings from "../pages/dashboard/apartment-owner/settings";
import PropertyDetail from "../pages/PropertyDetail";
import UserLayout from "../layout/UserLayout";
import Receipt from "../components/Receipt";
import UserBookingHistory from "../pages/dashboard/user/UserBookingHistory";
import Favorite from "../pages/dashboard/user/favorite";
// KYC Verification
import KycVerification from "../pages/kyc/KycVerification";
import VerifyEmail from "../pages/kyc/VerifyEmail";
export default function Router() {
  const routes = useRoutes([
    {
      path: "",
      element: <NavLayout />,
      children: [
        { path: "", element: <LandingPage /> },
        { path: "about", element: <About /> },
        { path: "book-now", element: <BookNow /> },
        { path: "faq", element: <FAQ /> },
        { path: "blog", element: <Blog /> },
        { path: "contact", element: <ContactUs /> },
        { path: "property/:id", element: <PropertyDetail /> },
        { path: "verify-email/:token", element: <VerifyEmail /> },
      ],
    },
    { path: "/:property_id/receipt/:booking_id", element: <Receipt /> },
    {
      path: "",
      element: (
        <AuthGuard>
          <Outlet />
        </AuthGuard>
      ),
      children: [
        {
          path: "user",
          element: (
            <RoleBasedGuard accessibleRoles={["user"]}>
              <ActiveUserGuard>
                <UserLayout />
              </ActiveUserGuard>
            </RoleBasedGuard>
          ),
          children: [
            { path: "", element: <Navigate to="dashboard" replace /> },
            { path: "dashboard", element: <UserDashboard /> },
            { path: "apartments", element: <Apartments /> },
            { path: "bookings", element: <UserBookingHistory /> },
            { path: "favorites", element: <Favorite /> },
            { path: "settings", element: <Settings /> },
            { path: "settings/kyc", element: <KycVerification /> },
          ],
        },
        {
          path: "owner",
          element: (
            <RoleBasedGuard accessibleRoles={["owner"]}>
              <ActiveUserGuard>
                <OwnerLayout />
              </ActiveUserGuard>
            </RoleBasedGuard>
          ),
          children: [
            { path: "", element: <Navigate to="dashboard" replace /> },
            { path: "dashboard", element: <OwnerDashboard /> },
            { path: "apartments", element: <Apartments /> },
            { path: "add-apartment", element: <AddApartment /> },
            { path: "edit-apartment/:id", element: <EditApartment /> },
            { path: "availability", element: <Availability /> },
            { path: "bookings", element: <Bookings /> },
            { path: "settings", element: <Settings /> },
            { path: "settings/kyc", element: <KycVerification /> },
          ],
        },
        { path: "", element: <Navigate to="/dashboard/user" replace /> },
      ],
    },
    {
      path: "auth",
      element: (
        <GuestGuard>
          <div className="min-h-screen bg-gray-50">
            <AuthLayout />
            <div className="flex justify-center items-center">
              <Outlet />
            </div>
          </div>
        </GuestGuard>
      ),
      children: [
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "", element: <Navigate to="/auth/login" replace /> },
      ],
    },
    {
      path: "auth/registration-payment",
      element: (
        <div className="min-h-screen bg-gray-50">
          <RegistrationPaymentGuard>
            <RegistrationPayment />
          </RegistrationPaymentGuard>
        </div>
      ),
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);

  return routes;
}
