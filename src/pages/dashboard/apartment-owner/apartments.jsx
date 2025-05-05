import DataTable from "../../../components/DataTable";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { propertyStore } from "@store/propertyStore";
import { FaEdit, FaTrash, FaFilter } from "react-icons/fa";
import LoadingOverlay from "../../../components/LoadingOverlay";
import { useAuth } from "../../../hooks/useAuth";
import Pagination from "../../../components/Pagination";
import RightSidebarModal from "../../../components/RightSidebarModal";
import AvailabilityCalendar from "../../../components/AvailabilityCalendar";
import PropertyDetailsModal from "../../../components/PropertyDetailsModal";

export default function Apartments() {
  const { properties, pagination, getProperties, isLoading } = propertyStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filters, setFilters] = useState({
    property_name: "",
    city: "",
    property_type: "",
    is_active: "",
    minPrice: "",
    maxPrice: "",
    short_id: "",
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleView = (id) => {
    setSelectedPropertyId(id);
    setShowAvailabilityModal(true);
  };

  const handleEdit = (id) => {
    navigate(`/owner/edit-apartment/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this apartment?")) {
      // Add delete logic here
      console.log("Delete apartment:", id);
    }
  };

  const handleViewDetails = (id) => {
    setSelectedPropertyId(id);
    setShowDetailsModal(true);
  };

  const columns = [
    {
      header: "Name",
      key: "property_name",
    },
    {
      header: "Type",
      key: "property_category",
      render: (property_category) =>
        property_category === "shortlet" ? "Shortlet" : "Rent",
    },
    {
      header: "Location",
      key: "location",
      render: (location) => `${location.city}, ${location.state}`,
    },
    {
      header: "Pricing",
      key: "pricing",
      render: (pricing) => (
        <div className="space-y-1">
          {pricing.per_day.is_active && (
            <div className="text-sm">
              <span className="font-medium">Daily:</span> ₦
              {pricing.per_day.base_price.toLocaleString()}
            </div>
          )}
          {pricing.per_week.is_active && (
            <div className="text-sm">
              <span className="font-medium">Weekly:</span> ₦
              {pricing.per_week.base_price.toLocaleString()}
            </div>
          )}
          {pricing.per_month.is_active && (
            <div className="text-sm">
              <span className="font-medium">Monthly:</span> ₦
              {pricing.per_month.base_price.toLocaleString()}
            </div>
          )}
          {pricing.rent_per_year.is_active && (
            <div className="text-sm">
              <span className="font-medium">Annual:</span> ₦
              {pricing.rent_per_year.annual_rent.toLocaleString()}
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Rooms",
      key: "rooms",
      render: (_, row) => (
        <div className="flex gap-2">
          <span className="text-gray-600">
            {row.bedroom_count}{" "}
            {row.bedroom_count === 1 ? "Bedroom" : "Bedrooms"}
          </span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-600">
            {row.bathroom_count}{" "}
            {row.bathroom_count === 1 ? "Bathroom" : "Bathrooms"}
          </span>
        </div>
      ),
    },
    {
      header: "Status",
      key: "is_active",
      render: (isActive) => (
        <span
          className={`px-2 py-1 rounded-full text-sm ${
            isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Actions",
      key: "actions",
      sortable: false,
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
            onClick={() => handleEdit(row._id)}
          >
            <FaEdit />
          </button>
          <button
            className="p-2 text-red-600 hover:bg-red-50 rounded-full"
            onClick={() => handleDelete(row._id)}
          >
            <FaTrash />
          </button>

          <button
            className="py-2 bg-primary-500 text-xs px-3 text-white hover:bg-primary-600 rounded-full"
            onClick={() => handleView(row._id)}
          >
            Check availability
          </button>

          <button
            className="py-2 bg-gray-500 text-xs px-3 text-white hover:bg-gray-600 rounded-full"
            onClick={() => handleViewDetails(row._id)}
          >
            View details
          </button>
        </div>
      ),
    },
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplyFilters = () => {
    const filterParams = {
      owner: user._id,
      ...filters,
    };

    // Remove empty filters
    Object.keys(filterParams).forEach((key) => {
      if (filterParams[key] === "") {
        delete filterParams[key];
      }
    });

    getData(filterParams, 1);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      property_name: "",
      city: "",
      property_type: "",
      is_active: "",
      minPrice: "",
      maxPrice: "",
      short_id: "",
    });
    getData({ owner: user._id }, 1);
  };

  const getData = useCallback(
    async (filter = {}, page = 1) => {
      if (!user?._id) return;

      // Instead of nesting filter inside an object, spread it directly
      const params = {
        ...filter, // Spread filter params directly
        owner: user._id,
        page,
        limit: 10,
      };
      await getProperties(params);
    },
    [user, getProperties]
  );

  useEffect(() => {
    if (user?._id) {
      getData({ owner: user._id }, currentPage);
    }
  }, [user, currentPage, getData]);

  return (
    <div className="p-6">
      {isLoading && <LoadingOverlay />}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Apartments</h2>
        <button
          onClick={() => navigate("/owner/add-apartment")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add New Apartment
        </button>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
          >
            <FaFilter className="text-gray-500" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Name
                </label>
                <input
                  type="text"
                  name="property_name"
                  value={filters.property_name}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Filter by property name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={filters.city}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Filter by city"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Type
                </label>
                <select
                  name="property_type"
                  value={filters.property_type}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="studio">Studio</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="is_active"
                  value={filters.is_active}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Price (₦)
                </label>
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Minimum price"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Price (₦)
                </label>
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Maximum price"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property ID
                </label>
                <input
                  type="text"
                  name="short_id"
                  value={filters.short_id}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="AP-123456"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Reset
              </button>
              <button
                onClick={handleApplyFilters}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow">
        <DataTable columns={columns} data={properties || []} />
      </div>

      {pagination && (
        <div className="mt-6">
          <Pagination
            currentPage={pagination.current_page}
            totalPages={pagination.total_pages}
            onPageChange={(page) =>
              getData({ ...filters, owner: user._id }, page)
            }
          />
        </div>
      )}

      {/* Availability Modal */}
      <RightSidebarModal
        isOpen={showAvailabilityModal}
        onClose={() => setShowAvailabilityModal(false)}
        title="Property Availability"
      >
        {selectedPropertyId && (
          <AvailabilityCalendar propertyId={selectedPropertyId} />
        )}
      </RightSidebarModal>

      {/* Details Modal */}
      <RightSidebarModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Property Details"
      >
        {selectedPropertyId && (
          <PropertyDetailsModal propertyId={selectedPropertyId} />
        )}
      </RightSidebarModal>
    </div>
  );
}
