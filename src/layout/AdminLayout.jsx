import { useState, useEffect } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  FiMenu,
  FiX,
  FiLogOut,
  FiUser,
  FiHome,
  FiUsers,
  FiKey,
  FiSettings,
  FiCalendar,
  FiList,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";
import { MdOutlineAddHome } from "react-icons/md";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { BsClockHistory } from "react-icons/bs";
import { RiAdminLine } from "react-icons/ri";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState({
    users: false,
  });
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSubmenu = (menu) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  // Auto-expand submenu based on current route
  useEffect(() => {
    if (location.pathname.includes("/admin/users")) {
      setExpandedMenus((prev) => ({ ...prev, users: true }));
    }
  }, [location.pathname]);

  const menuItems = [
    {
      path: "/admin/dashboard",
      icon: <FiHome size={20} />,
      label: "Dashboard",
    },
    {
      id: "users",
      icon: <FiUsers size={20} />,
      label: "Users",
      hasSubmenu: true,
      submenu: [
        {
          path: "/admin/users",
          label: "All Users",
        },
        {
          path: "/admin/users/regular",
          label: "Regular Users",
        },
        {
          path: "/admin/users/owners",
          label: "Property Owners",
        },
      ],
    },
    {
      path: "/admin/properties",
      icon: <MdOutlineAddHome size={20} />,
      label: "Properties",
    },
    {
      path: "/admin/bookings",
      icon: <FiCalendar size={20} />,
      label: "Bookings",
    },
    {
      path: "/admin/kyc",
      icon: <FiKey size={20} />,
      label: "KYC Verification",
    },
    {
      path: "/admin/referrals",
      icon: <FiUsers size={20} />,
      label: "Referral Management",
    },
    // {
    //   path: "/admin/reports",
    //   icon: <HiOutlineDocumentReport size={20} />,
    //   label: "Reports",
    // },
    {
      path: "/admin/settings",
      icon: <FiSettings size={20} />,
      label: "Settings",
    },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-white shadow-md transition-all duration-300 ease-in-out fixed h-full z-10`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          {isSidebarOpen ? (
            <Link to="/" className="flex items-center">
              <img src="/logo.png" alt="Logo" className="h-8" />
              <span className="ml-2 text-xl font-semibold text-blue-600">
                Admin
              </span>
            </Link>
          ) : (
            <div className="mx-auto">
              <RiAdminLine size={24} className="text-blue-600" />
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-blue-600 focus:outline-none"
          >
            {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        <nav className="mt-6">
          <ul>
            {menuItems.map((item, index) => (
              <li key={index} className="px-4 py-2">
                {item.hasSubmenu ? (
                  <div>
                    <button
                      onClick={() => toggleSubmenu(item.id)}
                      className={`flex items-center justify-between w-full p-2 rounded-md transition-colors ${
                        isActive(item.submenu[0].path)
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="mr-4">{item.icon}</span>
                        {isSidebarOpen && <span>{item.label}</span>}
                      </div>
                      {isSidebarOpen && (
                        <span>
                          {expandedMenus[item.id] ? (
                            <FiChevronDown size={16} />
                          ) : (
                            <FiChevronRight size={16} />
                          )}
                        </span>
                      )}
                    </button>
                    {expandedMenus[item.id] && isSidebarOpen && (
                      <ul className="pl-10 mt-2 space-y-2">
                        {item.submenu.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              to={subItem.path}
                              className={`block p-2 rounded-md transition-colors ${
                                isActive(subItem.path)
                                  ? "text-blue-600 bg-blue-50"
                                  : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                              }`}
                            >
                              {subItem.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center p-2 rounded-md transition-colors ${
                      isActive(item.path)
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    <span className="mr-4">{item.icon}</span>
                    {isSidebarOpen && <span>{item.label}</span>}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full border-t p-4">
          <div className="flex items-center mb-4">
            {isSidebarOpen && (
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className={`flex items-center ${
              isSidebarOpen ? "justify-start w-full" : "justify-center mx-auto"
            } text-gray-700 hover:text-red-600 hover:bg-red-50 p-2 rounded-md transition-colors`}
          >
            <FiLogOut size={20} />
            {isSidebarOpen && <span className="ml-4">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`${
          isSidebarOpen ? "ml-64" : "ml-20"
        } flex-1 transition-all duration-300 ease-in-out overflow-auto`}
      >
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              Admin Portal
            </h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <span className="text-sm font-medium text-gray-900">
                  {user?.first_name} {user?.last_name}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
