import DataTable from "../../../components/DataTable";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useTenantStore from "@store/tenantStore";
import { FaEye, FaFilter } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import LoadingOverlay from "../../../components/LoadingOverlay";
import { useAuth } from "../../../hooks/useAuth";
import Pagination from "../../../components/Pagination";
import { format } from "date-fns";
import { fCurrency } from "@utils/formatNumber";
import RightSidebarModal from "../../../components/RightSidebarModal";
import TenantDetails from "../../../components/TenantDetails";
import { FiEye } from "react-icons/fi";
import { MdOutlineCancel } from "react-icons/md";

export default function UserTenantHistory() {
  const { tenants, tenant, pagination, getTenants, getTenant, isLoading } =
    useTenantStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    property_name: "",
    lease_status: "",
    payment_status: "",
  });
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    getTenants({
      search: searchTerm,
      page: 1,
      tenant: user?._id,
      ...filters,
    });
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    getTenants({
      search: searchTerm,
      page,
      tenant: user?._id,
      ...filters,
    });
  };

  const handleViewTenant = async (id) => {
    await getTenant(id);
    setIsViewModalOpen(true);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplyFilters = () => {
    getTenants({
      search: searchTerm,
      page: 1,
      tenant: user?._id,
      ...filters,
    });
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      property_name: "",
      lease_status: "",
      payment_status: "",
    });
    getTenants({
      search: searchTerm,
      page: 1,
      tenant: user?._id,
    });
  };

  useEffect(() => {
    getTenants({ page: currentPage, tenant: user?._id });
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "terminated":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const columns = [
    {
      header: "Property",
      key: "property",
      render: (_, row) => (
        <div>
          <p className="font-medium">{row.property_id.property_name}</p>
          <p className="text-sm text-gray-600">
            {row.property_id.location.city}, {row.property_id.location.state}
          </p>
        </div>
      ),
    },
    {
      header: "Lease Period",
      key: "lease",
      render: (_, row) => (
        <div>
          <div className="mb-1">
            <span className="text-sm font-medium">Start: </span>
            <span className="text-sm">
              {format(new Date(row.lease_start_date), "MMM dd, yyyy")}
            </span>
          </div>
          <div>
            <span className="text-sm font-medium">End: </span>
            <span className="text-sm">
              {format(new Date(row.lease_end_date), "MMM dd, yyyy")}
            </span>
          </div>
          <div className="mt-1 text-sm text-gray-600">
            {row.tenant_count} {row.tenant_count === 1 ? "person" : "people"}
          </div>
        </div>
      ),
    },
    {
      header: "Rent",
      key: "rent",
      render: (_, row) => (
        <div>
          <p className="font-medium">{fCurrency(row.monthly_rent)}/month</p>
          <p className="text-sm text-gray-600">
            {fCurrency(row.annual_rent)}/year
          </p>
          <p className="text-sm text-gray-600">
            Deposit: {fCurrency(row.security_deposit)}
          </p>
        </div>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (_, row) => (
        <div className="space-y-1">
          <span
            className={`px-2 py-1 rounded-full text-sm ${getStatusColor(
              row.lease_status
            )}`}
          >
            {row.lease_status.charAt(0).toUpperCase() +
              row.lease_status.slice(1)}
          </span>
          <div>
            <span
              className={`px-2 py-1 rounded-full text-sm ${getPaymentStatusColor(
                row.payment_status
              )}`}
            >
              {row.payment_status.charAt(0).toUpperCase() +
                row.payment_status.slice(1)}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Actions",
      key: "actions",
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleViewTenant(row._id)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
            title="View Details"
          >
            View
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      {isLoading && <LoadingOverlay />}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Rental History</h2>
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
                  Lease Status
                </label>
                <select
                  name="lease_status"
                  value={filters.lease_status}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="expired">Expired</option>
                  <option value="terminated">Terminated</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Status
                </label>
                <select
                  name="payment_status"
                  value={filters.payment_status}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue</option>
                </select>
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

      {!tenants || tenants.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaEye className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium mb-2">
              No rental history yet
            </p>
            <p className="text-gray-400 text-sm mb-4">
              You haven't rented any properties yet. Start exploring to find
              your perfect home.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Properties
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <DataTable
            columns={columns}
            data={Array.isArray(tenants) ? tenants : []}
          />
        </div>
      )}

      {pagination && (
        <div className="mt-6">
          <Pagination
            currentPage={pagination.current_page}
            totalPages={pagination.total_pages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <RightSidebarModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Rental Details"
      >
        <TenantDetails tenant={tenant} />
      </RightSidebarModal>
    </div>
  );
}
