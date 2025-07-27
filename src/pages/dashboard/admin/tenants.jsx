import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiEdit,
  FiTrash2,
  FiCalendar,
  FiDollarSign,
  FiUser,
  FiHome,
} from "react-icons/fi";
import { MdOutlineAssignment, MdOutlinePayment } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import adminService from "../../../services/adminService";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { fCurrency } from "../../../utils/formatNumber";
import LoadingOverlay from "../../../components/LoadingOverlay";
import Pagination from "../../../components/Pagination";
import Modal from "../../../components/Modal";
import TenantDetails from "../../../components/TenantDetails";

export default function AdminTenants() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tenantToDelete, setTenantToDelete] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 10,
  });
  const [filters, setFilters] = useState({
    search: "",
    property_id: "",
    lease_status: "",
    payment_status: "",
    owner_id: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [properties, setProperties] = useState([]);
  const [owners, setOwners] = useState([]);
  const [stats, setStats] = useState({
    total_tenants: 0,
    active_tenants: 0,
    pending_tenants: 0,
    expired_tenants: 0,
    total_rent_collected: 0,
    total_initial_payments: 0,
  });

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAllTenants({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      });
      console.log("Tenant API response:", res); // Debug log
      setTenants(res.data);
      setPagination(
        res.pagination || {
          current_page: 1,
          total_pages: 1,
          total_items: 0,
          items_per_page: 10,
        }
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch tenants");
    } finally {
      setLoading(false);
    }
  };

  const fetchProperties = async () => {
    try {
      const res = await adminService.getAllProperties({ limit: 1000 });
      console.log("Properties API response:", res); // Debug log
      setProperties(res.data?.properties || res.data || []);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    }
  };

  const fetchOwners = async () => {
    try {
      const res = await adminService.getAllUsers({
        role: "owner",
        limit: 1000,
      });
      console.log("Owners API response:", res); // Debug log
      setOwners(res.data?.users || res.data || []);
    } catch (error) {
      console.error("Failed to fetch owners:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await adminService.getTenantStatistics();
      console.log("Stats API response:", res); // Debug log
      setStats(
        res.data || {
          total_tenants: 0,
          active_tenants: 0,
          pending_tenants: 0,
          expired_tenants: 0,
          total_rent_collected: 0,
          total_initial_payments: 0,
        }
      );
    } catch (error) {
      console.error("Failed to fetch tenant statistics:", error);
    }
  };

  useEffect(() => {
    fetchTenants();
    fetchProperties();
    fetchOwners();
    fetchStats();
  }, [pagination.page, pagination.limit, filters]);

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setPagination({ ...pagination, page: 1 });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTenants();
  };

  const handleViewTenant = (tenant) => {
    setSelectedTenant(tenant);
    setShowDetailsModal(true);
  };

  const handleUpdateTenantStatus = async (id, status) => {
    try {
      await adminService.updateTenantStatus(id, status);
      toast.success(`Tenant status updated to ${status}`);
      fetchTenants();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update tenant status");
    }
  };

  const handleDeleteTenant = async () => {
    if (!tenantToDelete) return;

    try {
      await adminService.deleteTenant(tenantToDelete);
      toast.success("Tenant deleted successfully");
      setShowDeleteModal(false);
      setTenantToDelete(null);
      fetchTenants();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete tenant");
    }
  };

  const openDeleteModal = (id) => {
    setTenantToDelete(id);
    setShowDeleteModal(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: "bg-green-100 text-green-800", label: "Active" },
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      expired: { color: "bg-red-100 text-red-800", label: "Expired" },
      terminated: { color: "bg-gray-100 text-gray-800", label: "Terminated" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      paid: { color: "bg-green-100 text-green-800", label: "Paid" },
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      overdue: { color: "bg-red-100 text-red-800", label: "Overdue" },
      cancelled: { color: "bg-gray-100 text-gray-800", label: "Cancelled" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      property_id: "",
      lease_status: "",
      payment_status: "",
      owner_id: "",
    });
    setPagination({ ...pagination, page: 1 });
  };

  if (loading && tenants.length === 0) {
    return <LoadingOverlay />;
  }

  // Ensure pagination has default values to prevent errors
  const safePagination = {
    current_page: pagination.current_page || 1,
    total_pages: pagination.total_pages || 1,
    total_items: pagination.total_items || 0,
    items_per_page: pagination.items_per_page || 10,
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Tenant Management
          </h1>
          <p className="text-gray-600">
            Manage all rental agreements and tenants
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <FiFilter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 flex-shrink-0">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
              <FiUser className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tenants</p>
              <p className="text-xl font-bold text-gray-900">
                {stats.total_tenants}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
              <MdOutlineAssignment className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-xl font-bold text-gray-900">
                {stats.active_tenants}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-yellow-100 text-yellow-600 mr-3">
              <FiCalendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-xl font-bold text-gray-900">
                {stats.pending_tenants}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-red-100 text-red-600 mr-3">
              <FiCalendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Expired</p>
              <p className="text-xl font-bold text-gray-900">
                {stats.expired_tenants}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-purple-100 text-purple-600 mr-3">
              <MdOutlinePayment className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Rent Collected
              </p>
              <p className="text-lg font-bold text-gray-900">
                {fCurrency(stats.total_rent_collected)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-indigo-100 text-indigo-600 mr-3">
              <FiDollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Initial Payments
              </p>
              <p className="text-lg font-bold text-gray-900">
                {fCurrency(stats.total_initial_payments)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-sm p-6 flex-shrink-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search tenants..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property
              </label>
              <select
                name="property_id"
                value={filters.property_id}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Properties</option>
                {properties.map((property) => (
                  <option key={property._id} value={property._id}>
                    {property.property_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lease Status
              </label>
              <select
                name="lease_status"
                value={filters.lease_status}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Payments</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Owner
              </label>
              <select
                name="owner_id"
                value={filters.owner_id}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Owners</option>
                {owners.map((owner) => (
                  <option key={owner._id} value={owner._id}>
                    {owner.first_name} {owner.last_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={handleSearch}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Search
              </button>
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tenants Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden flex-1 min-h-0">
        <div className="overflow-x-auto h-full">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tenant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lease Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monthly Rent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tenants?.map((tenant) => (
                <tr key={tenant._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {tenant.tenant?.first_name?.charAt(0)}
                            {tenant.tenant?.last_name?.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {tenant.tenant?.first_name} {tenant.tenant?.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {tenant.tenant?.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {tenant.tenant?.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {tenant.property_id?.property_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {tenant.property_id?.location?.city},{" "}
                      {tenant.property_id?.location?.state}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {format(
                        new Date(tenant.lease_start_date),
                        "MMM dd, yyyy"
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      to{" "}
                      {format(new Date(tenant.lease_end_date), "MMM dd, yyyy")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {fCurrency(tenant.monthly_rent)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {fCurrency(tenant.annual_rent)} / year
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(tenant.lease_status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPaymentStatusBadge(tenant.payment_status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewTenant(tenant)}
                        className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                        title="View Details"
                      >
                        View
                      </button>
                      <div className="relative">
                        <button className="text-gray-400 hover:text-gray-600">
                          <BsThreeDotsVertical className="w-4 h-4" />
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                          <div className="py-1">
                            <button
                              onClick={() =>
                                handleUpdateTenantStatus(tenant._id, "active")
                              }
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Mark as Active
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateTenantStatus(tenant._id, "expired")
                              }
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Mark as Expired
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateTenantStatus(
                                  tenant._id,
                                  "terminated"
                                )
                              }
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Terminate Lease
                            </button>
                            <hr className="my-1" />
                            <button
                              onClick={() => openDeleteModal(tenant._id)}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                              Delete Tenant
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {tenants.length === 0 && !loading && (
          <div className="text-center py-12">
            <FiUser className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No tenants found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {Object.values(filters).some((f) => f)
                ? "Try adjusting your filters."
                : "Get started by creating a new tenant."}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {safePagination.total_pages > 1 && (
        <div className="flex-shrink-0">
          <Pagination
            currentPage={safePagination.current_page}
            totalPages={safePagination.total_pages}
            onPageChange={handlePageChange}
            totalItems={safePagination.total_items}
            itemsPerPage={safePagination.items_per_page}
          />
        </div>
      )}

      {/* Tenant Details Modal */}
      {showDetailsModal && selectedTenant && (
        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title="Tenant Details"
          size="lg"
        >
          <TenantDetails tenant={selectedTenant} />
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Tenant"
          size="md"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to delete this tenant? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTenant}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
