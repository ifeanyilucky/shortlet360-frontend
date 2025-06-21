import { useState, useEffect, useCallback } from "react";
import { propertyStore } from "../store/propertyStore";
import { favoriteStore } from "../store/favoriteStore";
import { IoLocationOutline, IoSearchOutline } from "react-icons/io5";
import { BiBed, BiBath } from "react-icons/bi";
import { HiOutlineUsers } from "react-icons/hi2";
import {
  FiChevronDown,
  FiFilter,
  FiHome,
  FiPlus,
  FiMinus,
} from "react-icons/fi";
import { MdApartment, MdBusiness } from "react-icons/md";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
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
    propertyId: "",
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
    category: searchParams.get("category") || "rent", // Default to rent
  });

  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const { properties, pagination, getProperties, isLoading } = propertyStore();
  const { favorites, addToFavorites, removeFromFavorites, getFavorites } =
    favoriteStore();
  const { user } = useAuth();
  // console.log("user", user);

  useEffect(() => {
    // Get search parameters from URL and update filters
    const search = searchParams.get("search") || "";
    const propertyId = searchParams.get("propertyId") || "";
    const minPrice = searchParams.get("minPrice") || "";
    const maxPrice = searchParams.get("maxPrice") || "";
    const bedrooms = searchParams.get("bedrooms") || "";
    const category = searchParams.get("category") || "rent"; // Default to rent if not specified

    // If no category is specified in the URL, update the URL to include the default category
    if (!searchParams.get("category")) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("category", "rent");
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}?${newSearchParams.toString()}`
      );
    }

    setFilters((prev) => ({
      ...prev,
      search,
      propertyId,
      minPrice,
      maxPrice,
      bedrooms,
      category,
    }));

    // Trigger search with URL parameters
    const cleanFilters = {
      search,
      propertyId,
      minPrice,
      maxPrice,
      bedrooms,
      category, // This will always have a value (either from URL or default "rent")
    };

    // Remove empty values except category
    Object.keys(cleanFilters).forEach(
      (key) =>
        key !== "category" && !cleanFilters[key] && delete cleanFilters[key]
    );

    // Only show published and active properties
    cleanFilters.publication_status = "published";
    cleanFilters.isActive = "true";

    getProperties(cleanFilters);
  }, [searchParams, getProperties]); // Run on mount and when searchParams changes

  useEffect(() => {
    getFavorites();
  }, [getFavorites]);

  const handleSearch = useCallback(() => {
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

    // Always include publication_status and isActive filters to only show published and active properties
    getProperties({
      ...cleanFilters,
      publication_status: "published",
      isActive: "true",
    });
  }, [filters, getProperties]);

  const handleFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filter changes
    }));

    // Update URL parameters for property ID searches to make them shareable
    if (key === "propertyId") {
      const newSearchParams = new URLSearchParams(searchParams);
      if (value) {
        newSearchParams.set("propertyId", value);
      } else {
        newSearchParams.delete("propertyId");
      }
      window.history.pushState(
        {},
        "",
        `${window.location.pathname}?${newSearchParams.toString()}`
      );
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };
  useEffect(() => {
    handleSearch();
  }, [filters.page, handleSearch]); // Fetch new data when page changes

  // Function to switch between rent and shortlet categories
  const switchCategory = useCallback(
    (category) => {
      // Update filters
      setFilters((prev) => ({
        ...prev,
        category,
        page: 1, // Reset to first page when switching categories
      }));

      // Update URL to reflect the category change
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("category", category);
      window.history.pushState(
        {},
        "",
        `${window.location.pathname}?${newSearchParams.toString()}`
      );

      // Trigger search with the new category
      handleSearch();
    },
    [searchParams, handleSearch]
  );

  const handleFavoriteClick = async (e, propertyId) => {
    e.preventDefault(); // Prevent navigation
    if (favorites.some((fav) => fav._id === propertyId)) {
      await removeFromFavorites(propertyId);
    } else {
      await addToFavorites(propertyId);
    }
  };

  const getActivePricing = (property) => {
    const { per_day, per_week, per_month, rent_per_year } =
      property?.pricing || {};

    // For rent properties
    if (rent_per_year?.is_active && property.property_category === "rent") {
      return {
        price: rent_per_year.annual_rent,
        period: "year",
        fees: {
          agency_fee: rent_per_year.is_agency_fee_active
            ? rent_per_year.agency_fee
            : 0,
          commission_fee: rent_per_year.is_commission_fee_active
            ? rent_per_year.commission_fee
            : 0,
          caution_fee: rent_per_year.is_caution_fee_active
            ? rent_per_year.caution_fee
            : 0,
          legal_fee: rent_per_year.is_legal_fee_active
            ? rent_per_year.legal_fee
            : 0,
        },
      };
    }

    // For office properties - prioritize monthly and yearly pricing
    if (property.property_category === "office") {
      if (per_month?.is_active) {
        return {
          type: "office",
          price: per_month.base_price,
          period: "month",
          cleaning_fee: per_month.cleaning_fee,
          security_deposit: per_month.security_deposit,
          total:
            per_month.base_price +
            per_month.cleaning_fee +
            per_month.security_deposit,
        };
      }
      if (rent_per_year?.is_active) {
        return {
          type: "office",
          price: rent_per_year.annual_rent,
          period: "year",
          fees: {
            agency_fee: rent_per_year.is_agency_fee_active
              ? rent_per_year.agency_fee
              : 0,
            commission_fee: rent_per_year.is_commission_fee_active
              ? rent_per_year.commission_fee
              : 0,
            caution_fee: rent_per_year.is_caution_fee_active
              ? rent_per_year.caution_fee
              : 0,
            legal_fee: rent_per_year.is_legal_fee_active
              ? rent_per_year.legal_fee
              : 0,
          },
        };
      }
    }

    // For shortlet properties - return all available pricing options
    const pricingOptions = {};

    if (per_day?.is_active) {
      pricingOptions.day = {
        base_price: per_day.base_price,
        cleaning_fee: per_day.cleaning_fee,
        security_deposit: per_day.security_deposit,
        total:
          per_day.base_price + per_day.cleaning_fee + per_day.security_deposit,
      };
    }

    if (per_week?.is_active) {
      pricingOptions.week = {
        base_price: per_week.base_price,
        cleaning_fee: per_week.cleaning_fee,
        security_deposit: per_week.security_deposit,
        total:
          per_week.base_price +
          per_week.cleaning_fee +
          per_week.security_deposit,
      };
    }

    if (per_month?.is_active) {
      pricingOptions.month = {
        base_price: per_month.base_price,
        cleaning_fee: per_month.cleaning_fee,
        security_deposit: per_month.security_deposit,
        total:
          per_month.base_price +
          per_month.cleaning_fee +
          per_month.security_deposit,
      };
    }

    // If it's a shortlet with pricing options
    if (Object.keys(pricingOptions).length > 0) {
      return {
        type: "shortlet",
        options: pricingOptions,
      };
    }

    // Fallback to old behavior for backward compatibility
    if (per_month?.is_active) {
      return {
        price: per_month.base_price,
        period: "month",
      };
    }
    if (per_week?.is_active) {
      return {
        price: per_week.base_price,
        period: "week",
      };
    }
    if (per_day?.is_active) {
      return {
        price: per_day.base_price,
        period: "day",
      };
    }

    return null;
  };

  // console.log("properties", properties);
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold">Find Properties in Nigeria</h1>

          {/* Category Tabs */}
          <div className="flex bg-white rounded-lg shadow-sm overflow-hidden">
            <button
              onClick={() => switchCategory("rent")}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium ${
                filters.category === "rent"
                  ? "bg-accent-500 text-white"
                  : "bg-white text-gray-700 hover:bg-accent-50"
              }`}
            >
              <FiHome className="w-4 h-4" />
              <span>Rent</span>
            </button>
            <button
              onClick={() => switchCategory("shortlet")}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium ${
                filters.category === "shortlet"
                  ? "bg-accent-500 text-white"
                  : "bg-white text-gray-700 hover:bg-accent-50"
              }`}
            >
              <MdApartment className="w-4 h-4" />
              <span>Shortlet</span>
            </button>
            <button
              onClick={() => switchCategory("office")}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium ${
                filters.category === "office"
                  ? "bg-accent-500 text-white"
                  : "bg-white text-gray-700 hover:bg-accent-50"
              }`}
            >
              <MdBusiness className="w-4 h-4" />
              <span>Office</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <form
          onSubmit={handleFilterSubmit}
          className="bg-white rounded-2xl shadow-sm p-6 mb-8"
        >
          {/* Main Filters - Always Visible */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {/* Search Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IoSearchOutline className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Location, property name..."
                  className="w-full pl-10 pr-4 py-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-accent-500 focus:border-accent-500 focus:outline-none"
                  value={filters.search}
                  onChange={(e) => handleFilter("search", e.target.value)}
                />
              </div>
            </div>

            {/* Property ID Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property ID
                {filters.propertyId && (
                  <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    Active
                  </span>
                )}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiHome className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Enter property ID..."
                  className={`w-full pl-10 pr-10 py-3 text-sm text-gray-900 border rounded-lg bg-white focus:ring-2 focus:ring-accent-500 focus:border-accent-500 focus:outline-none ${
                    filters.propertyId
                      ? "border-blue-300 bg-blue-50"
                      : "border-gray-300"
                  }`}
                  value={filters.propertyId}
                  onChange={(e) => handleFilter("propertyId", e.target.value)}
                />
                {filters.propertyId && (
                  <button
                    type="button"
                    onClick={() => handleFilter("propertyId", "")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <FiMinus className="h-4 w-4" />
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Search by unique property ID (e.g., SL123456) or click on any
                property ID badge
              </p>
            </div>

            {/* Bedrooms Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BiBed className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  placeholder="Number of bedrooms"
                  className="w-full pl-10 pr-4 py-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-accent-500 focus:border-accent-500 focus:outline-none"
                  value={filters.bedrooms}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      bedrooms: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            {/* Price Range Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full px-4 py-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-accent-500 focus:border-accent-500 focus:outline-none"
                  value={filters.minPrice}
                  onChange={(e) => handleFilter("minPrice", e.target.value)}
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full px-4 py-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-accent-500 focus:border-accent-500 focus:outline-none"
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
          </div>

          {/* Show More Filters Toggle */}
          <div className="flex justify-center mb-6">
            <button
              type="button"
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              className="flex items-center gap-2 text-accent-600 hover:text-accent-800 font-medium text-sm"
            >
              {showMoreFilters ? (
                <>
                  <FiMinus className="w-4 h-4" />
                  <span>Show Less Filters</span>
                </>
              ) : (
                <>
                  <FiPlus className="w-4 h-4" />
                  <span>Show More Filters</span>
                </>
              )}
            </button>
          </div>

          {/* Additional Filters - Toggleable */}
          {showMoreFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 border-t pt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type of Property
                </label>
                <select
                  className="w-full px-4 py-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Enter city"
                  className="w-full px-4 py-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                  value={filters.city}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, city: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  placeholder="Enter state"
                  className="w-full px-4 py-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                  value={filters.state}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, state: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms
                </label>
                <input
                  type="number"
                  placeholder="Enter bathrooms"
                  className="w-full px-4 py-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                  value={filters.bathrooms}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      bathrooms: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Guests
                </label>
                <input
                  type="number"
                  placeholder="Enter max guests"
                  className="w-full px-4 py-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                  value={filters.maxGuests}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      maxGuests: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amenities
                </label>
                <select
                  className="w-full px-4 py-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
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
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-end gap-4">
            <button
              type="button"
              onClick={() => {
                // Clear all filters except category
                const currentCategory = filters.category;
                setFilters({
                  search: "",
                  propertyId: "",
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
                  category: currentCategory, // Preserve current category
                });

                // Update URL to only keep the category parameter
                const newSearchParams = new URLSearchParams();
                newSearchParams.set("category", currentCategory);
                window.history.replaceState(
                  {},
                  document.title,
                  `${window.location.pathname}?${newSearchParams.toString()}`
                );

                // Trigger search with only category filter
                handleSearch();
              }}
              className="px-6 py-3 text-sm text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
            >
              Clear Filters
            </button>
            <button
              type="submit"
              className="px-8 py-3 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
            >
              <FiFilter className="w-4 h-4" />
              <span>Apply Filters</span>
            </button>
            <Link to="/user/favorites">
              <button className="px-6 py-3 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                View Favorites
              </button>
            </Link>
          </div>
        </form>

        {/* Property ID Search Status */}
        {filters.propertyId && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FiHome className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">
                  Searching for Property ID:{" "}
                  <span className="font-bold">{filters.propertyId}</span>
                </span>
              </div>
              <button
                onClick={() => handleFilter("propertyId", "")}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Clear Search
              </button>
            </div>
          </div>
        )}

        {/* Property List */}
        {isLoading ? (
          <div className="text-center py-12">Loading...</div>
        ) : properties?.length === 0 ? (
          <div className="text-center py-12">
            {filters.propertyId ? (
              <div>
                <p className="text-gray-500 mb-2">
                  No property found with ID:{" "}
                  <span className="font-semibold">{filters.propertyId}</span>
                </p>
                <p className="text-sm text-gray-400">
                  Please check the property ID and try again, or browse all
                  properties.
                </p>
                <button
                  onClick={() => handleFilter("propertyId", "")}
                  className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Browse All Properties
                </button>
              </div>
            ) : (
              <p className="text-gray-500">
                No properties found matching your criteria.
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties?.map((property) => (
                <Link
                  key={property._id}
                  to={`/property/${property._id}`}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="relative h-64 overflow-hidden">
                    {/* Property Category Badge */}
                    <div
                      className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-medium ${
                        property.property_category === "shortlet"
                          ? "bg-blue-500 text-white"
                          : property.property_category === "office"
                          ? "bg-purple-500 text-white"
                          : "bg-green-500 text-white"
                      }`}
                    >
                      {property.property_category === "shortlet"
                        ? "Shortlet"
                        : property.property_category === "office"
                        ? "Office"
                        : "Rent"}
                    </div>

                    {/* Property Type Badge */}
                    <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-gray-800 bg-opacity-70 text-white text-xs font-medium">
                      {property.property_type.charAt(0).toUpperCase() +
                        property.property_type.slice(1)}
                    </div>

                    <img
                      src={
                        property.property_images?.[0]?.url ||
                        "/images/living-room.jpg"
                      }
                      alt={property.property_name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-xl text-gray-800 line-clamp-1">
                        {property.property_name}
                      </h3>
                      {/* Property ID Badge */}
                      <div
                        className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full cursor-pointer hover:bg-blue-100 transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // Copy to clipboard and show in search
                          navigator.clipboard.writeText(property.short_id);
                          setFilters((prev) => ({
                            ...prev,
                            propertyId: property.short_id,
                            search: "",
                          }));
                          handleSearch();
                        }}
                        title="Click to search by this Property ID"
                      >
                        <span className="text-xs font-medium text-blue-600">
                          ID: {property.short_id}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-600 mb-3">
                      <IoLocationOutline className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span className="text-sm line-clamp-1">{`${property.location.city}, ${property.location.state}`}</span>
                    </div>

                    <div className="flex items-center gap-4 text-gray-600 mb-4">
                      <div className="flex items-center">
                        <BiBed className="w-5 h-5 mr-1" />
                        <span className="text-sm">
                          {property.bedroom_count}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <BiBath className="w-5 h-5 mr-1" />
                        <span className="text-sm">
                          {property.bathroom_count}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <HiOutlineUsers className="w-5 h-5 mr-1" />
                        <span className="text-sm">{property.max_guests}</span>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-100 my-3"></div>

                    {/* Pricing Section */}
                    <div>
                      {(() => {
                        const pricing = getActivePricing(property);
                        if (!pricing) return null;

                        // For Rent Properties
                        if (pricing.period === "year") {
                          return (
                            <div className="mb-4">
                              <div className="flex items-baseline">
                                <span className="text-lg font-bold text-gray-900">
                                  {fCurrency(pricing.price)}
                                </span>
                                <span className="text-sm text-gray-500 ml-1">
                                  /year
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                + Agency & Legal fees
                              </div>
                            </div>
                          );
                        }

                        // For Office Properties
                        if (pricing.type === "office") {
                          return (
                            <div className="mb-4">
                              <div className="flex items-baseline">
                                <span className="text-lg font-bold text-gray-900">
                                  {fCurrency(pricing.price)}
                                </span>
                                <span className="text-sm text-gray-500 ml-1">
                                  /{pricing.period}
                                </span>
                              </div>
                              {pricing.period === "month" && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Total: {fCurrency(pricing.total)} (includes
                                  fees)
                                </div>
                              )}
                              {pricing.period === "year" && (
                                <div className="text-xs text-gray-500 mt-1">
                                  + Agency & Legal fees
                                </div>
                              )}
                            </div>
                          );
                        }

                        // For Shortlet Properties
                        if (pricing.type === "shortlet") {
                          return (
                            <div className="space-y-2">
                              {pricing.options.day && (
                                <div className="flex justify-between items-center">
                                  <div className="flex items-baseline">
                                    <span className="font-bold text-gray-900">
                                      {fCurrency(
                                        pricing.options.day.base_price
                                      )}
                                    </span>
                                    <span className="text-xs text-gray-500 ml-1">
                                      /day
                                    </span>
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Total:{" "}
                                    {fCurrency(pricing.options.day.total)}
                                  </div>
                                </div>
                              )}

                              {pricing.options.week && (
                                <div className="flex justify-between items-center">
                                  <div className="flex items-baseline">
                                    <span className="font-bold text-gray-900">
                                      {fCurrency(
                                        pricing.options.week.base_price
                                      )}
                                    </span>
                                    <span className="text-xs text-gray-500 ml-1">
                                      /week
                                    </span>
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Total:{" "}
                                    {fCurrency(pricing.options.week.total)}
                                  </div>
                                </div>
                              )}

                              {pricing.options.month && (
                                <div className="flex justify-between items-center">
                                  <div className="flex items-baseline">
                                    <span className="font-bold text-gray-900">
                                      {fCurrency(
                                        pricing.options.month.base_price
                                      )}
                                    </span>
                                    <span className="text-xs text-gray-500 ml-1">
                                      /month
                                    </span>
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Total:{" "}
                                    {fCurrency(pricing.options.month.total)}
                                  </div>
                                </div>
                              )}

                              <div className="text-xs text-gray-500 mt-1">
                                *Includes cleaning fee & security deposit
                              </div>
                            </div>
                          );
                        }

                        // Fallback for other pricing structures
                        return (
                          <div className="flex items-baseline">
                            <span className="text-lg font-bold text-gray-900">
                              {fCurrency(pricing.price)}
                            </span>
                            <span className="text-sm text-gray-500 ml-1">
                              /{pricing.period}
                            </span>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between mt-4">
                      {user && (
                        <button
                          onClick={(e) => handleFavoriteClick(e, property._id)}
                          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                          {favorites.some((fav) => fav._id === property._id) ? (
                            <AiFillHeart className="w-6 h-6 text-red-500" />
                          ) : (
                            <AiOutlineHeart className="w-6 h-6 text-gray-500" />
                          )}
                        </button>
                      )}

                      {user?._id === property.owner._id ? (
                        <span className="text-xs text-gray-500 italic">
                          Your property
                        </span>
                      ) : (
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors ml-auto">
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
