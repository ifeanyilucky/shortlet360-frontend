import { FiChevronDown } from "react-icons/fi";
import { MdApartment } from "react-icons/md";
import { BsCreditCard2Front } from "react-icons/bs";
import { HiUsers } from "react-icons/hi";
import { RiSecurePaymentLine } from "react-icons/ri";
import { IoLocationOutline } from "react-icons/io5";
import { BiBed, BiBath } from "react-icons/bi";
import { HiOutlineUsers } from "react-icons/hi2";
import { useState } from "react";
import { useEffect } from "react";
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
  });
  const { properties, getProperties, isLoading } = propertyStore();

  useEffect(() => {
    getProperties();
  }, []);

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

    navigate(`/book-now?${queryParams.toString()}`);
  };

  return (
    <div>
      <section className="min-h-screen bg-white text-gray-800 h-full mt-0">
        <div className="max-w-6xl mx-auto px-4 text-center pt-20 pb-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            The better way to find{" "}
            <span className="text-teal-500">Shortlets</span>
          </h1>

          <p className="text-gray-600 max-w-3xl mx-auto mb-12 text-sm md:text-base px-4">
            Shortlet360 is your premier platform for finding and booking
            short-term accommodations across Nigeria. Whether you're traveling
            for business, vacation, or need a temporary stay, find the perfect
            furnished apartment with flexible booking options.
          </p>

          {/* Search Section */}
          <form
            onSubmit={handleSearch}
            className="bg-white p-4 rounded-3xl md:rounded-full flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 max-w-4xl mx-auto px-6 shadow-lg"
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

            <button
              type="submit"
              className="w-full md:w-auto bg-blue-600 px-6 py-3 rounded-full whitespace-nowrap text-xs text-white hover:bg-blue-700"
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

      <section className="px-4 md:px-10 mx-auto">
        <div className="py-12 md:py-20">
          <p className="text-teal-500 font-medium mb-4">WHY SHORTLET360</p>

          <div className="flex flex-col md:flex-row gap-8 md:gap-20 mb-12">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold">
                Quality apartments.
                <br />
                Trusted by thousands of
                <br />
                travelers.
              </h2>
            </div>
            <div className="flex-1">
              <p className="text-gray-600 text-sm md:text-base">
                We offer you access to premium short-term accommodations, with
                all the comforts of home. Filter by price, location, apartment
                type and length of stay to find your perfect temporary home.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                <MdApartment className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="font-semibold text-lg">
                Fully furnished apartments
              </h3>
              <p className="text-gray-600 text-sm">
                Find fully furnished apartments ready for immediate occupancy,
                perfect for short stays from a few days to several weeks.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <BsCreditCard2Front className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="font-semibold text-lg">Flexible booking</h3>
              <p className="text-gray-600 text-sm">
                Book your stay with flexible check-in and check-out dates. Pay
                securely online with multiple payment options.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                <HiUsers className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="font-semibold text-lg">Group booking available</h3>
              <p className="text-gray-600 text-sm">
                Perfect for family vacations or business teams. Book multiple
                units in the same location for group stays.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                <RiSecurePaymentLine className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="font-semibold text-lg">No hidden charges</h3>
              <p className="text-gray-600 text-sm">
                Transparent pricing with no surprise fees. What you see is what
                you pay - all utilities and amenities included.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-10 mx-auto">
        <div className="py-12 md:py-20">
          <p className="text-teal-500 font-medium mb-4">LISTINGS</p>

          <div className="flex flex-col md:flex-row gap-8 md:gap-20 mb-12">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold">
                Explore amazing spaces
                <br />
                on Shortlet360 and pay
                <br />
                daily.
              </h2>
            </div>
            <div className="flex-1">
              <p className="text-gray-600 text-sm md:text-base">
                Shortlet360-managed apartments are move-in ready and all bills
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
                  className="bg-white rounded-3xl overflow-hidden shadow-md"
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
            <button className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-full text-sm hover:bg-blue-700">
              View Listings
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
