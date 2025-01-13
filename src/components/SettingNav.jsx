import { Icon } from "@iconify/react/dist/iconify.js";
import { Outlet, Link, NavLink, useNavigate } from "react-router-dom";

const settings_nav = [
  { path: "profile", label: "Profile" },
  { path: "manage-subscription", label: "Manage Subscription" },
  { path: "help-and-support", label: "Help and Support" },
  { path: "withdrawal-account", label: "Withdrawal Account" },
  { path: "payment", label: "Payment" },
  { path: "change-password", label: "Change Password" },
  { path: "account", label: "Account" },
];
export default function SettingLayout() {
  const navigate = useNavigate();
  return (
    <div className="flex gap-10 h-full relative">
      <div className="bg-gray-100 p-4 rounded-lg max-h-full h-[calc(100vh-2rem)] w-[360px] sticky top-4">
        <div className="flex gap-3 items-center py-3 border-b border-gray-300">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-200 p-2 rounded-lg"
          >
            <Icon icon="hugeicons:arrow-left-02" fontSize={24} />
          </button>
          <h1 className="">Settings</h1>
        </div>
        <div className="flex gap-4 flex-col mt-5">
          {settings_nav.map((nav) => (
            <NavLink
              key={nav.path}
              to={nav.path}
              className={({ isActive }) =>
                `p-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-50 text-primary"
                    : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              {nav.label}
            </NavLink>
          ))}
        </div>
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
