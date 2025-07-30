import { FiChevronDown, FiStar, FiShield } from "react-icons/fi";
import { MdApartment } from "react-icons/md";
import {
  BsCreditCard2Front,
  BsCalendarCheck,
  BsShieldCheck,
  BsArrowRight,
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
import { useState, useEffect, useCallback } from "react";
import { propertyStore } from "../store/propertyStore";
import { Link, useNavigate } from "react-router-dom";
import { fCurrency } from "@utils/formatNumber";
import NewsletterSubscription from "../components/NewsletterSubscription";
import RNPLWaitlistForm from "../components/RNPLWaitlistForm";
import "../styles/testimonials.css";
import "../styles/slider.css";

export default function LandingPage() {
  const navigate = useNavigate();
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const [showRNPLForm, setShowRNPLForm] = useState(false);

  // Price range constants
  const MIN_PRICE = 500000; // 500k currency units
  const MAX_PRICE = 50000000; // 50m

  const [searchParams, setSearchParams] = useState({
    location: "",
    priceRange: { from: MIN_PRICE, to: MAX_PRICE },
    bedrooms: "1",
    category: "rent", // Default to rent
  });
  const { properties, getProperties, isLoading } = propertyStore();

  // Format price for display
  const formatPrice = useCallback((price) => {
    if (price >= 1000000) {
      return `₦${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `₦${(price / 1000).toFixed(0)}K`;
    }
    return `₦${price}`;
  }, []);

  // Handle slider changes
  const handleSliderChange = useCallback((type, value) => {
    const newValue = parseInt(value);
    setSearchParams((prev) => {
      const currentRange = prev.priceRange;
      const minGap = 1000; // Minimum gap between sliders

      if (type === "from") {
        // Ensure from value doesn't exceed to value minus minimum gap
        const maxFromValue = currentRange.to - minGap;
        const clampedFromValue = Math.min(
          Math.max(newValue, MIN_PRICE),
          maxFromValue
        );

        return {
          ...prev,
          priceRange: {
            ...currentRange,
            from: clampedFromValue,
          },
        };
      } else {
        // Ensure to value doesn't go below from value plus minimum gap
        const minToValue = currentRange.from + minGap;
        const clampedToValue = Math.max(
          Math.min(newValue, MAX_PRICE),
          minToValue
        );

        return {
          ...prev,
          priceRange: {
            ...currentRange,
            to: clampedToValue,
          },
        };
      }
    });
  }, []);

  useEffect(() => {
    // Only fetch published properties for the landing page
    getProperties({ publication_status: "published" });
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
      <section className="min-h-screen text-white h-full mt-0 relative overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{ objectPosition: "center 20%" }}
          >
            <source
              src="/videos/Cinematic Real estate video tour 4K _ Laowa 12mm & Sony A7III.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 text-center pt-20 pb-10 relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Seamless Apartment Rental <br /> Solutions{" "}
            <span className="text-accent-300 bg-clip-text text-transparent bg-gradient-to-r from-accent-300 to-accent-500">
              for All
            </span>
          </h1>

          <p className="text-white max-w-3xl mx-auto mb-12 text-base md:text-lg px-4 animate-slide-up">
            Aplet360 is a revolutionary proptech solutions company on a mission
            to redefine Africa's property rental experience. Aplet360 is built
            for home seekers, tenants, landlords, agents and artisans, all in
            one place
          </p>

          {/* Search Section */}
          <form
            onSubmit={handleSearch}
            className="bg-white/95 backdrop-blur-sm p-6 rounded-3xl md:rounded-full flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 max-w-4xl mx-auto px-6 shadow-elevated border border-white/20 animate-slide-up"
          >
            <div className="flex-1 text-left">
              <p className="text-xs text-primary-900 font-medium mb-1">
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

            <div className="flex-1 text-left md:border-x border-tertiary-200 md:px-4">
              <p className="text-xs text-primary-900 font-medium mb-1">TYPE</p>
              <select
                className="w-full bg-transparent outline-none text-sm text-tertiary-700 hover:text-primary-900 transition-colors"
                value={searchParams.category}
                onChange={(e) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
              >
                <option value="rent">Rent</option>
                {/* <option value="shortlet">Shortlet</option> */}
                <option value="office">Office</option>
              </select>
            </div>

            <div className="flex-1 text-left md:border-x border-tertiary-200 md:px-4 relative">
              <p className="text-xs text-primary-900 font-medium mb-1">PRICE</p>
              <button
                type="button"
                onClick={() => setShowPriceDropdown(!showPriceDropdown)}
                className="flex items-center justify-between w-full text-sm text-tertiary-700 hover:text-primary-900 transition-colors"
              >
                <span>
                  {formatPrice(searchParams.priceRange.from)} -{" "}
                  {formatPrice(searchParams.priceRange.to)}
                </span>
                <FiChevronDown
                  className={`transform transition-transform ${
                    showPriceDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showPriceDropdown && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-xl p-6 w-full md:w-80 shadow-elevated border border-tertiary-100 z-[99999999]">
                  <div className="space-y-6">
                    {/* Price Display */}
                    <div className="flex justify-between items-center">
                      <div className="text-center">
                        <p className="text-xs text-primary-900 font-medium mb-1">
                          FROM
                        </p>
                        <p className="text-lg font-semibold text-tertiary-900">
                          {formatPrice(searchParams.priceRange.from)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-primary-900 font-medium mb-1">
                          TO
                        </p>
                        <p className="text-lg font-semibold text-tertiary-900">
                          {formatPrice(searchParams.priceRange.to)}
                        </p>
                      </div>
                    </div>

                    {/* Dual Range Slider */}
                    <div className="relative">
                      {/* Background track */}
                      <div className="h-2 bg-tertiary-200 rounded-full relative">
                        {/* Active range track */}
                        <div
                          className="absolute h-2 bg-primary-900 rounded-full"
                          style={{
                            left: `${
                              ((searchParams.priceRange.from - MIN_PRICE) /
                                (MAX_PRICE - MIN_PRICE)) *
                              100
                            }%`,
                            width: `${
                              ((searchParams.priceRange.to -
                                searchParams.priceRange.from) /
                                (MAX_PRICE - MIN_PRICE)) *
                              100
                            }%`,
                          }}
                        />
                      </div>

                      {/* Range slider container */}
                      <div className="relative mt-[-8px] h-6">
                        {/* Minimum slider (from) */}
                        <input
                          type="range"
                          min={MIN_PRICE}
                          max={MAX_PRICE}
                          step="1000"
                          value={searchParams.priceRange.from}
                          onChange={(e) =>
                            handleSliderChange("from", e.target.value)
                          }
                          className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb slider-thumb-lower"
                          style={{
                            zIndex:
                              searchParams.priceRange.from >
                              searchParams.priceRange.to - 50000
                                ? 5
                                : 1,
                          }}
                          title={`Minimum price: ${formatPrice(
                            searchParams.priceRange.from
                          )}`}
                        />

                        {/* Maximum slider (to) */}
                        <input
                          type="range"
                          min={MIN_PRICE}
                          max={MAX_PRICE}
                          step="1000"
                          value={searchParams.priceRange.to}
                          onChange={(e) =>
                            handleSliderChange("to", e.target.value)
                          }
                          className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb slider-thumb-upper"
                          style={{
                            zIndex:
                              searchParams.priceRange.from >
                              searchParams.priceRange.to - 50000
                                ? 1
                                : 5,
                          }}
                          title={`Maximum price: ${formatPrice(
                            searchParams.priceRange.to
                          )}`}
                        />
                      </div>

                      {/* Price markers */}
                      <div className="flex justify-between mt-4 text-xs text-tertiary-500">
                        <span>{formatPrice(MIN_PRICE)}</span>
                        <span>{formatPrice(MAX_PRICE)}</span>
                      </div>
                    </div>

                    <div className="flex justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSearchParams((prev) => ({
                            ...prev,
                            priceRange: { from: MIN_PRICE, to: MAX_PRICE },
                          }));
                          setShowPriceDropdown(false);
                        }}
                        className="flex-1 px-4 py-2 text-sm rounded-lg bg-tertiary-100 hover:bg-tertiary-200 text-tertiary-700 transition-colors"
                      >
                        Reset
                      </button>
                      <button
                        type="button"
                        onClick={handlePriceSubmit}
                        className="flex-1 px-4 py-2 text-sm rounded-lg bg-primary-900 hover:bg-primary-900 text-white transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {searchParams.category !== "office" && (
              <div className="flex-1 text-left md:border-x border-tertiary-200 md:px-4">
                <p className="text-xs text-primary-900 font-medium mb-1">
                  BEDROOMS
                </p>
                <select
                  className="w-full bg-transparent outline-none text-sm text-tertiary-700 hover:text-primary-900 transition-colors"
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
            )}

            <button
              type="submit"
              className="w-full md:w-auto bg-accent-500 hover:bg-accent-600 px-8 py-3 rounded-full whitespace-nowrap text-sm text-white transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Search now
            </button>
          </form>
        </div>
      </section>

      {/* Rent in 4 simple steps section */}
      <section className="py-20 bg-gradient-to-b from-white to-tertiary-50">
        <div className="max-w-6xl mx-auto px-4">
          {/* Image before the section */}
          <div className="mb-12 text-center">
            <img
              src="/images/rent-apartment-4-simple-steps.jpeg"
              alt="Rent your perfect apartment in 4 simple steps"
              className="w-full max-w-xl mx-auto rounded-2xl shadow-lg"
            />
          </div>

          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Rent your perfect apartment in{" "}
              <span className="text-primary-900 bg-clip-text text-transparent bg-gradient-to-r from-primary-900 to-primary-900">
                4 simple steps
              </span>
            </h2>
            <p className="text-tertiary-600 max-w-3xl mx-auto text-lg">
              Finding and renting your dream apartment has never been easier.
              Our streamlined process gets you from search to move-in day
              quickly and hassle-free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <IoHomeOutline className="w-7 h-7 text-primary-900" />
              </div>
              <h3 className="font-semibold text-xl mb-6 text-tertiary-900">
                Search
              </h3>
              <p className="text-tertiary-600 text-sm text-center">
                Browse through our curated selection of quality apartments by
                location, price range, and bedroom count
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
                Choose your preferred apartment and rental terms that match your
                lifestyle and budget
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <RiSecurePaymentLine className="w-7 h-7 text-primary-900" />
              </div>
              <h3 className="font-semibold text-xl mb-6 text-tertiary-900">
                Pay
              </h3>
              <p className="text-tertiary-600 text-sm text-center">
                Complete your rental with our flexible monthly payment options -
                no yearly rent required
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
                Get your keys and start enjoying your new home with all
                amenities and services included
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/book-now"
              className="bg-primary-900 text-white px-8 py-4 rounded-full inline-flex items-center gap-2 hover:bg-primary-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span className="font-medium">Start Your Search</span>
              <BsArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Rent now, pay later section */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          {/* Image before the section */}
          <div className="mb-8 text-center">
            <img
              src="/images/rnpl.jpeg"
              alt="Rent Now Pay Later (RNPL)"
              className="w-full max-w-md mx-auto rounded-2xl shadow-lg"
            />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Rent Now Pay Later (RNPL).
          </h2>
          <p className="max-w-3xl mx-auto mb-6 text-primary-100">
            We understand how challenging it can be sometimes to pay a 1 year
            rent upfront. Aplet360 gat you covered. Pre-qualify for our RNPL
            solution so you can use it whenever you need to pay your rent.
          </p>
          <div className="mb-5">
            <p className="w-full max-w-2xl mx-auto rounded-2xl">
              Rent Now Pay Later benefits: Flexible payment options, No yearly
              rent required, Monthly payment plans, Financial freedom for
              tenants
            </p>
          </div>

          <button
            onClick={() => setShowRNPLForm(true)}
            className="bg-white text-primary-900 px-8 py-3 rounded-full inline-flex items-center gap-2 hover:bg-primary-50 transition-colors font-medium"
          >
            <span>Join our Waitlist</span>
            <BsArrowRight />
          </button>
        </div>
      </section>

      <section className="px-4 md:px-10 mx-auto bg-white">
        <div className="py-20">
          <p className="text-accent-500 font-semibold mb-4">WHY APLET360</p>

          <div className="flex flex-col md:flex-row gap-8 md:gap-20 mb-16">
            <div className="flex-1">
              <h2 className="text-3xl md:text-5xl font-bold text-tertiary-900">
                One platform.
                <br />
                All the benefits.
              </h2>
            </div>
            <div className="flex-1">
              <p className="text-tertiary-600 text-lg">
                Whether you're renting, managing, or listing a home, Aplet360 is
                built for you. We make life easier for tenants, landlords,
                agents, and property managers, with helpful tools and benefit
                every step of the way.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Landlords Benefits */}
            <div className="bg-white p-8 rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1 border border-tertiary-100">
              <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                <IoHomeOutline className="w-7 h-7 text-primary-900" />
              </div>
              <h3 className="font-semibold text-xl mb-6 text-tertiary-900">
                For Landlords
              </h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary-50 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-primary-900 text-xs font-bold">
                      1
                    </span>
                  </div>
                  <p className="text-tertiary-600 text-sm">
                    <span className="font-medium text-tertiary-900">
                      Rent Collection & Accounting
                    </span>{" "}
                    - Receipt issuing and rental remittance
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary-50 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-primary-900 text-xs font-bold">
                      2
                    </span>
                  </div>
                  <p className="text-tertiary-600 text-sm">
                    <span className="font-medium text-tertiary-900">
                      Rental Income Guarantee (Property Management)
                    </span>{" "}
                    - Secure your income with our guarantee system
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary-50 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-primary-900 text-xs font-bold">
                      3
                    </span>
                  </div>
                  <p className="text-tertiary-600 text-sm">
                    <span className="font-medium text-tertiary-900">
                      Rental Administration
                    </span>{" "}
                    - Lease payment, renewal, termination, and replacement
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary-50 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-primary-900 text-xs font-bold">
                      4
                    </span>
                  </div>
                  <p className="text-tertiary-600 text-sm">
                    <span className="font-medium text-tertiary-900">
                      Quick Apartment Placement
                    </span>{" "}
                    - Fast tenant placement and property occupancy
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary-50 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-primary-900 text-xs font-bold">
                      5
                    </span>
                  </div>
                  <p className="text-tertiary-600 text-sm">
                    <span className="font-medium text-tertiary-900">
                      Tenant Verification
                    </span>{" "}
                    - Comprehensive background checks and verification
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary-50 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-primary-900 text-xs font-bold">
                      6
                    </span>
                  </div>
                  <p className="text-tertiary-600 text-sm">
                    <span className="font-medium text-tertiary-900">
                      Property Valuation/Rent Review
                    </span>{" "}
                    - Market analysis and competitive pricing
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary-50 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-primary-900 text-xs font-bold">
                      7
                    </span>
                  </div>
                  <p className="text-tertiary-600 text-sm">
                    <span className="font-medium text-tertiary-900">
                      Legal Support & Dispute Resolution
                    </span>{" "}
                    - Professional legal assistance when needed
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary-50 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-primary-900 text-xs font-bold">
                      8
                    </span>
                  </div>
                  <p className="text-tertiary-600 text-sm">
                    <span className="font-medium text-tertiary-900">
                      Property Advertising
                    </span>{" "}
                    - Professional marketing and listing promotion
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary-50 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-primary-900 text-xs font-bold">
                      9
                    </span>
                  </div>
                  <p className="text-tertiary-600 text-sm">
                    <span className="font-medium text-tertiary-900">
                      Maintenance & Renovation
                    </span>{" "}
                    - Quality and affordable property services
                  </p>
                </div>

                <div className="mt-4 p-3 bg-primary-50 rounded-lg">
                  <p className="text-sm text-primary-900 font-medium">
                    Service Fee: 5% (Property Listing) and 10% (Property
                    Management) of annual rent.
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

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-accent-50 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-accent-600 text-xs font-bold">1</span>
                  </div>
                  <p className="text-tertiary-600 text-sm">
                    <span className="font-medium text-tertiary-900">
                      Rental Assistance
                    </span>{" "}
                    - Get help finding and securing your perfect rental
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-accent-50 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-accent-600 text-xs font-bold">2</span>
                  </div>
                  <p className="text-tertiary-600 text-sm">
                    <span className="font-medium text-tertiary-900">
                      Monthly Rental Payment Option
                    </span>{" "}
                    - Pay monthly instead of yearly rent upfront
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-accent-50 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-accent-600 text-xs font-bold">3</span>
                  </div>
                  <p className="text-tertiary-600 text-sm">
                    <span className="font-medium text-tertiary-900">
                      Tenant Protection (No Sudden Eviction)
                    </span>{" "}
                    - Protected tenancy with proper notice periods
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-accent-50 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-accent-600 text-xs font-bold">4</span>
                  </div>
                  <p className="text-tertiary-600 text-sm">
                    <span className="font-medium text-tertiary-900">
                      Verified Apartments and Landlords
                    </span>{" "}
                    - Pre-vetted, quality properties and trusted landlords
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-accent-50 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-accent-600 text-xs font-bold">5</span>
                  </div>
                  <p className="text-tertiary-600 text-sm">
                    <span className="font-medium text-tertiary-900">
                      Access to Aplet360 Marketplace
                    </span>{" "}
                    - Shop for home essentials and utilities
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-accent-50 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-accent-600 text-xs font-bold">6</span>
                  </div>
                  <p className="text-tertiary-600 text-sm">
                    <span className="font-medium text-tertiary-900">
                      Affordable Home Maintenance Services
                    </span>{" "}
                    - Professional cleaning, repairs, and maintenance
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-accent-50 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-accent-600 text-xs font-bold">7</span>
                  </div>
                  <p className="text-tertiary-600 text-sm">
                    <span className="font-medium text-tertiary-900">
                      Mortgage/NHIS Access and Support
                    </span>{" "}
                    - Financial assistance and housing support programs
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-accent-50 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-accent-600 text-xs font-bold">8</span>
                  </div>
                  <p className="text-tertiary-600 text-sm">
                    <span className="font-medium text-tertiary-900">
                      No Over-charged Property Rentals
                    </span>{" "}
                    - Fair and transparent pricing on all properties
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-accent-50 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-accent-600 text-xs font-bold">9</span>
                  </div>
                  <p className="text-tertiary-600 text-sm">
                    <span className="font-medium text-tertiary-900">
                      Dispute Resolution
                    </span>{" "}
                    - Landlord and tenant dispute management services
                  </p>
                </div>

                <div className="mt-4 p-3 bg-accent-50 rounded-lg">
                  <p className="text-sm text-accent-600 font-medium">
                    Join our waitlist for RNPL and exclusive tenant benefits
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ApletFix  Section */}
      <section className="py-16 bg-gradient-to-b from-tertiary-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          {/* Image before the section */}
          <div className="mb-12 text-center">
            <img
              src="/images/apletfix-home.jpeg"
              alt="ApletFix - Complete home services at your fingertips"
              className="w-full max-w-xl mx-auto rounded-2xl shadow-lg"
            />
          </div>

          <div className="text-center mb-16">
            <p className="text-accent-500 font-semibold mb-4">ApletFix</p>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Complete home services
              <br />
              <span className="text-accent-500">at your fingertips</span>
            </h2>
            <p className="text-tertiary-600 max-w-3xl mx-auto text-lg">
              From cleaning to repairs, our professional artisans are ready to
              handle all your home service needs. Quality work, affordable
              prices, and reliable service guaranteed.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-12">
            {[
              { name: "Cleaning", icon: "🧹" },
              { name: "Plumbing", icon: "🔧" },
              { name: "Electrical", icon: "⚡" },
              { name: "Painting", icon: "🎨" },
              { name: "Carpentry", icon: "🔨" },
              { name: "Gardening", icon: "🌱" },
              { name: "Appliance Repair", icon: "🔧" },
              { name: "HVAC", icon: "❄️" },
              { name: "Locksmith", icon: "🔐" },
              { name: "Pest Control", icon: "🐛" },
              { name: "Moving", icon: "📦" },
              { name: "Security", icon: "🛡️" },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1 text-center"
              >
                <div className="text-3xl mb-3">{service.icon}</div>
                <h3 className="font-semibold text-sm text-tertiary-900">
                  {service.name}
                </h3>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="bg-white p-8 rounded-3xl shadow-card border border-tertiary-100 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4 text-tertiary-900">
                Need a service? We&apos;ve got you covered!
              </h3>
              <p className="text-tertiary-600 mb-6">
                Professional, vetted artisans ready to help with any home
                service need. Quick response, quality work, and transparent
                pricing.
              </p>
              <Link
                to="/aplet-fix"
                className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-full inline-flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
              >
                <span>Request a Service</span>
                <BsArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-10 mx-auto">
        <div className="py-12 md:py-20">
          {/* Image before the section */}
          <div className="mb-12 text-center">
            <img
              src="/images/listing-seciton.jpeg"
              alt="Find your next home on Aplet360"
              className="w-full max-w-4xl mx-auto rounded-2xl shadow-lg"
            />
          </div>

          <p className="text-accent-600 font-medium mb-4">LISTINGS</p>

          <div className="flex flex-col md:flex-row gap-8 md:gap-20 mb-12">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold">
                Find your next home on Aplet360
              </h2>
            </div>
            <div className="flex-1">
              <p className="text-gray-600 text-sm md:text-base">
                Explore amazing apartments on Aplet360 with flexible payment
                options. All listed apartments are of high quality and comfort.
                We carefully vet each property to guarantee you a premium living
                experience.
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
                <Link
                  to={`/property/${property._id}`}
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
                </Link>
              ))
            )}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/book-now"
              className="w-full md:w-auto bg-primary-900 text-white px-8 py-3 rounded-full text-sm hover:bg-primary-900"
            >
              View Listings
            </Link>
          </div>
        </div>
      </section>

      {/* Property Management section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          {/* Image before the section */}
          <div className="mb-12 text-center"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="w-full ">
                <img
                  src="/images/property-management.jpg"
                  alt="Property Management Solutions"
                  className="w-full max-w-5xl mx-auto rounded-2xl shadow-lg"
                />
              </div>
            </div>

            <div className="lg:pl-12">
              <p className="text-accent-600 uppercase font-medium mb-2">
                Property Management Solutions
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Join other happy landlords who enjoys seamless property
                management plan at Aplet360 that guarantees their peace of mind
                and all year round rental income.
              </h2>

              <div className="space-y-4 mt-8">
                {[
                  "Listing Creation & Management",
                  "Apartment Marketing",
                  "Quick Apartment Placement",
                  "Check-In & Check-Out Management",
                  "Tenant & Landlord Protection",
                  "24/7 Maintenance & Support",
                  "Rental Administration & Accounting",
                  "Guaranteed Rental Income all year round",
                  "Guests and Tenant Verification",
                  "Property Maintenance, Renovation, and Improvement",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary-900 rounded-full"></div>
                    <p className="text-gray-700">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link
                  to="/auth/login?property-management=true"
                  className="bg-primary-900 text-white px-8 py-3 rounded-full inline-flex items-center gap-2 hover:bg-primary-900 transition-colors"
                >
                  <span>Let's Get You In.</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-primary-900 font-medium mb-2">TESTIMONIALS</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              People love us & you will love us too
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Don&apos;t just take our word for it. Here&apos;s what our
              customers have to say about their Aplet360 experience.
            </p>
          </div>

          {/* Testimonials Slider */}
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="auto-scroll-testimonials flex gap-6"
                style={{ width: "200%" }}
              >
                {/* First set of testimonials */}
                <div className="flex gap-6 min-w-full pb-10">
                  {/* Testimonial 1 */}
                  <div className="testimonial-card bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl min-w-[280px] md:min-w-[350px] border border-gray-100">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className="w-5 h-5 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 leading-relaxed text-sm md:text-base">
                      "Finding my dream apartment was so easy with Aplet360. The
                      platform is user-friendly, and the customer service is
                      exceptional. I got my keys within 48 hours!"
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold mr-3 md:mr-4 text-sm">
                        SA
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm md:text-base">
                          Sarah Adebayo
                        </h4>
                        <p className="text-gray-500 text-xs md:text-sm">
                          Marketing Executive, Lagos
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Testimonial 2 */}
                  <div className="testimonial-card bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl min-w-[280px] md:min-w-[350px] border border-gray-100">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className="w-5 h-5 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 leading-relaxed text-sm md:text-base">
                      "The shortlet options are amazing! Perfect for my business
                      trips. Clean, affordable, and always available when I need
                      them. Highly recommended!"
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center text-white font-semibold mr-3 md:mr-4 text-sm">
                        JO
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm md:text-base">
                          James Okafor
                        </h4>
                        <p className="text-gray-500 text-xs md:text-sm">
                          Business Consultant, Abuja
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Testimonial 3 */}
                  <div className="testimonial-card bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl min-w-[280px] md:min-w-[350px] border border-gray-100">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className="w-5 h-5 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 leading-relaxed text-sm md:text-base">
                      "As a property owner, listing on Aplet360 has been
                      fantastic. Great exposure, reliable tenants, and excellent
                      support from the team."
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold mr-3 md:mr-4 text-sm">
                        MK
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm md:text-base">
                          Mrs. Kemi Adeyemi
                        </h4>
                        <p className="text-gray-500 text-xs md:text-sm">
                          Property Owner, Ikeja
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Testimonial 4 */}
                  <div className="testimonial-card bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl min-w-[280px] md:min-w-[350px] border border-gray-100">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className="w-5 h-5 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 leading-relaxed text-sm md:text-base">
                      "The office spaces available are top-notch! Found the
                      perfect location for my startup. The booking process was
                      seamless and transparent."
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-3 md:mr-4 text-sm">
                        DA
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm md:text-base">
                          David Akinola
                        </h4>
                        <p className="text-gray-500 text-xs md:text-sm">
                          Tech Entrepreneur, Victoria Island
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Duplicate set for seamless loop */}
                <div className="flex gap-6 min-w-full">
                  {/* Testimonial 1 - Duplicate */}
                  <div className="testimonial-card bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl min-w-[280px] md:min-w-[350px] border border-gray-100">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className="w-5 h-5 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 leading-relaxed text-sm md:text-base">
                      "Finding my dream apartment was so easy with Aplet360. The
                      platform is user-friendly, and the customer service is
                      exceptional. I got my keys within 48 hours!"
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold mr-3 md:mr-4 text-sm">
                        SA
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm md:text-base">
                          Sarah Adebayo
                        </h4>
                        <p className="text-gray-500 text-xs md:text-sm">
                          Marketing Executive, Lagos
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Testimonial 2 - Duplicate */}
                  <div className="testimonial-card bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl min-w-[280px] md:min-w-[350px] border border-gray-100">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className="w-5 h-5 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 leading-relaxed text-sm md:text-base">
                      "The shortlet options are amazing! Perfect for my business
                      trips. Clean, affordable, and always available when I need
                      them. Highly recommended!"
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center text-white font-semibold mr-3 md:mr-4 text-sm">
                        JO
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm md:text-base">
                          James Okafor
                        </h4>
                        <p className="text-gray-500 text-xs md:text-sm">
                          Business Consultant, Abuja
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Testimonial 3 - Duplicate */}
                  <div className="testimonial-card bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl min-w-[280px] md:min-w-[350px] border border-gray-100">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className="w-5 h-5 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 leading-relaxed text-sm md:text-base">
                      "As a property owner, listing on Aplet360 has been
                      fantastic. Great exposure, reliable tenants, and excellent
                      support from the team."
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold mr-3 md:mr-4 text-sm">
                        MK
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm md:text-base">
                          Mrs. Kemi Adeyemi
                        </h4>
                        <p className="text-gray-500 text-xs md:text-sm">
                          Property Owner, Ikeja
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Testimonial 4 - Duplicate */}
                  <div className="testimonial-card bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl min-w-[280px] md:min-w-[350px] border border-gray-100">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className="w-5 h-5 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 leading-relaxed text-sm md:text-base">
                      "The office spaces available are top-notch! Found the
                      perfect location for my startup. The booking process was
                      seamless and transparent."
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-3 md:mr-4 text-sm">
                        DA
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm md:text-base">
                          David Akinola
                        </h4>
                        <p className="text-gray-500 text-xs md:text-sm">
                          Tech Entrepreneur, Victoria Island
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gradient overlays for smooth edges */}
            <div className="absolute top-0 left-0 w-16 md:w-20 h-full testimonial-gradient-left pointer-events-none z-10"></div>
            <div className="absolute top-0 right-0 w-16 md:w-20 h-full testimonial-gradient-right pointer-events-none z-10"></div>
          </div>

          {/* Stats section */}
          {/* <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-primary-900 mb-2">
                5,000+
              </div>
              <div className="text-gray-600 text-sm">Happy Customers</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-primary-900 mb-2">
                10,000+
              </div>
              <div className="text-gray-600 text-sm">Properties Listed</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-primary-900 mb-2">
                98%
              </div>
              <div className="text-gray-600 text-sm">Satisfaction Rate</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-primary-900 mb-2">
                24/7
              </div>
              <div className="text-gray-600 text-sm">Customer Support</div>
            </div>
          </div> */}
        </div>
      </section>

      {/* Newsletter CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Illustration */}
            <div className="order-2 lg:order-1">
              <div className="relative">
                <img
                  src="/images/newsletter-illustration.svg"
                  alt="Newsletter Subscription"
                  className="w-full h-auto max-w-md mx-auto"
                  onError={(e) => {
                    // Fallback to a placeholder if the illustration doesn't exist
                    e.target.src = "/images/people-holding-key.webp";
                  }}
                />
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-accent-200 rounded-full opacity-20"></div>
                <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-primary-200 rounded-full opacity-30"></div>
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="order-1 lg:order-2">
              <NewsletterSubscription
                source="landing_page"
                title="Never Miss a Great Deal!"
                description="Join thousands of property seekers who get exclusive access to new listings, market insights, and special offers before anyone else."
                placeholder="Your email address"
                buttonText="Get Updates"
                className="text-left lg:text-left"
              />

              {/* Trust indicators */}
              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <BsShieldCheck className="w-4 h-4 text-green-600" />
                  <span>No spam, ever</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiStar className="w-4 h-4 text-yellow-500" />
                  <span>5,000+ subscribers</span>
                </div>
                <div className="flex items-center gap-2">
                  <RiHandHeartLine className="w-4 h-4 text-accent-600" />
                  <span>Unsubscribe anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RNPL Waitlist Form Modal */}
      <RNPLWaitlistForm
        isOpen={showRNPLForm}
        onClose={() => setShowRNPLForm(false)}
      />
    </div>
  );
}
