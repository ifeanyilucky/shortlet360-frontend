import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  FiMenu,
  FiX,
  FiLogOut,
  FiHome,
  FiUsers,
  FiKey,
  FiSettings,
  FiCalendar,
  FiChevronDown,
  FiChevronRight,
  FiEdit3,
  FiPercent,
} from "react-icons/fi";
import { MdOutlineAddHome } from "react-icons/md";
import { RiAdminLine } from "react-icons/ri";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Start closed on mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({
    users: false,
  });
  const { user, logout } = useAuth();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Initialize sidebar state based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // Desktop: sidebar open by default
        setIsSidebarOpen(true);
        setIsMobileMenuOpen(false);
      } else {
        // Mobile: sidebar closed by default
        setIsSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();

    // Listen for window resize
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      label: "Pending KYC Verification",
    },
    {
      path: "/admin/verified-kyc",
      icon: <FiKey size={20} />,
      label: "Verified KYC",
    },
    {
      path: "/admin/discount-codes",
      icon: <FiPercent size={20} />,
      label: "Discount Codes",
    },
    {
      id: "form-submissions",
      label: "Form Submissions",
      icon: <FiEdit3 size={20} />,
      hasSubmenu: true,
      submenu: [
        {
          path: "/admin/form-submissions",
          label: "All Submissions",
        },
        {
          path: "/admin/forms/home-service",
          label: "Home Service Requests",
        },
        {
          path: "/admin/forms/contact",
          label: "Contact Forms",
        },
        {
          path: "/admin/forms/artisan-applications",
          label: "Artisan Applications",
        },
        {
          path: "/admin/forms/dispute-resolution",
          label: "Dispute Resolution",
        },
        {
          path: "/admin/forms/inspection-requests",
          label: "Inspection Requests",
        },
        {
          path: "/admin/forms/property-management",
          label: "Property Management",
        },
      ],
    },
    {
      path: "/admin/referrals",
      icon: <FiUsers size={20} />,
      label: "Referral Management",
    },
    {
      path: "/admin/blogs",
      icon: <FiEdit3 size={20} />,
      label: "Blog Management",
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
    <div className="flex h-screen bg-gray-100 relative">
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 left-4 z-[9999] p-2 rounded-lg bg-white shadow-md hover:bg-gray-50"
      >
        {isMobileMenuOpen ? (
          <FiX size={24} className="text-gray-700" />
        ) : (
          <FiMenu size={24} className="text-gray-700" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static bg-white shadow-lg h-full z-50 transition-all duration-300 ease-in-out flex flex-col ${
          // Mobile behavior - always full width (w-64) on mobile
          isMobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"
        } md:translate-x-0 ${
          // Desktop behavior
          isSidebarOpen ? "md:w-64" : "md:w-20"
        } ${
          // Ensure proper positioning
          "top-0 left-0"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b bg-white">
          {/* Always show full logo on mobile, responsive on desktop */}
          <div className="md:hidden flex-1">
            <Link to="/" className="flex items-center">
              <img src="/logo.png" alt="Logo" className="h-8" />
              <span className="ml-2 text-xl font-semibold text-blue-600">
                Admin
              </span>
            </Link>
          </div>

          {/* Desktop logo - responsive to sidebar state */}
          <div className="hidden md:flex md:flex-1 md:justify-center">
            {isSidebarOpen ? (
              <Link to="/" className="flex items-center">
                <img src="/logo.png" alt="Logo" className="h-8" />
                <span className="ml-2 text-xl font-semibold text-blue-600">
                  Admin
                </span>
              </Link>
            ) : (
              <div className="flex justify-center">
                <RiAdminLine size={24} className="text-blue-600" />
              </div>
            )}
          </div>

          {/* Desktop toggle button */}
          <button
            onClick={toggleSidebar}
            className="hidden md:block text-gray-500 hover:text-blue-600 focus:outline-none p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        <nav className="mt-6 flex-1 overflow-y-auto px-2">
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <li key={index}>
                {item.hasSubmenu ? (
                  <div>
                    <button
                      onClick={() => toggleSubmenu(item.id)}
                      className={`flex items-center justify-between w-full p-3 rounded-md transition-colors text-left ${
                        isActive(item.submenu[0].path)
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      <div className="flex items-center min-w-0 flex-1">
                        <span className="flex-shrink-0 mr-3">{item.icon}</span>
                        {/* Show label based on context */}
                        <span
                          className={`truncate ${
                            isSidebarOpen ? "md:block" : "md:hidden"
                          }`}
                        >
                          {item.label}
                        </span>
                      </div>
                      {/* Show chevron when label is visible */}
                      <span
                        className={`flex-shrink-0 ml-2 ${
                          isSidebarOpen ? "md:block" : "md:hidden"
                        }`}
                      >
                        {expandedMenus[item.id] ? (
                          <FiChevronDown size={16} />
                        ) : (
                          <FiChevronRight size={16} />
                        )}
                      </span>
                    </button>
                    {/* Submenu - only show when expanded and labels are visible */}
                    {expandedMenus[item.id] && (
                      <ul
                        className={`mt-2 space-y-1 ${
                          isSidebarOpen ? "md:block" : "md:hidden"
                        }`}
                      >
                        {item.submenu.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              to={subItem.path}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={`block p-2 pl-12 rounded-md transition-colors text-sm ${
                                isActive(subItem.path)
                                  ? "text-blue-600 bg-blue-50"
                                  : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                              }`}
                            >
                              <span className="truncate">{subItem.label}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center p-3 rounded-md transition-colors group ${
                      isActive(item.path)
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                    title={!isSidebarOpen ? item.label : undefined}
                  >
                    <span className="flex-shrink-0 mr-3">{item.icon}</span>
                    {/* Show label based on sidebar state */}
                    <span
                      className={`truncate ${
                        isSidebarOpen ? "md:block" : "md:hidden"
                      }`}
                    >
                      {item.label}
                    </span>
                    {/* Tooltip for collapsed state */}
                    {!isSidebarOpen && (
                      <div className="hidden md:group-hover:block absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded whitespace-nowrap z-50">
                        {item.label}
                      </div>
                    )}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t p-4 mt-auto">
          {/* User info - show when sidebar is expanded */}
          {isSidebarOpen && (
            <div className="mb-4 px-2">
              <div className="flex items-center">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="px-2">
            <button
              onClick={handleLogout}
              className={`flex items-center w-full text-gray-700 hover:text-red-600 hover:bg-red-50 p-3 rounded-md transition-colors group ${
                isSidebarOpen ? "justify-start" : "justify-center"
              }`}
              title={!isSidebarOpen ? "Logout" : undefined}
            >
              <FiLogOut size={20} className="flex-shrink-0" />
              {/* Show text when sidebar is expanded */}
              {isSidebarOpen && <span className="ml-3 truncate">Logout</span>}

              {/* Tooltip for collapsed state */}
              {!isSidebarOpen && (
                <div className="hidden md:group-hover:block absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded whitespace-nowrap z-50">
                  Logout
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out overflow-auto ${
          // No margin on mobile, responsive margin on desktop
          isSidebarOpen ? "" : "md:ml-20"
        }`}
      >
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            {/* Mobile: Add left padding for menu button */}
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 ml-12 md:ml-0">
              Admin Portal
            </h1>
            <div className="flex items-center space-x-4">
              <div className="relative hidden sm:block">
                <span className="text-sm font-medium text-gray-900">
                  {user?.first_name} {user?.last_name}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
