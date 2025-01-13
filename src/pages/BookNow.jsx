import { useState, useEffect } from "react";
import { propertyStore } from "../store/propertyStore";
import { IoLocationOutline } from "react-icons/io5";
import { BiBed, BiBath } from "react-icons/bi";
import { HiOutlineUsers } from "react-icons/hi2";
import { FiChevronDown, FiFilter } from "react-icons/fi";
import { fCurrency } from "@utils/formatNumber";
import { Link, useSearchParams } from "react-router-dom";
import Pagination from "../components/Pagination";
import { useAuth } from "../hooks/useAuth";

const PROPERTY_TYPES = [
  "All Types",
  "apartment",
  "house",
  "villa",
  "studio",
  "penthouse",
  "cottage",
];

export default function BookNow() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: "",
    propertyType: "All Types",
    minPrice: "",
    maxPrice: "",
    city: "",
    state: "",
    bedrooms: "",
    bathrooms: "",
    maxGuests: "",
    amenities: [],
    page: 1,
  });
  const [showTotalPrice, setShowTotalPrice] = useState(false);
  const { properties, pagination, getProperties, isLoading } = propertyStore();
  const { user } = useAuth();
  console.log("user", user);

  useEffect(() => {
    // Get search parameters from URL and update filters
    const search = searchParams.get("search") || "";
    const minPrice = searchParams.get("minPrice") || "";
    const maxPrice = searchParams.get("maxPrice") || "";
    const bedrooms = searchParams.get("bedrooms") || "";

    setFilters((prev) => ({
      ...prev,
      search,
      minPrice,
      maxPrice,
      bedrooms,
    }));

    // Trigger search with URL parameters
    const cleanFilters = {
      search,
      minPrice,
      maxPrice,
      bedrooms,
    };

    // Remove empty values
    Object.keys(cleanFilters).forEach(
      (key) => !cleanFilters[key] && delete cleanFilters[key]
    );

    getProperties(cleanFilters);
  }, [searchParams]); // Re-run when URL parameters change

  useEffect(() => {
    handleSearch();
  }, [filters.page]); // Fetch new data when page changes

  const handleSearch = () => {
    console.log("filters", filters);
    // Remove empty values from filters
    const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (
        value !== "" &&
        value !== null &&
        value !== undefined &&
        (Array.isArray(value) ? value.length > 0 : true)
      ) {
        acc[key] = value;
      }
      return acc;
    }, {});

    getProperties(cleanFilters);
  };

  const handleFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filter changes
    }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  console.log("properties", properties);
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Find Shortlets in Nigeria</h1>
        </div>

        {/* Filters */}
        <form
          onSubmit={handleFilterSubmit}
          className="bg-white rounded-2xl shadow-sm p-4 mb-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                placeholder="Search properties..."
                className="w-full px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                value={filters.search}
                onChange={(e) => handleFilter("search", e.target.value)}
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type of Property
              </label>
              <select
                className="w-full px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                value={filters.propertyType}
                onChange={(e) => handleFilter("propertyType", e.target.value)}
              >
                {PROPERTY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rate per night
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="From"
                  className="w-full px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                  value={filters.minPrice}
                  onChange={(e) => handleFilter("minPrice", e.target.value)}
                />
                <input
                  type="number"
                  placeholder="To"
                  className="w-full px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      maxPrice: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                placeholder="Enter location"
                className="w-full px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                value={filters.city}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, city: e.target.value }))
                }
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                placeholder="Enter state"
                className="w-full px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                value={filters.state}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, state: e.target.value }))
                }
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bedrooms
              </label>
              <input
                type="number"
                placeholder="Enter bedrooms"
                className="w-full px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                value={filters.bedrooms}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, bedrooms: e.target.value }))
                }
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bathrooms
              </label>
              <input
                type="number"
                placeholder="Enter bathrooms"
                className="w-full px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                value={filters.bathrooms}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, bathrooms: e.target.value }))
                }
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Guests
              </label>
              <input
                type="number"
                placeholder="Enter max guests"
                className="w-full px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                value={filters.maxGuests}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, maxGuests: e.target.value }))
                }
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amenities
              </label>
              <select
                className="w-full px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                value={filters.amenities}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    amenities: e.target.value.split(","),
                  }))
                }
              >
                <option value="">Select amenities</option>
                <option value="Wifi">Wifi</option>
                <option value="Air Conditioning">Air Conditioning</option>
                <option value="Kitchen">Kitchen</option>
                <option value="Parking">Parking</option>
              </select>
            </div>

            <div className="col-span-2 md:col-span-4 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setFilters({
                    search: "",
                    propertyType: "All Types",
                    minPrice: "",
                    maxPrice: "",
                    city: "",
                    state: "",
                    bedrooms: "",
                    bathrooms: "",
                    maxGuests: "",
                    amenities: [],
                    page: 1,
                  });
                  handleSearch();
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Clear Filters
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </form>

        {/* Property List */}
        {isLoading ? (
          <div className="text-center py-12">Loading...</div>
        ) : properties?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No properties found matching your criteria.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties?.map((property) => (
                <Link
                  key={property._id}
                  to={`/property/${property._id}`}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="h-64 overflow-hidden">
                    <img
                      src={
                        property.property_images?.[0]?.url ||
                        "/images/living-room.jpg"
                      }
                      alt={property.property_name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-xl">
                        {property.property_name}
                      </h3>
                      <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                        <span className="text-sm font-semibold">4.5</span>
                        <span className="text-xs text-gray-500">★</span>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-600 mb-4">
                      <IoLocationOutline className="w-4 h-4 mr-1" />
                      <span className="text-sm">{`${property.location.city}, ${property.location.state}`}</span>
                    </div>

                    <div className="flex items-center gap-4 text-gray-600 mb-6">
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

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-xl">
                          {fCurrency(property.pricing.per_day.base_price)}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {" "}
                          {property.pricing.per_day.is_active
                            ? "Per Day"
                            : null}{" "}
                        </p>
                      </div>
                      {showTotalPrice && (
                        <div className="text-xs text-gray-500">
                          Total:{" "}
                          {fCurrency(
                            property.pricing.per_day.base_price +
                              property.pricing.per_day.cleaning_fee +
                              property.pricing.per_day.security_deposit
                          )}
                        </div>
                      )}
                      {user?._id === property.owner._id ? (
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700">
                          Edit
                        </button>
                      ) : (
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700">
                          Book Now
                        </button>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {pagination && (
              <Pagination
                pagination={pagination}
                onPageChange={(newPage) => handleFilter("page", newPage)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
