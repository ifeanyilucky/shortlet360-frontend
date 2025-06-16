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
import "../styles/testimonials.css";
import "../styles/slider.css";

export default function LandingPage() {
  const navigate = useNavigate();
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);

  // Price range constants
  const MIN_PRICE = 200; // 200 currency units
  const MAX_PRICE = 10000000; // 10m

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
        const clampedFromValue = Math.min(Math.max(newValue, MIN_PRICE), maxFromValue);
        
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
        const clampedToValue = Math.max(Math.min(newValue, MAX_PRICE), minToValue);
        
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
      <section className="min-h-screen bg-gradient-to-b from-primary-900 to-primary-900 text-white h-full mt-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10"></div>
        <div className="max-w-6xl mx-auto px-4 text-center pt-20 pb-10 relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
           Seamless Apartment Rental {" "}
            <span className="text-accent-300 bg-clip-text text-transparent bg-gradient-to-r from-accent-300 to-accent-500">
              For Everyone.
            </span>
          </h1>

          <p className="text-primary-100 max-w-3xl mx-auto mb-12 text-base md:text-lg px-4 animate-slide-up">
            Aplet360 is Africa&apos;s premier apartment rental and shortlet
            solutions company, offering individuals, families, travelers, and
            corporate clients seamless access to quality, verified, and
            affordable property options across major cities in Nigeria and
            Africa while providing 360 degree seamless home services designed to
            elevate everyday living for Africans. We&apos;re not just providing
            homes, we&apos;re providing lifestyles built on trust, comfort, and
            excellence.
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
                            zIndex: searchParams.priceRange.from > searchParams.priceRange.to - 50000 ? 5 : 1
                          }}
                          title={`Minimum price: ${formatPrice(searchParams.priceRange.from)}`}
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
                            zIndex: searchParams.priceRange.from > searchParams.priceRange.to - 50000 ? 1 : 5
                          }}
                          title={`Maximum price: ${formatPrice(searchParams.priceRange.to)}`}
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

            <div className="flex-1 text-left">
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
          <div className="absolute bg-gradient-to-t from-primary-900/50 to-transparent z-10"></div>
          <img
            src={"/images/siting-room.jpeg"}
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
              Find your perfect apartment in{" "}
              <span className="text-primary-900 bg-clip-text text-transparent bg-gradient-to-r from-primary-900 to-primary-900">
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
                <IoHomeOutline className="w-7 h-7 text-primary-900" />
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
                <RiSecurePaymentLine className="w-7 h-7 text-primary-900" />
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
              className="bg-primary-900 text-white px-8 py-4 rounded-full inline-flex items-center gap-2 hover:bg-primary-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span className="font-medium">Book Now</span>
              <BsArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Rent now, pay later section */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Rent that apartment now and pay monthly
          </h2>
          <p className="max-w-3xl mx-auto mb-6 text-primary-100">
            We know you earn either daily, weekly, or monthly. We understand the
            struggle behind paying yearly rent, that&apos;s why we are here for
            you.
          </p>
          <p className="max-w-3xl mx-auto mb-10 text-primary-100">
            Enjoy the flexibility of renting your perfect apartment today with
            our two convenient monthly payment options: Option 1 with 1.5%
            monthly interest on rent (upfront fees) or Option 2 with 2% monthly
            interest (all costs divided into monthly payments).
          </p>
          <Link
            to="/book-now"
            className="bg-white text-primary-900 px-8 py-3 rounded-full inline-flex items-center gap-2 hover:bg-primary-50 transition-colors font-medium"
          >
            <span>Explore Payment Options</span>
            <BsArrowRight />
          </Link>
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
                Whether you&apos;re a tenant, landlord, agent, or property
                manager, Aplet360 offers tailored benefits to meet your needs.
                Our platform is designed to streamline the entire property
                ecosystem, providing value at every step.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Landlords/Agents/Property Managers Benefits */}
            <div className="bg-white p-8 rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1 border border-tertiary-100">
              <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                <IoHomeOutline className="w-7 h-7 text-primary-900" />
              </div>
              <h3 className="font-semibold text-xl mb-6 text-tertiary-900">
                For Landlords, Agents & Property Managers
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary-50 rounded-xl flex items-center justify-center mt-0.5 flex-shrink-0">
                    <RiMoneyDollarCircleLine className="w-4 h-4 text-primary-900" />
                  </div>
                  <p className="text-tertiary-600">
                    <span className="font-medium text-tertiary-900">
                      Rental Income Guarantee
                    </span>{" "}
                    - Secure your income with our guarantee system
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary-50 rounded-xl flex items-center justify-center mt-0.5 flex-shrink-0">
                    <BsShieldCheck className="w-4 h-4 text-primary-900" />
                  </div>
                  <p className="text-tertiary-600">
                    <span className="font-medium text-tertiary-900">
                      Comprehensive Management
                    </span>{" "}
                    - From rent collection to legal support
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary-50 rounded-xl flex items-center justify-center mt-0.5 flex-shrink-0">
                    <BsCalendarCheck className="w-4 h-4 text-primary-900" />
                  </div>
                  <p className="text-tertiary-600">
                    <span className="font-medium text-tertiary-900">
                      Unlimited Listings
                    </span>{" "}
                    - One-time registration fee for unlimited property listings
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
                    - We handle all the stress of sourcing and vetting
                    apartments for you to easily make a choice and move in
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-accent-50 rounded-xl flex items-center justify-center mt-0.5 flex-shrink-0">
                    <BsCreditCard2Front className="w-4 h-4 text-accent-600" />
                  </div>
                  <p className="text-tertiary-600">
                    <span className="font-medium text-tertiary-900">
                      Monthly Payment Option
                    </span>{" "}
                    - Flexible monthly payment plan to move in with just the
                    payment of the first month
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
                    - Legal support to protect tenants&apos; rights via dispute
                    resolution and no sudden evictions
                  </p>
                </div>
              </div>
            </div>

            {/* Shortlet Apartment Owners Benefits */}
            <div className="bg-white p-8 rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1 border border-tertiary-100">
              <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                <BsArrowRight className="w-7 h-7 text-primary-900" />
              </div>
              <h3 className="font-semibold text-xl mb-6 text-tertiary-900">
                For Shortlet Apartment Owners
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary-50 rounded-xl flex items-center justify-center mt-0.5 flex-shrink-0">
                    <FiStar className="w-4 h-4 text-primary-900" />
                  </div>
                  <p className="text-tertiary-600">
                    <span className="font-medium text-tertiary-900">
                      Efficient Administration
                    </span>{" "}
                    - Streamlined bookings and payments management
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary-50 rounded-xl flex items-center justify-center mt-0.5 flex-shrink-0">
                    <HiUsers className="w-4 h-4 text-primary-900" />
                  </div>
                  <p className="text-tertiary-600">
                    <span className="font-medium text-tertiary-900">
                      Property Advertising
                    </span>{" "}
                    - Reach a wider audience with our platform
                  </p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary-50 rounded-xl flex items-center justify-center mt-0.5 flex-shrink-0">
                    <BsCreditCard2Front className="w-4 h-4 text-primary-900" />
                  </div>
                  <p className="text-tertiary-600">
                    <span className="font-medium text-tertiary-900">
                      Maintenance Support
                    </span>{" "}
                    - Access to quality and affordable property services
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HomeFix  Section */}
      <section className="py-16 bg-gradient-to-b from-tertiary-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-accent-500 font-semibold mb-4">HomeFix</p>
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
                to="/home-fix"
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
          <p className="text-accent-600 font-medium mb-4">LISTINGS</p>

          <div className="flex flex-col md:flex-row gap-8 md:gap-20 mb-12">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold">
                Explore amazing apartments
                <br />
                on Aplet360 with flexible
                <br />
                payment options.
              </h2>
            </div>
            <div className="flex-1">
              <p className="text-gray-600 text-sm md:text-base">
                Aplet360 ensures all listed apartments meet our high standards
                of quality and comfort. We carefully vet each property to
                guarantee a premium living experience for our clients, focusing
                on cleanliness, safety, and modern amenities that cater to your
                lifestyle needs.
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

      {/* Gateway to affordable living section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-primary-900 font-medium mb-4">YOUR GATEWAY</p>
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
                    <RiMoneyDollarCircleLine className="w-5 h-5 text-primary-900" />
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
                    <BsShieldCheck className="w-5 h-5 text-primary-900" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Secure Transactions</h3>
                    <p className="text-gray-600 text-sm">
                      Book with confidence knowing your payment and personal
                      information are protected.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mt-1">
                    <MdApartment className="w-5 h-5 text-primary-900" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      Seamless Apartment Letting Management
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Our expert team handles every aspect of property
                      management, ensuring a hassle-free experience for both
                      tenants and landlords.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mt-1">
                    <BiSupport className="w-5 h-5 text-primary-900" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      Exclusive Home Services
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Elevate your lifestyle with our curated selection of home
                      services, from cleaning to maintenance, all designed to
                      enhance your living experience.
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
            <div>
              <div className="w-full h-96">
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
              <h2 className="text-3xl md:text-5xl font-bold text-primary-900 mb-6">
                Get the most Reliable Property Management Solution in Nigeria
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
                  <span>Sign Up Now</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section className="py-16 bg-white">
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
                    <span className="text-primary-900 font-semibold text-xl">
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
                    <span className="text-primary-900 font-semibold text-xl">
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
                    <span className="text-primary-900 font-semibold text-xl">
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
                    <span className="text-primary-900 font-semibold text-xl">
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
                    <span className="text-primary-900 font-semibold text-xl">
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
