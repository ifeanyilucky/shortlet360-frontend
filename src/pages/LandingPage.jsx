import {
  FiChevronDown,
  FiStar,
  FiShield,
  FiHome,
  FiDollarSign,
} from "react-icons/fi";
import { MdApartment, MdOutlineVerified } from "react-icons/md";
import {
  BsCreditCard2Front,
  BsCalendarCheck,
  BsShieldCheck,
  BsArrowRight,
  BsHouseDoor,
} from "react-icons/bs";
import { HiUsers } from "react-icons/hi";
import {
  RiSecurePaymentLine,
  RiMoneyDollarCircleLine,
  RiHandHeartLine,
} from "react-icons/ri";
import { IoLocationOutline, IoHomeOutline } from "react-icons/io5";
import { BiBed, BiBath, BiSupport } from "react-icons/bi";
import { HiOutlineUsers } from "react-icons/hi2";
import { useState, useEffect } from "react";
import { propertyStore } from "../store/propertyStore";
import { Link, useNavigate } from "react-router-dom";
import { fCurrency } from "@utils/formatNumber";
import "../styles/testimonials.css";

export default function LandingPage() {
  const navigate = useNavigate();
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const [searchParams, setSearchParams] = useState({
    location: "",
    priceRange: { from: "", to: "" },
    bedrooms: "1",
    category: "rent", // Default to rent
  });
  const { properties, getProperties, isLoading } = propertyStore();

  useEffect(() => {
    getProperties();
  }, [getProperties]);

  const handlePriceSubmit = () => {
    setShowPriceDropdown(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();

    if (searchParams.location) {
      queryParams.append("search", searchParams.location);
    }
    if (searchParams.priceRange.from) {
      queryParams.append("minPrice", searchParams.priceRange.from);
    }
    if (searchParams.priceRange.to) {
      queryParams.append("maxPrice", searchParams.priceRange.to);
    }
    if (searchParams.bedrooms) {
      queryParams.append("bedrooms", searchParams.bedrooms);
    }
    if (searchParams.category) {
      queryParams.append("category", searchParams.category);
    }

    navigate(`/book-now?${queryParams.toString()}`);
  };

  return (
    <div>
      <section className="min-h-screen bg-gradient-to-b from-primary-600 to-primary-700 text-white h-full mt-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10"></div>
        <div className="max-w-6xl mx-auto px-4 text-center pt-20 pb-10 relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Quality Apartments{" "}
            <span className="text-accent-300 bg-clip-text text-transparent bg-gradient-to-r from-accent-300 to-accent-500">
              For Everyone
            </span>
          </h1>

          <p className="text-primary-100 max-w-3xl mx-auto mb-12 text-base md:text-lg px-4 animate-slide-up">
            Aplet360 is your premier platform for finding and renting quality
            apartments across Nigeria. Whether you're looking for a long-term
            home or a short-term stay, find the perfect furnished apartment with
            flexible payment options and hassle-free management.
          </p>

          {/* Search Section */}
          <form
            onSubmit={handleSearch}
            className="bg-white/95 backdrop-blur-sm p-6 rounded-3xl md:rounded-full flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 max-w-4xl mx-auto px-6 shadow-elevated border border-white/20 animate-slide-up"
          >
            <div className="flex-1 text-left">
              <p className="text-xs text-primary-600 font-medium mb-1">
                LOCATION
              </p>
              <input
                type="text"
                placeholder="Where would you like to stay?"
                className="bg-transparent w-full outline-none text-sm text-tertiary-700 placeholder-tertiary-400"
                value={searchParams.location}
                onChange={(e) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex-1 text-left md:border-x border-tertiary-200 md:px-4 relative">
              <p className="text-xs text-primary-600 font-medium mb-1">PRICE</p>
              <button
                type="button"
                onClick={() => setShowPriceDropdown(!showPriceDropdown)}
                className="flex items-center justify-between w-full text-sm text-tertiary-700 hover:text-primary-600 transition-colors"
              >
                <span>
                  {searchParams.priceRange.from || searchParams.priceRange.to
                    ? `₦${searchParams.priceRange.from || 0} - ₦${
                        searchParams.priceRange.to || "∞"
                      }`
                    : "Price range"}
                </span>
                <FiChevronDown
                  className={`transform transition-transform ${
                    showPriceDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showPriceDropdown && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-xl p-4 w-full md:w-64 shadow-elevated z-50 border border-tertiary-100">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-primary-600 font-medium mb-2">
                        FROM
                      </p>
                      <input
                        type="number"
                        value={searchParams.priceRange.from}
                        onChange={(e) =>
                          setSearchParams((prev) => ({
                            ...prev,
                            priceRange: {
                              ...prev.priceRange,
                              from: e.target.value,
                            },
                          }))
                        }
                        className="w-full bg-tertiary-50 rounded-lg p-2 text-sm outline-none text-tertiary-700 border border-tertiary-200 focus:border-primary-400 transition-colors"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-primary-600 font-medium mb-2">
                        TO
                      </p>
                      <input
                        type="number"
                        value={searchParams.priceRange.to}
                        onChange={(e) =>
                          setSearchParams((prev) => ({
                            ...prev,
                            priceRange: {
                              ...prev.priceRange,
                              to: e.target.value,
                            },
                          }))
                        }
                        className="w-full bg-tertiary-50 rounded-lg p-2 text-sm outline-none text-tertiary-700 border border-tertiary-200 focus:border-primary-400 transition-colors"
                      />
                    </div>
                    <div className="flex justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSearchParams((prev) => ({
                            ...prev,
                            priceRange: { from: "", to: "" },
                          }));
                          setShowPriceDropdown(false);
                        }}
                        className="flex-1 px-4 py-2 text-sm rounded-lg bg-tertiary-100 hover:bg-tertiary-200 text-tertiary-700 transition-colors"
                      >
                        Clear
                      </button>
                      <button
                        type="button"
                        onClick={handlePriceSubmit}
                        className="flex-1 px-4 py-2 text-sm rounded-lg bg-primary-500 hover:bg-primary-600 text-white transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 text-left">
              <p className="text-xs text-primary-600 font-medium mb-1">
                BEDROOMS
              </p>
              <select
                className="w-full bg-transparent outline-none text-sm text-tertiary-700 hover:text-primary-600 transition-colors"
                value={searchParams.bedrooms}
                onChange={(e) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    bedrooms: e.target.value,
                  }))
                }
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>

            <div className="flex-1 text-left md:border-x border-tertiary-200 md:px-4">
              <p className="text-xs text-primary-600 font-medium mb-1">TYPE</p>
              <select
                className="w-full bg-transparent outline-none text-sm text-tertiary-700 hover:text-primary-600 transition-colors"
                value={searchParams.category}
                onChange={(e) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
              >
                <option value="rent">Rent</option>
                <option value="shortlet">Shortlet</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full md:w-auto bg-accent-500 hover:bg-accent-600 px-8 py-3 rounded-full whitespace-nowrap text-sm text-white transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Search now
            </button>
          </form>
        </div>

        <div className="w-full h-[300px] md:h-[500px] overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-t from-primary-700/50 to-transparent z-10"></div>
          <img
            src={"/images/living-room.jpg"}
            alt="Hero"
            className="w-full h-full object-cover object-bottom transform scale-110"
          />
        </div>
      </section>

      {/* Book in 4 minutes section */}
      <section className="py-20 bg-gradient-to-b from-white to-tertiary-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Find your perfect space in{" "}
              <span className="text-primary-600 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-500">
                4 simple steps
              </span>
            </h2>
            <p className="text-tertiary-600 max-w-3xl mx-auto text-lg">
              Our streamlined process makes finding and securing your ideal
              apartment quick and hassle-free, whether for long-term rentals or
              short-term stays.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <IoHomeOutline className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="font-semibold text-xl mb-6 text-tertiary-900">
                Search
              </h3>
              <p className="text-tertiary-600 text-sm text-center">
                Find your ideal space by location, price, and amenities for rent
                or shortlet
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BsCalendarCheck className="w-7 h-7 text-accent-600" />
              </div>
              <h3 className="font-semibold text-xl mb-6 text-tertiary-900">
                Select
              </h3>
              <p className="text-tertiary-600 text-sm text-center">
                Choose your preferred property and rental duration that fits
                your needs
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <RiSecurePaymentLine className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="font-semibold text-xl mb-6 text-tertiary-900">
                Pay
              </h3>
              <p className="text-tertiary-600 text-sm text-center">
                Choose from flexible payment options for both rentals and
                shortlets
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MdApartment className="w-7 h-7 text-accent-600" />
              </div>
              <h3 className="font-semibold text-xl mb-6 text-tertiary-900">
                Move In
              </h3>
              <p className="text-tertiary-600 text-sm text-center">
                Get your keys and enjoy your new space with all amenities ready
                for you
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/book-now"
              className="bg-primary-500 text-white px-8 py-4 rounded-full inline-flex items-center gap-2 hover:bg-primary-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span className="font-medium">Book Now</span>
              <BsArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-10 mx-auto bg-white">
        <div className="py-20">
          <p className="text-accent-500 font-semibold mb-4">WHY APLET360</p>

          <div className="flex flex-col md:flex-row gap-8 md:gap-20 mb-16">
            <div className="flex-1">
              <h2 className="text-3xl md:text-5xl font-bold text-tertiary-900">
                Benefits for everyone
                <br />
                in the property
                <br />
                ecosystem.
              </h2>
            </div>
            <div className="flex-1">
              <p className="text-tertiary-600 text-lg">
                Are you looking for your next apartment to rent? Or you are a
                landlord looking for tenants to occupy your apartments? Or you
                are a property manager looking for the best solution to bloom
                your real estate business and fill up your shortlet apartments?
                Aplet360 is for you. We have everyone's interest at heart.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Landlords/Agents Benefits */}
            <div className="bg-white p-8 rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1 border border-tertiary-100">
              <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                <IoHomeOutline className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="font-semibold text-xl mb-6 text-tertiary-900">
                For Landlords & Agents
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary-50 rounded-xl flex items-center justify-center mt-0.5 flex-shrink-0">
                    <RiMoneyDollarCircleLine className="w-4 h-4 text-primary-600" />
                  </div>
                  <p className="text-tertiary-600">
                    <span className="font-medium text-tertiary-900">
                      Maximize Returns
                    </span>{" "}
                    - Higher occupancy rates and optimized pricing
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary-50 rounded-xl flex items-center justify-center mt-0.5 flex-shrink-0">
                    <BsShieldCheck className="w-4 h-4 text-primary-600" />
                  </div>
                  <p className="text-tertiary-600">
                    <span className="font-medium text-tertiary-900">
                      Verified Tenants
                    </span>{" "}
                    - Quality tenants with thorough screening process
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary-50 rounded-xl flex items-center justify-center mt-0.5 flex-shrink-0">
                    <BsCalendarCheck className="w-4 h-4 text-primary-600" />
                  </div>
                  <p className="text-tertiary-600">
                    <span className="font-medium text-tertiary-900">
                      Flexible Listings
                    </span>{" "}
                    - List for long-term rentals or short-term stays
                  </p>
                </div>
              </div>
            </div>

            {/* Tenants Benefits */}
            <div className="bg-white p-8 rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1 border border-tertiary-100">
              <div className="w-14 h-14 bg-accent-100 rounded-2xl flex items-center justify-center mb-6">
                <HiOutlineUsers className="w-7 h-7 text-accent-600" />
              </div>
              <h3 className="font-semibold text-xl mb-6 text-tertiary-900">
                For Tenants
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-accent-50 rounded-xl flex items-center justify-center mt-0.5 flex-shrink-0">
                    <RiHandHeartLine className="w-4 h-4 text-accent-600" />
                  </div>
                  <p className="text-tertiary-600">
                    <span className="font-medium text-tertiary-900">
                      Rental Assistance
                    </span>{" "}
                    - We pay your landlord the full rent while you pay us
                    monthly
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-accent-50 rounded-xl flex items-center justify-center mt-0.5 flex-shrink-0">
                    <BsCreditCard2Front className="w-4 h-4 text-accent-600" />
                  </div>
                  <p className="text-tertiary-600">
                    <span className="font-medium text-tertiary-900">
                      Monthly Rental Payment
                    </span>{" "}
                    - Flexible payment options with convenient monthly plans
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-accent-50 rounded-xl flex items-center justify-center mt-0.5 flex-shrink-0">
                    <FiShield className="w-4 h-4 text-accent-600" />
                  </div>
                  <p className="text-tertiary-600">
                    <span className="font-medium text-tertiary-900">
                      Tenant Protection
                    </span>{" "}
                    - No sudden eviction from your apartment by your landlord
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-accent-50 rounded-xl flex items-center justify-center mt-0.5 flex-shrink-0">
                    <MdOutlineVerified className="w-4 h-4 text-accent-600" />
                  </div>
                  <p className="text-tertiary-600">
                    <span className="font-medium text-tertiary-900">
                      Verified Apartments
                    </span>{" "}
                    - No risk of being scammed by fake listings
                  </p>
                </div>
              </div>
            </div>

            {/* Property Managers Benefits */}
            <div className="bg-white p-8 rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1 border border-tertiary-100">
              <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                <BsArrowRight className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="font-semibold text-xl mb-6 text-tertiary-900">
                For Property Managers
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary-50 rounded-xl flex items-center justify-center mt-0.5 flex-shrink-0">
                    <FiStar className="w-4 h-4 text-primary-600" />
                  </div>
                  <p className="text-tertiary-600">
                    <span className="font-medium text-tertiary-900">
                      Streamlined Operations
                    </span>{" "}
                    - Efficient booking and management tools
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary-50 rounded-xl flex items-center justify-center mt-0.5 flex-shrink-0">
                    <HiUsers className="w-4 h-4 text-primary-600" />
                  </div>
                  <p className="text-tertiary-600">
                    <span className="font-medium text-tertiary-900">
                      Guest Management
                    </span>{" "}
                    - Simplified check-in/out and communication
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary-50 rounded-xl flex items-center justify-center mt-0.5 flex-shrink-0">
                    <BsCreditCard2Front className="w-4 h-4 text-primary-600" />
                  </div>
                  <p className="text-tertiary-600">
                    <span className="font-medium text-tertiary-900">
                      Automated Payments
                    </span>{" "}
                    - Secure payment processing and reporting
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-10 mx-auto">
        <div className="py-12 md:py-20">
          <p className="text-accent-600 font-medium mb-4">LISTINGS</p>

          <div className="flex flex-col md:flex-row gap-8 md:gap-20 mb-12">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold">
                Explore amazing spaces
                <br />
                on Aplet360 with flexible
                <br />
                payment options.
              </h2>
            </div>
            <div className="flex-1">
              <p className="text-gray-600 text-sm md:text-base">
                Aplet360-managed apartments are move-in ready and all bills
                inclusive. Living essentials including cooking gas supply, 24/7
                power supply, treated water, waste management and facility
                maintenance including plumbing and AC service.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12">
                Loading...
              </div>
            ) : !properties?.length ? (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12">
                <p className="text-gray-500">
                  No properties available at the moment.
                </p>
              </div>
            ) : (
              properties?.slice(0, 3).map((property) => (
                <div
                  key={property._id}
                  className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="h-48 md:h-64 overflow-hidden">
                    <img
                      src={
                        property.property_images?.[0]?.url ||
                        "/images/living-room.jpg"
                      }
                      alt={property.property_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-2">
                      <h3 className="font-semibold text-lg md:text-xl">
                        {property.property_name}
                      </h3>
                      <div className="flex items-center text-gray-600">
                        <IoLocationOutline className="w-4 h-4 mr-1" />
                        <span className="text-sm">{`${property.location.city}, ${property.location.state}`}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
                      <div className="flex items-center">
                        <BiBed className="w-5 h-5 mr-1" />
                        <span className="text-sm">
                          {property.bedroom_count} bed(s)
                        </span>
                      </div>
                      <div className="flex items-center">
                        <BiBath className="w-5 h-5 mr-1" />
                        <span className="text-sm">
                          {property.bathroom_count} bath(s)
                        </span>
                      </div>
                      <div className="flex items-center">
                        <HiOutlineUsers className="w-5 h-5 mr-1" />
                        <span className="text-sm">
                          {property.max_guests} guests
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <p className="text-gray-600 text-sm">From</p>
                        <p className="font-semibold">
                          {fCurrency(property.pricing.per_day.base_price)}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {property.pricing.per_day.is_active
                            ? "Per Day"
                            : null}
                        </p>
                      </div>
                      <div className="flex flex-col items-start md:items-end text-gray-500 text-xs">
                        <span>
                          Cleaning fee:{" "}
                          {fCurrency(property.pricing.per_day.cleaning_fee)}
                        </span>
                        <span>
                          Security deposit:{" "}
                          {fCurrency(property.pricing.per_day.security_deposit)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/book-now"
              className="w-full md:w-auto bg-primary-500 text-white px-8 py-3 rounded-full text-sm hover:bg-primary-600"
            >
              View Listings
            </Link>
          </div>
        </div>
      </section>

      {/* Gateway to affordable living section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-primary-500 font-medium mb-4">YOUR GATEWAY</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                To more <span className="text-accent-500">affordable</span>{" "}
                living
              </h2>
              <p className="text-gray-600 mb-8">
                Experience premium living without the premium price tag. Our
                apartments offer all the comforts of home at prices that make
                sense for your budget and lifestyle, with flexible monthly
                payment options designed for your convenience.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mt-1">
                    <RiMoneyDollarCircleLine className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Competitive Pricing</h3>
                    <p className="text-gray-600 text-sm">
                      Our rates are transparent and competitive, with no hidden
                      fees or surprise charges.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mt-1">
                    <BsShieldCheck className="w-5 h-5 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Secure Transactions</h3>
                    <p className="text-gray-600 text-sm">
                      Book with confidence knowing your payment and personal
                      information are protected.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src="/images/people-holding-key.webp"
                alt="Affordable Living"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Property Management section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 md:col-span-1 row-span-1">
                <img
                  src="https://images.pexels.com/photos/2343467/pexels-photo-2343467.jpeg"
                  alt="Kitchen"
                  className="w-full h-full object-cover rounded-lg shadow-md"
                />
              </div>
              <div className="col-span-2 md:col-span-1 row-span-1">
                <img
                  src="https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Living Room"
                  className="w-full h-full object-cover rounded-lg shadow-md"
                />
              </div>
              <div className="col-span-1 row-span-1">
                <img
                  src="https://images.pexels.com/photos/7327213/pexels-photo-7327213.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Happy Guests"
                  className="w-full h-full object-cover rounded-lg shadow-md"
                />
              </div>
              <div className="col-span-1 row-span-1">
                <img
                  src="/images/living-room2.jpeg"
                  alt="Bedroom"
                  className="w-full h-full object-cover rounded-lg shadow-md"
                />
              </div>
            </div>

            <div className="lg:pl-12">
              <p className="text-gray-500 uppercase font-medium mb-2">
                PROPERTY MANAGEMENT SOLUTIONS
              </p>
              <h2 className="text-3xl md:text-5xl font-bold text-primary-600 mb-6">
                Get the most reliable property management solutions in Lagos
              </h2>

              <div className="space-y-4 mt-8">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <p className="text-gray-700">
                    Listing creation and management
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <p className="text-gray-700">
                    Booking sourcing and management
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <p className="text-gray-700">Guest check-in and check-out</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <p className="text-gray-700">
                    Comprehensive laundry, cleaning & toiletries management
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <p className="text-gray-700">
                    24/7 maintenance and support services
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  to="/auth/login?property-management=true"
                  className="bg-primary-500 text-white px-8 py-3 rounded-full inline-flex items-center gap-2 hover:bg-primary-600 transition-colors"
                >
                  <span>Sign Up Now</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rent now, pay later section */}
      <section className="py-16 bg-primary-500 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Rent that apartment now and pay later
          </h2>
          <p className="max-w-3xl mx-auto mb-10 text-primary-100">
            Enjoy the flexibility of renting your perfect apartment today with
            our two convenient monthly payment options: Option 1 with 2% monthly
            interest on rent (upfront fees) or Option 2 with 3% monthly interest
            (all costs divided into monthly payments).
          </p>
          <Link
            to="/book-now"
            className="bg-white text-primary-500 px-8 py-3 rounded-full inline-flex items-center gap-2 hover:bg-primary-50 transition-colors font-medium"
          >
            <span>Explore Payment Options</span>
            <BsArrowRight />
          </Link>
        </div>
      </section>

      {/* Testimonials section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-primary-500 font-medium mb-2">TESTIMONIALS</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              People love us & you will love us too
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Don&apos;t just take our word for it. Here&apos;s what our
              customers have to say about their Aplet360 experience.
            </p>
          </div>
        </div>
        <div>
          <div className="relative overflow-hidden">
            <div
              className="flex gap-8 pb-4 auto-scroll-testimonials"
              style={{
                width: "max-content",
              }}
            >
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 w-80">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-500 font-semibold text-xl">
                      TA
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Tolu A.</h3>
                    <p className="text-gray-500 text-sm">Lagos, Nigeria</p>
                  </div>
                </div>
                <div className="flex text-yellow-400 mb-4">
                  <FiStar className="fill-current" />
                  <FiStar className="fill-current" />
                  <FiStar className="fill-current" />
                  <FiStar className="fill-current" />
                  <FiStar className="fill-current" />
                </div>
                <p className="text-gray-600 italic">
                  &quot;Aplet360 didn&apos;t just find me a home, they made it
                  livable instantly with their 360° services. Cleaning, setup,
                  everything was handled. Brilliant!&quot;
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 w-80">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-500 font-semibold text-xl">
                      JK
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">James K.</h3>
                    <p className="text-gray-500 text-sm">Lagos, Nigeria</p>
                  </div>
                </div>
                <div className="flex text-yellow-400 mb-4">
                  <FiStar className="fill-current" />
                  <FiStar className="fill-current" />
                  <FiStar className="fill-current" />
                  <FiStar className="fill-current" />
                  <FiStar className="fill-current" />
                </div>
                <p className="text-gray-600 italic">
                  &quot;I trust Aplet360 100%. Every apartment is exactly as
                  promised, and they respond immediately when needed.&quot;
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 w-80">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-500 font-semibold text-xl">
                      HR
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">HR Manager</h3>
                    <p className="text-gray-500 text-sm">Tech Firm, Abuja</p>
                  </div>
                </div>
                <div className="flex text-yellow-400 mb-4">
                  <FiStar className="fill-current" />
                  <FiStar className="fill-current" />
                  <FiStar className="fill-current" />
                  <FiStar className="fill-current" />
                  <FiStar className="fill-current" />
                </div>
                <p className="text-gray-600 italic">
                  &quot;They helped our company secure serviced apartments and
                  handled all maintenance professionally. True one-stop
                  shop!&quot;
                </p>
              </div>

              {/* Duplicate testimonials to create continuous scrolling effect */}
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 w-80">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-500 font-semibold text-xl">
                      TA
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Tolu A.</h3>
                    <p className="text-gray-500 text-sm">Lagos, Nigeria</p>
                  </div>
                </div>
                <div className="flex text-yellow-400 mb-4">
                  <FiStar className="fill-current" />
                  <FiStar className="fill-current" />
                  <FiStar className="fill-current" />
                  <FiStar className="fill-current" />
                  <FiStar className="fill-current" />
                </div>
                <p className="text-gray-600 italic">
                  &quot;Aplet360 didn&apos;t just find me a home, they made it
                  livable instantly with their 360° services. Cleaning, setup,
                  everything was handled. Brilliant!&quot;
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 w-80">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-500 font-semibold text-xl">
                      JK
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">James K.</h3>
                    <p className="text-gray-500 text-sm">Lagos, Nigeria</p>
                  </div>
                </div>
                <div className="flex text-yellow-400 mb-4">
                  <FiStar className="fill-current" />
                  <FiStar className="fill-current" />
                  <FiStar className="fill-current" />
                  <FiStar className="fill-current" />
                  <FiStar className="fill-current" />
                </div>
                <p className="text-gray-600 italic">
                  &quot;I trust Aplet360 100%. Every apartment is exactly as
                  promised, and they respond immediately when needed.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
