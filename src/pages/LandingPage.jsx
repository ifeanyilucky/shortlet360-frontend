import { FiChevronDown, FiStar } from "react-icons/fi";
import { MdApartment } from "react-icons/md";
import {
  BsCreditCard2Front,
  BsCalendarCheck,
  BsShieldCheck,
  BsArrowRight,
} from "react-icons/bs";
import { HiUsers } from "react-icons/hi";
import { RiSecurePaymentLine, RiMoneyDollarCircleLine } from "react-icons/ri";
import { IoLocationOutline, IoHomeOutline } from "react-icons/io5";
import { BiBed, BiBath } from "react-icons/bi";
import { HiOutlineUsers } from "react-icons/hi2";
import { useState, useEffect } from "react";
import { propertyStore } from "../store/propertyStore";
import { Link, useNavigate } from "react-router-dom";
import { fCurrency } from "@utils/formatNumber";

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
      <section className="min-h-screen bg-primary-500 text-white h-full mt-0">
        <div className="max-w-6xl mx-auto px-4 text-center pt-20 pb-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Quality Apartments{" "}
            <span className="text-primary-200">For Everyone</span>
          </h1>

          <p className="text-primary-100 max-w-3xl mx-auto mb-12 text-sm md:text-base px-4">
            Aplet360 is your premier platform for finding and renting quality
            apartments across Nigeria. Whether you're looking for a long-term
            home or a short-term stay, find the perfect furnished apartment with
            flexible payment options and hassle-free management.
          </p>

          {/* Search Section */}
          <form
            onSubmit={handleSearch}
            className="bg-white p-4 rounded-3xl md:rounded-full flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 max-w-4xl mx-auto px-6 shadow-lg border-2 border-primary-100"
          >
            <div className="flex-1 text-left">
              <p className="text-xs text-gray-500 mb-1">LOCATION</p>
              <input
                type="text"
                placeholder="Where would you like to stay?"
                className="bg-transparent w-full outline-none text-xs text-gray-700"
                value={searchParams.location}
                onChange={(e) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex-1 text-left md:border-x border-gray-200 md:px-4 relative">
              <p className="text-xs text-gray-500 mb-1">PRICE</p>
              <button
                type="button"
                onClick={() => setShowPriceDropdown(!showPriceDropdown)}
                className="flex items-center justify-between w-full text-xs text-gray-700"
              >
                <span>
                  {searchParams.priceRange.from || searchParams.priceRange.to
                    ? `₦${searchParams.priceRange.from || 0} - ₦${
                        searchParams.priceRange.to || "∞"
                      }`
                    : "Choose a price range"}
                </span>
                <FiChevronDown />
              </button>

              {showPriceDropdown && (
                <div className="absolute top-full left-0 mt-2 bg-white rounded-lg p-4 w-full md:w-64 shadow-lg z-50">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-2">FROM</p>
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
                        className="w-full bg-gray-50 rounded p-2 text-xs outline-none text-gray-700"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-2">TO</p>
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
                        className="w-full bg-gray-50 rounded p-2 text-xs outline-none text-gray-700"
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
                        className="flex-1 px-4 py-2 text-xs rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                      >
                        Clear
                      </button>
                      <button
                        type="button"
                        onClick={handlePriceSubmit}
                        className="flex-1 px-4 py-2 text-xs rounded bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 text-left">
              <p className="text-xs text-gray-500 mb-1">BEDROOMS</p>
              <select
                className="w-full bg-transparent outline-none text-xs text-gray-700"
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

            <div className="flex-1 text-left md:border-x border-gray-200 md:px-4">
              <p className="text-xs text-gray-500 mb-1">TYPE</p>
              <select
                className="w-full bg-transparent outline-none text-xs text-gray-700"
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
              className="w-full md:w-auto bg-primary-500 px-6 py-3 rounded-full whitespace-nowrap text-xs text-white hover:bg-primary-600"
            >
              Search now
            </button>
          </form>
        </div>

        <div className="w-full h-[300px] md:h-[500px] overflow-hidden">
          <img
            src={"/images/living-room.jpg"}
            alt="Hero"
            className="w-full h-full object-cover object-bottom transform scale-110"
          />
        </div>
      </section>

      {/* Book in 4 minutes section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Find your perfect space in{" "}
              <span className="text-primary-500">4 simple steps</span>
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our streamlined process makes finding and securing your ideal
              apartment quick and hassle-free, whether for long-term rentals or
              short-term stays.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <IoHomeOutline className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="font-semibold mb-2">Search</h3>
              <p className="text-gray-600 text-sm">
                Find your ideal space by location, price, and amenities for rent
                or shortlet
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BsCalendarCheck className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="font-semibold mb-2">Select</h3>
              <p className="text-gray-600 text-sm">
                Choose your preferred property and rental duration that fits
                your needs
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <RiSecurePaymentLine className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="font-semibold mb-2">Pay</h3>
              <p className="text-gray-600 text-sm">
                Choose from flexible payment options for both rentals and
                shortlets
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdApartment className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="font-semibold mb-2">Move In</h3>
              <p className="text-gray-600 text-sm">
                Get your keys and enjoy your new space with all amenities ready
                for you
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              to="/book-now"
              className="bg-primary-500 text-white px-8 py-3 rounded-full inline-flex items-center gap-2 hover:bg-primary-600 transition-colors"
            >
              <span>Book Now</span>
              <BsArrowRight />
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-10 mx-auto">
        <div className="py-12 md:py-20">
          <p className="text-primary-500 font-medium mb-4">WHY APLET360</p>

          <div className="flex flex-col md:flex-row gap-8 md:gap-20 mb-12">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold">
                Benefits for everyone
                <br />
                in the property
                <br />
                ecosystem.
              </h2>
            </div>
            <div className="flex-1">
              <p className="text-gray-600 text-sm md:text-base">
                Aplet360 creates value for tenants seeking quality homes,
                landlords looking to maximize returns, and property managers
                wanting to streamline operations. Our platform connects all
                parties with transparent processes and flexible options.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Tenants Benefits */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center mb-4">
                <HiOutlineUsers className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="font-semibold text-lg mb-4">For Tenants</h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-primary-50 rounded-full flex items-center justify-center mt-0.5">
                    <MdApartment className="w-3 h-3 text-primary-500" />
                  </div>
                  <p className="text-gray-700 text-sm">
                    <span className="font-medium">
                      Quality Furnished Spaces
                    </span>{" "}
                    - Move-in ready apartments with all essentials included
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-primary-50 rounded-full flex items-center justify-center mt-0.5">
                    <BsCreditCard2Front className="w-3 h-3 text-primary-500" />
                  </div>
                  <p className="text-gray-700 text-sm">
                    <span className="font-medium">Flexible Payments</span> -
                    Multiple payment options with convenient monthly plans
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-primary-50 rounded-full flex items-center justify-center mt-0.5">
                    <RiSecurePaymentLine className="w-3 h-3 text-primary-500" />
                  </div>
                  <p className="text-gray-700 text-sm">
                    <span className="font-medium">Transparent Pricing</span> -
                    No hidden fees with all utilities included
                  </p>
                </div>
              </div>
            </div>

            {/* Landlords/Agents Benefits */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center mb-4">
                <IoHomeOutline className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="font-semibold text-lg mb-4">
                For Landlords & Agents
              </h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-primary-50 rounded-full flex items-center justify-center mt-0.5">
                    <RiMoneyDollarCircleLine className="w-3 h-3 text-primary-500" />
                  </div>
                  <p className="text-gray-700 text-sm">
                    <span className="font-medium">Maximize Returns</span> -
                    Higher occupancy rates and optimized pricing
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-primary-50 rounded-full flex items-center justify-center mt-0.5">
                    <BsShieldCheck className="w-3 h-3 text-primary-500" />
                  </div>
                  <p className="text-gray-700 text-sm">
                    <span className="font-medium">Verified Tenants</span> -
                    Quality tenants with thorough screening process
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-primary-50 rounded-full flex items-center justify-center mt-0.5">
                    <BsCalendarCheck className="w-3 h-3 text-primary-500" />
                  </div>
                  <p className="text-gray-700 text-sm">
                    <span className="font-medium">Flexible Listings</span> -
                    List for long-term rentals or short-term stays
                  </p>
                </div>
              </div>
            </div>

            {/* Property Managers Benefits */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center mb-4">
                <BsArrowRight className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="font-semibold text-lg mb-4">
                For Property Managers
              </h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-primary-50 rounded-full flex items-center justify-center mt-0.5">
                    <FiStar className="w-3 h-3 text-primary-500" />
                  </div>
                  <p className="text-gray-700 text-sm">
                    <span className="font-medium">Streamlined Operations</span>{" "}
                    - Efficient booking and management tools
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-primary-50 rounded-full flex items-center justify-center mt-0.5">
                    <HiUsers className="w-3 h-3 text-primary-500" />
                  </div>
                  <p className="text-gray-700 text-sm">
                    <span className="font-medium">Guest Management</span> -
                    Simplified check-in/out and communication
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-primary-50 rounded-full flex items-center justify-center mt-0.5">
                    <BsCreditCard2Front className="w-3 h-3 text-primary-500" />
                  </div>
                  <p className="text-gray-700 text-sm">
                    <span className="font-medium">Automated Payments</span> -
                    Secure payment processing and reporting
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-10 mx-auto">
        <div className="py-12 md:py-20">
          <p className="text-primary-500 font-medium mb-4">LISTINGS</p>

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
                To more <span className="text-yellow-500">affordable</span>{" "}
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
                src="/images/living-room.jpg"
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
                  src="https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Bedroom"
                  className="w-full h-full object-cover rounded-lg shadow-md"
                />
              </div>
            </div>

            <div className="lg:pl-12">
              <p className="text-gray-500 uppercase font-medium mb-2">
                PROPERTY MANAGEMENT
              </p>
              <h2 className="text-3xl md:text-5xl font-bold text-primary-600 mb-6">
                Get the most reliable property management service in Lagos
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
                    Laundry, cleaning & toiletries management
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  to="/property-management"
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-500 font-semibold text-xl">
                    JD
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">John Doe</h3>
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
                &quot;The apartment was exactly as described. Clean,
                comfortable, and in a great location. The booking process was
                smooth and the customer service was excellent.&quot;
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-500 font-semibold text-xl">
                    SA
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Sarah Adams</h3>
                  <p className="text-gray-500 text-sm">Abuja, Nigeria</p>
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
                &quot;I&apos;ve used Aplet360 multiple times for business trips,
                and they never disappoint. The apartments are always
                well-maintained and the staff is responsive and helpful.&quot;
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-500 font-semibold text-xl">
                    MJ
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Michael Johnson</h3>
                  <p className="text-gray-500 text-sm">
                    Port Harcourt, Nigeria
                  </p>
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
                &quot;The flexible monthly payment options made renting my
                apartment so much easier. I love having a place I can call home
                without the financial strain of a large upfront payment.&quot;
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              to="/testimonials"
              className="text-primary-500 font-medium inline-flex items-center gap-2 hover:text-primary-600 transition-colors"
            >
              <span>View More Testimonials</span>
              <BsArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Blog section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-primary-500 font-medium mb-2">OUR BLOG</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              99 Ways to the Luxury and Comfort You Deserve Everyday
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Explore our latest articles for tips on finding the perfect
              apartment, making the most of your rental experience, and
              discovering hidden gems in Nigeria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl overflow-hidden shadow-md">
              <div className="h-40 overflow-hidden">
                <img
                  src="/images/living-room.jpg"
                  alt="Blog Post"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <p className="text-gray-500 text-xs mb-2">June 12, 2023</p>
                <h3 className="font-semibold mb-2 line-clamp-2">
                  Top 10 Apartments in Lagos for Your Next Home
                </h3>
                <Link
                  to="/blog"
                  className="text-primary-500 text-sm font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
                >
                  <span>Read More</span>
                  <BsArrowRight />
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl overflow-hidden shadow-md">
              <div className="h-40 overflow-hidden">
                <img
                  src="/images/living-room.jpg"
                  alt="Blog Post"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <p className="text-gray-500 text-xs mb-2">May 28, 2023</p>
                <h3 className="font-semibold mb-2 line-clamp-2">
                  5 Things to Look for When Renting Your Next Apartment
                </h3>
                <Link
                  to="/blog"
                  className="text-primary-500 text-sm font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
                >
                  <span>Read More</span>
                  <BsArrowRight />
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl overflow-hidden shadow-md">
              <div className="h-40 overflow-hidden">
                <img
                  src="/images/living-room.jpg"
                  alt="Blog Post"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <p className="text-gray-500 text-xs mb-2">April 15, 2023</p>
                <h3 className="font-semibold mb-2 line-clamp-2">
                  How to Choose the Best Monthly Payment Option for Your
                  Apartment
                </h3>
                <Link
                  to="/blog"
                  className="text-primary-500 text-sm font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
                >
                  <span>Read More</span>
                  <BsArrowRight />
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl overflow-hidden shadow-md">
              <div className="h-40 overflow-hidden">
                <img
                  src="/images/living-room.jpg"
                  alt="Blog Post"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <p className="text-gray-500 text-xs mb-2">March 3, 2023</p>
                <h3 className="font-semibold mb-2 line-clamp-2">
                  The Ultimate Guide to Finding Your Perfect Apartment Rental
                </h3>
                <Link
                  to="/blog"
                  className="text-primary-500 text-sm font-medium inline-flex items-center gap-1 hover:gap-2 transition-all"
                >
                  <span>Read More</span>
                  <BsArrowRight />
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              to="/blog"
              className="bg-primary-500 text-white px-8 py-3 rounded-full inline-flex items-center gap-2 hover:bg-primary-600 transition-colors"
            >
              <span>View All Articles</span>
              <BsArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
