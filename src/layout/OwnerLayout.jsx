import { Link, Outlet, useLocation } from "react-router-dom";
import { HiHome } from "react-icons/hi";
import { BsCalendarCheck, BsClockHistory } from "react-icons/bs";
import { FiSettings, FiTool, FiShield, FiHome } from "react-icons/fi";
import { BiHelpCircle } from "react-icons/bi";
import { RiLogoutBoxLine } from "react-icons/ri";
import { MdOutlineAddHome } from "react-icons/md";
import { HiMenuAlt2 } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const OwnerLayout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const isActiveRoute = (path) => {
    // Remove trailing slash for consistent comparison
    const currentPath = location.pathname.replace(/\/$/, "");
    const menuPath = path.replace(/\/$/, "");

    // Handle dashboard special case
    if (menuPath === "/owner/dashboard") {
      return currentPath === "/owner" || currentPath === "/owner/dashboard";
    }

    return currentPath === menuPath;
  };

  const menuItems = [
    {
      path: "/",
      icon: <FiHome size={20} />,
      label: "Home",
      isExternal: true,
    },
    {
      path: "/owner/dashboard",
      icon: <HiHome size={20} />,
      label: "Dashboard",
    },
    {
      path: "/owner/apartments",
      icon: <MdOutlineAddHome size={20} />,
      label: "Apartments",
    },
    {
      path: "/owner/add-apartment",
      icon: <MdOutlineAddHome size={20} />,
      label: "Add Apartments",
    },
    {
      path: "/owner/bookings",
      icon: <BsClockHistory size={20} />,
      label: "Booking History",
    },
    {
      path: "/owner/service-request",
      icon: <FiTool size={20} />,
      label: "ApletFix",
    },
    {
      path: "/owner/dispute-resolution",
      icon: <FiShield size={20} />,
      label: "User Protect",
    },
    {
      path: "/owner/settings",
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
    <div className="flex h-screen relative">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-[9999] p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
      >
        {isMobileMenuOpen ? (
          <IoMdClose size={24} className="text-gray-700" />
        ) : (
          <HiMenuAlt2 size={24} className="text-gray-700" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Modified for responsiveness */}
      <div
        className={`fixed md:static w-64 bg-white shadow-lg flex-col h-full z-50 transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:flex`}
      >
        {/* Logo */}
        <div className="p-6 text-center flex justify-center items-center">
          <Link to="/">
            <img src={"/logo.png"} alt="logo" className="w-40 h-auto" />
          </Link>
        </div>

        {/* Main Menu */}
        <nav className="flex-1 px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                {item.isExternal ? (
                  <a
                    href={item.path}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-gray-600 hover:bg-gray-100"
                  >
                    <span className="text-gray-600">{item.icon}</span>
                    <span className="text-sm">{item.label}</span>
                  </a>
                ) : (
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
                )}
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

      {/* Main Content - Modified for responsiveness */}
      <div className="flex-1 overflow-auto p-5 md:ml-0 w-full">
        <div className="md:hidden h-12"></div>{" "}
        {/* Spacer for mobile menu button */}
        <Outlet />
      </div>
    </div>
  );
};

export default OwnerLayout;
