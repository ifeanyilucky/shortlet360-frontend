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
  const { properties, pagination, getOwnerProperties, isLoading } =
    propertyStore();
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
    publication_status: "",
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
      header: "Active Status",
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
      header: "Publication Status",
      key: "publication_status",
      render: (status) => {
        const statusConfig = {
          pending: {
            className: "bg-yellow-100 text-yellow-800",
            text: "Pending Review",
          },
          published: {
            className: "bg-green-100 text-green-800",
            text: "Published",
          },
          rejected: {
            className: "bg-red-100 text-red-800",
            text: "Rejected",
          },
        };

        const config = statusConfig[status] || {
          className: "bg-gray-100 text-gray-800",
          text: status || "Unknown",
        };

        return (
          <span
            className={`px-2 py-1 rounded-full text-sm ${config.className}`}
          >
            {config.text}
          </span>
        );
      },
    },
    {
      header: "Actions",
      key: "actions",
      sortable: false,
      render: (_, row) => (
        <div className="flex flex-wrap gap-2">
          <button
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200"
            onClick={() => handleEdit(row._id)}
            title="Edit Property"
          >
            <FaEdit />
          </button>
          <button
            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
            onClick={() => handleDelete(row._id)}
            title="Delete Property"
          >
            <FaTrash />
          </button>

          <button
            className="py-2 bg-primary-900 text-xs px-3 text-white hover:bg-primary-800 rounded-full transition-colors duration-200"
            onClick={() => handleView(row._id)}
            title="Check Availability"
          >
            Check availability
          </button>

          <button
            className="py-2 bg-gray-500 text-xs px-3 text-white hover:bg-gray-600 rounded-full transition-colors duration-200"
            onClick={() => handleViewDetails(row._id)}
            title="View Details"
          >
            View details
          </button>

          {/* Show status-specific actions */}
          {row.publication_status === "pending" && (
            <div className="w-full mt-2">
              <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                ⏳ Awaiting admin review
              </span>
            </div>
          )}
          {row.publication_status === "rejected" && (
            <div className="w-full mt-2">
              <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
                ❌ Review rejected - contact support
              </span>
            </div>
          )}
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
      publication_status: "",
      minPrice: "",
      maxPrice: "",
      short_id: "",
    });
    getData({}, 1);
  };

  const getData = useCallback(
    async (filter = {}, page = 1) => {
      if (!user?._id) return;

      // Use the new owner properties endpoint - no need to pass owner ID
      const params = {
        ...filter, // Spread filter params directly
        page,
        limit: 10,
      };
      await getOwnerProperties(params);
    },
    [user, getOwnerProperties]
  );

  useEffect(() => {
    if (user?._id) {
      getData({}, currentPage);
    }
  }, [user, currentPage, getData]);

  return (
    <div className="">
      {isLoading && <LoadingOverlay />}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Apartments</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage your properties and track their approval status
          </p>
        </div>
        <button
          onClick={() => navigate("/owner/add-apartment")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Add New Apartment
        </button>
      </div>

      {/* Status Summary */}
      {properties && properties.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Property Status Summary
          </h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span className="text-sm text-gray-600">
                Pending Review:{" "}
                {
                  properties.filter((p) => p.publication_status === "pending")
                    .length
                }
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-sm text-gray-600">
                Published:{" "}
                {
                  properties.filter((p) => p.publication_status === "published")
                    .length
                }
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <span className="text-sm text-gray-600">
                Rejected:{" "}
                {
                  properties.filter((p) => p.publication_status === "rejected")
                    .length
                }
              </span>
            </div>
          </div>
        </div>
      )}

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
                  Active Status
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
                  Publication Status
                </label>
                <select
                  name="publication_status"
                  value={filters.publication_status}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Publication Status</option>
                  <option value="pending">Pending Review</option>
                  <option value="published">Published</option>
                  <option value="rejected">Rejected</option>
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

      {!properties || properties.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaEdit className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium mb-2">
              No properties yet
            </p>
            <p className="text-gray-400 text-sm mb-4">
              You haven't added any properties yet. Start by adding your first
              apartment to begin renting.
            </p>
            <button
              onClick={() => navigate("/owner/add-apartment")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Property
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <DataTable columns={columns} data={properties || []} />
        </div>
      )}

      {pagination && (
        <div className="mt-6">
          <Pagination
            currentPage={pagination.current_page}
            totalPages={pagination.total_pages}
            onPageChange={(page) => getData({ ...filters }, page)}
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
