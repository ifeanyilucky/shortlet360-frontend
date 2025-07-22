import LandingPage from "../pages/LandingPage";

export default function HomeRedirect() {
  // Always show the landing page - let users navigate manually to their dashboards
  return <LandingPage />;
}
