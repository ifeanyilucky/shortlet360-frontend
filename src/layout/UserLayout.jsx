import { Link, Outlet, useLocation } from "react-router-dom";
import { HiHome } from "react-icons/hi";
import { BsCalendarCheck, BsClockHistory } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { BiHelpCircle } from "react-icons/bi";
import { RiLogoutBoxLine } from "react-icons/ri";
import { MdOutlineAddHome } from "react-icons/md";
import { useAuth } from "../hooks/useAuth";

// - Active bookings
// - Booking History
// - Complaint
// - Rate Apartment
// - Contact Support
const UserLayout = () => {
  const location = useLocation();

  const { user, logout } = useAuth();
  const isActiveRoute = (path) => {
    // Remove trailing slash for consistent comparison
    const currentPath = location.pathname.replace(/\/$/, "");
    const menuPath = path.replace(/\/$/, "");

    // Handle dashboard special case
    if (menuPath === "/user/dashboard") {
      return currentPath === "/user" || currentPath === "/user/dashboard";
    }

    return currentPath === menuPath;
  };

  const menuItems = [
    {
      path: "/user/dashboard",
      icon: <HiHome size={20} />,
      label: "Dashboard",
    },
    {
      path: "/user/bookings",
      icon: <BsClockHistory size={20} />,
      label: "Bookings",
    },
    // {
    //   path: "/user/payment-history",
    //   icon: <BsClockHistory size={20} />,
    //   label: "Payment History",
    // },

    {
      path: "/user/settings",
      icon: <FiSettings size={20} />,
      label: "Settings",
    },
  ];

  const handleLogout = () => {
    logout();
  };

  const bottomMenuItems = [
    { path: "/help", icon: <BiHelpCircle size={20} />, label: "Help Center" },
    {
      onClick: handleLogout,
      icon: <RiLogoutBoxLine size={20} />,
      label: "Log out",
    },
  ];

  const getMenuItemStyles = (path) => {
    const baseStyles =
      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ";
    const activeStyles = "bg-gray-900 text-white font-medium";
    const inactiveStyles = "text-gray-600 hover:bg-gray-100";

    return `${baseStyles} ${
      isActiveRoute(path) ? activeStyles : inactiveStyles
    }`;
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        {/* Logo */}
        <div className="p-6">
          <Link to="/">
            <h1 className="text-2xl font-bold">Shortlet360</h1>
          </Link>
        </div>

        {/* Main Menu */}
        <nav className="flex-1 px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link to={item.path} className={getMenuItemStyles(item.path)}>
                  <span
                    className={`${
                      isActiveRoute(item.path) ? "text-white" : "text-gray-600"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="text-sm">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Menu */}
        <div className="px-4 pb-6">
          <ul className="space-y-2">
            {bottomMenuItems.map((item, index) => (
              <li key={item.path || index}>
                {item.path ? (
                  <Link to={item.path} className={getMenuItemStyles(item.path)}>
                    <span
                      className={`${
                        isActiveRoute(item.path)
                          ? "text-white"
                          : "text-gray-600"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="text-sm">{item.label}</span>
                  </Link>
                ) : (
                  <button
                    onClick={item.onClick}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-gray-600 hover:bg-gray-100 w-full"
                  >
                    <span className="text-gray-600">{item.icon}</span>
                    <span className="text-sm">{item.label}</span>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-5">
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;
