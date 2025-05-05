import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState, useRef, useEffect } from "react";
import { HiMenu, HiX, HiChevronDown } from "react-icons/hi";
import { FiLogOut, FiUser, FiSettings } from "react-icons/fi";

export default function NavLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isBookDropdownOpen, setIsBookDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setIsUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    {
      name: "Let Now",
      href: "#",
      isDropdown: true,
      dropdownItems: [
        { name: "Rental Apartments", href: "/book-now?category=rent" },
        { name: "Shortlet Apartments", href: "/book-now?category=shortlet" },
      ],
    },
    { name: "FAQ", href: "/faq" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  const handleDashboardClick = () => {
    if (user.role === "admin") {
      navigate("/admin/dashboard");
    } else if (user.role === "user") {
      navigate("/user/dashboard");
    } else if (user.role === "owner") {
      navigate("/owner/dashboard");
    }
    setIsUserDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsUserDropdownOpen(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Payment notification banner */}
      {isAuthenticated &&
        (!user?.is_active ||
          user?.registration_payment_status === "pending") && (
          <div className="bg-accent-500 text-white py-2 px-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <p className="text-sm">
                Your account is not active. Please complete your registration
                payment.
              </p>
              <button
                onClick={() => navigate("/auth/registration-payment")}
                className="text-xs bg-white text-accent-500 px-3 py-1 rounded-full font-medium hover:bg-accent-100"
              >
                Pay Now
              </button>
            </div>
          </div>
        )}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-xl font-bold text-primary-600">
                  <img src="/logo.png" alt="Aplet360" className="w-16 h-auto" />
                </Link>
              </div>

              {/* Desktop Navigation Links */}
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8 items-center">
                {navigation.map((item) =>
                  item.isDropdown ? (
                    <div key={item.name} className="relative">
                      <button
                        onClick={() =>
                          setIsBookDropdownOpen(!isBookDropdownOpen)
                        }
                        className={`${
                          location.pathname.startsWith("/book-now")
                            ? "border-primary-500 text-tertiary-900"
                            : "border-transparent text-tertiary-500 hover:border-tertiary-300 hover:text-tertiary-700"
                        } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                      >
                        {item.name}
                        <HiChevronDown
                          className={`ml-1 h-4 w-4 transition-transform ${
                            isBookDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {isBookDropdownOpen && (
                        <div className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                          <div
                            className="py-1"
                            role="menu"
                            aria-orientation="vertical"
                          >
                            {item.dropdownItems.map((dropdownItem) => (
                              <Link
                                key={dropdownItem.name}
                                to={dropdownItem.href}
                                className="block px-4 py-2 text-sm text-tertiary-700 hover:bg-tertiary-100"
                                role="menuitem"
                                onClick={() => setIsBookDropdownOpen(false)}
                              >
                                {dropdownItem.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`${
                        location.pathname === item.href
                          ? "border-primary-500 text-tertiary-900"
                          : "border-transparent text-tertiary-500 hover:border-tertiary-300 hover:text-tertiary-700"
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                    >
                      {item.name}
                    </Link>
                  )
                )}
              </div>
            </div>

            {/* Right side buttons */}
            <div className="flex items-center">
              <div className="hidden sm:flex items-center">
                {isAuthenticated ? (
                  <div className="relative" ref={userDropdownRef}>
                    <button
                      onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                      className="flex items-center space-x-3 focus:outline-none"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full overflow-hidden bg-primary-100">
                          {user.photo?.url ? (
                            <img
                              src={user.photo.url}
                              alt={`${user.first_name} ${user.last_name}`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-primary-600 font-medium">
                              {user.first_name?.[0]}
                              {user.last_name?.[0]}
                            </div>
                          )}
                        </div>
                        <span className="text-sm font-medium text-tertiary-700">
                          {user.first_name} {user.last_name}
                        </span>
                        <HiChevronDown
                          className={`h-4 w-4 text-tertiary-500 transition-transform ${
                            isUserDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </button>

                    {isUserDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                        <div className="py-1" role="menu">
                          <div className="px-4 py-2 border-b border-tertiary-100">
                            <p className="text-sm font-medium text-tertiary-900">
                              {user.first_name} {user.last_name}
                            </p>
                            <p className="text-xs text-tertiary-500 truncate">
                              {user.email}
                            </p>
                          </div>
                          <button
                            onClick={handleDashboardClick}
                            className="w-full flex items-center px-4 py-2 text-sm text-tertiary-700 hover:bg-tertiary-100"
                            role="menuitem"
                          >
                            <FiUser className="mr-3 h-4 w-4" />
                            Dashboard
                          </button>
                          <button
                            onClick={() => {
                              navigate("/settings");
                              setIsUserDropdownOpen(false);
                            }}
                            className="w-full flex items-center px-4 py-2 text-sm text-tertiary-700 hover:bg-tertiary-100"
                            role="menuitem"
                          >
                            <FiSettings className="mr-3 h-4 w-4" />
                            Settings
                          </button>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            role="menuitem"
                          >
                            <FiLogOut className="mr-3 h-4 w-4" />
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Link
                      to="/auth/login"
                      className="text-tertiary-700 hover:text-tertiary-900"
                    >
                      Login
                    </Link>
                    <Link
                      to="/auth/register"
                      className="bg-primary-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-600 transition-colors"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="flex items-center sm:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-tertiary-400 hover:text-tertiary-500 hover:bg-tertiary-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                >
                  <span className="sr-only">Open main menu</span>
                  {isOpen ? (
                    <HiX className="block h-6 w-6" />
                  ) : (
                    <HiMenu className="block h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isOpen ? "block" : "hidden"} sm:hidden`}>
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) =>
              item.isDropdown ? (
                <div key={item.name}>
                  <button
                    onClick={() => setIsBookDropdownOpen(!isBookDropdownOpen)}
                    className={`${
                      location.pathname.startsWith("/book-now")
                        ? "bg-primary-50 border-primary-500 text-primary-700"
                        : "border-transparent text-tertiary-600 hover:bg-tertiary-50 hover:border-tertiary-300 hover:text-tertiary-800"
                    } w-full flex items-center justify-between pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                  >
                    {item.name}
                    <HiChevronDown
                      className={`h-5 w-5 transition-transform ${
                        isBookDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isBookDropdownOpen && (
                    <div className="bg-tertiary-50">
                      {item.dropdownItems.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.name}
                          to={dropdownItem.href}
                          onClick={() => {
                            setIsBookDropdownOpen(false);
                            setIsOpen(false);
                          }}
                          className="block pl-8 pr-4 py-2 text-base font-medium text-tertiary-600 hover:bg-tertiary-100"
                        >
                          {dropdownItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`${
                    location.pathname === item.href
                      ? "bg-primary-50 border-primary-500 text-primary-700"
                      : "border-transparent text-tertiary-600 hover:bg-tertiary-50 hover:border-tertiary-300 hover:text-tertiary-800"
                  } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                >
                  {item.name}
                </Link>
              )
            )}
            {/* Mobile auth buttons */}
            {isAuthenticated ? (
              <div className="mt-4 pt-4 border-t border-tertiary-200">
                <div className="px-4 py-2 flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full overflow-hidden bg-primary-100">
                    {user.photo?.url ? (
                      <img
                        src={user.photo.url}
                        alt={`${user.first_name} ${user.last_name}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-primary-600 font-medium">
                        {user.first_name?.[0]}
                        {user.last_name?.[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-tertiary-900">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-xs text-tertiary-500">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleDashboardClick();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-tertiary-500 hover:text-tertiary-800 hover:bg-tertiary-100"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    navigate("/settings");
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-tertiary-500 hover:text-tertiary-800 hover:bg-tertiary-100"
                >
                  Settings
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-red-600 hover:text-red-800 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t border-tertiary-200">
                <Link
                  to="/auth/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-base font-medium text-tertiary-500 hover:text-tertiary-800 hover:bg-tertiary-100"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-base font-medium text-tertiary-500 hover:text-tertiary-800 hover:bg-tertiary-100"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-tertiary-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-tertiary-400 tracking-wider uppercase">
                Company
              </h3>
              <div className="mt-4 space-y-4">
                <Link
                  to="/about"
                  className="text-base text-tertiary-500 hover:text-tertiary-900 block"
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="text-base text-tertiary-500 hover:text-tertiary-900 block"
                >
                  Contact
                </Link>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-tertiary-400 tracking-wider uppercase">
                Support
              </h3>
              <div className="mt-4 space-y-4">
                <Link
                  to="/faq"
                  className="text-base text-tertiary-500 hover:text-tertiary-900 block"
                >
                  FAQ
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-tertiary-200 pt-8">
            <p className="text-base text-tertiary-400 text-center">
              © {new Date().getFullYear()} Aplet360. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
