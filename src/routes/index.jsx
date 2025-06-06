import { Navigate, useRoutes, Outlet } from "react-router-dom";
import AuthLayout from "../layout/Auth";
import NavLayout from "../layout/NavLayout";
import GuestGuard from "../guards/GuestGuard";
import AuthGuard from "../guards/AuthGuard";
import RoleBasedGuard from "../guards/RoleBasedGuard";
import RegistrationPaymentGuard from "../guards/RegistrationPaymentGuard";
import ActiveUserGuard from "../guards/ActiveUserGuard";
import {
  About,
  Blog,
  LandingPage,
  BookNow,
  ContactUs,
  FAQ,
  HomeServices,
  Career,
  ReferralProgram,
  BecomeArtisan,
  Marketplace,
  PropertyManagementSolutions,
  PrivacyPolicy,
  TermsConditions,
} from "../pages";
import Login from "../pages/auth/login";
import Register from "../pages/auth/register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
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
import UserServiceRequest from "../pages/dashboard/user/ServiceRequest";
import UserDisputeResolution from "../pages/dashboard/user/DisputeResolution";
import OwnerServiceRequest from "../pages/dashboard/apartment-owner/ServiceRequest";
import OwnerDisputeResolution from "../pages/dashboard/apartment-owner/DisputeResolution";
// KYC Verification
import KycVerification from "../pages/kyc/KycVerification";
import VerifyEmail from "../pages/kyc/VerifyEmail";
// Admin
import AdminLayout from "../layout/AdminLayout";
import AdminDashboard from "../pages/dashboard/admin/dashboard";
import AdminUsers from "../pages/dashboard/admin/users";
import AdminRegularUsers from "../pages/dashboard/admin/regularUsers";
import AdminOwners from "../pages/dashboard/admin/owners";
import AdminProperties from "../pages/dashboard/admin/properties";
import AdminBookings from "../pages/dashboard/admin/bookings";
import AdminKyc from "../pages/dashboard/admin/kyc";
import AdminSettings from "../pages/dashboard/admin/settings";
import UserProfile from "../pages/dashboard/admin/userProfile";
import EditProperty from "../pages/dashboard/admin/EditProperty";
import EditBooking from "../pages/dashboard/admin/EditBooking";
import AdminReferrals from "../pages/dashboard/admin/referrals";
import AdminLogin from "../pages/admin/login";
import AdminSignup from "../pages/admin/signup";
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
        { path: "home-fix", element: <HomeServices /> },
        { path: "career", element: <Career /> },
        { path: "referral-program", element: <ReferralProgram /> },
        { path: "become-artisan", element: <BecomeArtisan /> },
        { path: "marketplace", element: <Marketplace /> },
        {
          path: "property-management-solutions",
          element: <PropertyManagementSolutions />,
        },
        { path: "privacy-policy", element: <PrivacyPolicy /> },
        { path: "terms-conditions", element: <TermsConditions /> },
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
            { path: "service-request", element: <UserServiceRequest /> },
            { path: "dispute-resolution", element: <UserDisputeResolution /> },
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
            { path: "service-request", element: <OwnerServiceRequest /> },
            { path: "dispute-resolution", element: <OwnerDisputeResolution /> },
            { path: "settings", element: <Settings /> },
            { path: "settings/kyc", element: <KycVerification /> },
          ],
        },
        {
          path: "admin",
          element: (
            <RoleBasedGuard accessibleRoles={["admin"]}>
              <AdminLayout />
            </RoleBasedGuard>
          ),
          children: [
            { path: "", element: <Navigate to="dashboard" replace /> },
            { path: "dashboard", element: <AdminDashboard /> },
            { path: "users", element: <AdminUsers /> },
            { path: "users/all", element: <AdminUsers /> },
            { path: "users/regular", element: <AdminRegularUsers /> },
            { path: "users/owners", element: <AdminOwners /> },
            { path: "users/:id", element: <UserProfile /> },
            { path: "properties", element: <AdminProperties /> },
            { path: "properties/:id", element: <EditProperty /> },
            { path: "bookings", element: <AdminBookings /> },
            { path: "bookings/:id", element: <EditBooking /> },
            { path: "kyc", element: <AdminKyc /> },
            { path: "referrals", element: <AdminReferrals /> },
            { path: "settings", element: <AdminSettings /> },
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
        { path: "forgot-password", element: <ForgotPassword /> },
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
    {
      path: "reset-password/:token",
      element: (
        <div className="min-h-screen bg-gray-50">
          <div className="flex justify-center items-center">
            <ResetPassword />
          </div>
        </div>
      ),
    },
    {
      path: "admin/login",
      element: <AdminLogin />,
    },
    {
      path: "admin/signup",
      element: <AdminSignup />,
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);

  return routes;
}
