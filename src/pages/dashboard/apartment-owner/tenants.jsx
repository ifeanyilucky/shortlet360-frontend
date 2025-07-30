import DataTable from "../../../components/DataTable";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useTenantStore from "@store/tenantStore";
import { propertyStore } from "@store/propertyStore";
import {
  FaEye,
  FaFilter,
  FaEdit,
  FaCalendarAlt,
  FaUserEdit,
  FaTrash,
  FaPlus,
  FaFileContract,
  FaMoneyBillWave,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import LoadingOverlay from "../../../components/LoadingOverlay";
import { useAuth } from "../../../hooks/useAuth";
import Pagination from "../../../components/Pagination";
import {
  format,
  addMonths,
  addYears,
  isAfter,
  isBefore,
  differenceInDays,
} from "date-fns";
import { fCurrency } from "@utils/formatNumber";
import RightSidebarModal from "../../../components/RightSidebarModal";
import TenantDetails from "../../../components/TenantDetails";
import { toast } from "react-hot-toast";
import Modal from "../../../components/Modal";

export default function TenantManagement() {
  const {
    tenants,
    tenant,
    pagination,
    getTenants,
    getTenant,
    isLoading,
    updateTenantStatus,
  } = useTenantStore();
  const { getOwnerProperties } = propertyStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [userProperties, setUserProperties] = useState([]);
  const [filters, setFilters] = useState({
    property_name: "",
    tenant_name: "",
    lease_status: "",
    payment_status: "",
  });

  // Modal states
  const [showLeaseModal, setShowLeaseModal] = useState(false);
  const [showTenantModal, setShowTenantModal] = useState(false);
  const [showTerminateModal, setShowTerminateModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);

  // Lease management form
  const [leaseForm, setLeaseForm] = useState({
    lease_start_date: "",
    lease_duration: "12", // months
    lease_end_date: "",
    monthly_rent: "",
    annual_rent: "",
    security_deposit: "",
    auto_renew: false,
    renewal_notice_days: "30",
  });

  // Tenant management form
  const [tenantForm, setTenantForm] = useState({
    tenant_count: 1,
    tenant_phone: "",
    tenant_relationship: "",
    next_of_kin: {
      name: "",
      phone: "",
      relationship: "",
      address: "",
    },
    employment_info: {
      employer_name: "",
      job_title: "",
      monthly_income: "",
      employment_type: "full_time",
    },
    emergency_contact: {
      name: "",
      phone: "",
      relationship: "",
    },
    special_requests: "",
    notes: "",
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProperties = async () => {
      const response = await getOwnerProperties({ owner: user?._id });
      console.log("response", response);
      if (response?.data) {
        setUserProperties(response.data);
        // Get tenants for all user properties
        const propertyIds = response.data.map((prop) => prop._id);
        getTenants({
          page: currentPage,
          property_id: propertyIds.join(","),
        });
      }
    };

    fetchUserProperties();
  }, [user?._id]);

  // Calculate lease end date based on start date and duration
  const calculateLeaseEndDate = (startDate, duration) => {
    if (!startDate || !duration) return "";
    const start = new Date(startDate);
    const end = addMonths(start, parseInt(duration));
    return format(end, "yyyy-MM-dd");
  };

  // Handle lease form changes
  const handleLeaseFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLeaseForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Auto-calculate end date when start date or duration changes
    if (name === "lease_start_date" || name === "lease_duration") {
      const startDate =
        name === "lease_start_date" ? value : leaseForm.lease_start_date;
      const duration =
        name === "lease_duration" ? value : leaseForm.lease_duration;
      const endDate = calculateLeaseEndDate(startDate, duration);
      setLeaseForm((prev) => ({
        ...prev,
        lease_end_date: endDate,
      }));
    }
  };

  // Handle tenant form changes
  const handleTenantFormChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [objectName, field] = name.split(".");
      setTenantForm((prev) => ({
        ...prev,
        [objectName]: {
          ...prev[objectName],
          [field]: value,
        },
      }));
    } else {
      setTenantForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Open lease management modal
  const handleEditLease = (tenant) => {
    setSelectedTenant(tenant);
    setLeaseForm({
      lease_start_date: format(new Date(tenant.lease_start_date), "yyyy-MM-dd"),
      lease_duration: "12",
      lease_end_date: format(new Date(tenant.lease_end_date), "yyyy-MM-dd"),
      monthly_rent: tenant.monthly_rent.toString(),
      annual_rent: tenant.annual_rent.toString(),
      security_deposit: tenant.security_deposit.toString(),
      auto_renew: false,
      renewal_notice_days: "30",
    });
    setShowLeaseModal(true);
  };

  // Open tenant management modal
  const handleEditTenant = (tenant) => {
    setSelectedTenant(tenant);
    setTenantForm({
      tenant_count: tenant.tenant_count || 1,
      tenant_phone: tenant.tenant_phone || "",
      tenant_relationship: tenant.tenant_relationship || "",
      next_of_kin: {
        name: tenant.next_of_kin?.name || "",
        phone: tenant.next_of_kin?.phone || "",
        relationship: tenant.next_of_kin?.relationship || "",
        address: tenant.next_of_kin?.address || "",
      },
      employment_info: {
        employer_name: tenant.employment_info?.employer_name || "",
        job_title: tenant.employment_info?.job_title || "",
        monthly_income:
          tenant.employment_info?.monthly_income?.toString() || "",
        employment_type: tenant.employment_info?.employment_type || "full_time",
      },
      emergency_contact: {
        name: tenant.emergency_contact?.name || "",
        phone: tenant.emergency_contact?.phone || "",
        relationship: tenant.emergency_contact?.relationship || "",
      },
      special_requests: tenant.special_requests || "",
      notes: tenant.notes || "",
    });
    setShowTenantModal(true);
  };

  // Handle lease update
  const handleUpdateLease = async () => {
    try {
      if (!selectedTenant) return;

      const updateData = {
        lease_start_date: leaseForm.lease_start_date,
        lease_end_date: leaseForm.lease_end_date,
        monthly_rent: parseFloat(leaseForm.monthly_rent),
        annual_rent: parseFloat(leaseForm.annual_rent),
        security_deposit: parseFloat(leaseForm.security_deposit),
        auto_renew: leaseForm.auto_renew,
        renewal_notice_days: parseInt(leaseForm.renewal_notice_days),
      };

      await updateTenantStatus(selectedTenant._id, updateData);
      toast.success("Lease information updated successfully");
      setShowLeaseModal(false);

      // Refresh tenant list
      const propertyIds = userProperties.map((prop) => prop._id);
      getTenants({
        page: currentPage,
        property_id: propertyIds.join(","),
        ...filters,
      });
    } catch (error) {
      console.error("Error updating lease:", error);
      toast.error("Failed to update lease information");
    }
  };

  // Handle tenant information update
  const handleUpdateTenant = async () => {
    try {
      if (!selectedTenant) return;

      const updateData = {
        tenant_count: parseInt(tenantForm.tenant_count),
        tenant_phone: tenantForm.tenant_phone,
        tenant_relationship: tenantForm.tenant_relationship,
        next_of_kin: tenantForm.next_of_kin,
        employment_info: {
          ...tenantForm.employment_info,
          monthly_income: parseFloat(tenantForm.employment_info.monthly_income),
        },
        emergency_contact: tenantForm.emergency_contact,
        special_requests: tenantForm.special_requests,
        notes: tenantForm.notes,
      };

      await updateTenantStatus(selectedTenant._id, updateData);
      toast.success("Tenant information updated successfully");
      setShowTenantModal(false);

      // Refresh tenant list
      const propertyIds = userProperties.map((prop) => prop._id);
      getTenants({
        page: currentPage,
        property_id: propertyIds.join(","),
        ...filters,
      });
    } catch (error) {
      console.error("Error updating tenant:", error);
      toast.error("Failed to update tenant information");
    }
  };

  // Handle tenant termination
  const handleTerminateTenant = async () => {
    try {
      if (!selectedTenant) return;

      await updateTenantStatus(selectedTenant._id, {
        lease_status: "terminated",
      });
      toast.success("Tenant lease terminated successfully");
      setShowTerminateModal(false);

      // Refresh tenant list
      const propertyIds = userProperties.map((prop) => prop._id);
      getTenants({
        page: currentPage,
        property_id: propertyIds.join(","),
        ...filters,
      });
    } catch (error) {
      console.error("Error terminating tenant:", error);
      toast.error("Failed to terminate tenant lease");
    }
  };

  // Check if lease is expiring soon
  const isLeaseExpiringSoon = (tenant) => {
    if (!tenant || tenant.lease_status !== "active") return false;
    const today = new Date();
    const endDate = new Date(tenant.lease_end_date);
    const daysUntilExpiry = differenceInDays(endDate, today);
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  // Check if lease is overdue
  const isLeaseOverdue = (tenant) => {
    if (!tenant || tenant.lease_status !== "active") return false;
    const today = new Date();
    const endDate = new Date(tenant.lease_end_date);
    return isAfter(today, endDate);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const propertyIds = userProperties.map((prop) => prop._id);
    getTenants({
      search: searchTerm,
      page: 1,
      property_id: propertyIds.join(","),
      ...filters,
    });
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const propertyIds = userProperties.map((prop) => prop._id);
    getTenants({
      search: searchTerm,
      page,
      property_id: propertyIds.join(","),
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
    const propertyIds = userProperties.map((prop) => prop._id);
    getTenants({
      search: searchTerm,
      page: 1,
      property_id: propertyIds.join(","),
      ...filters,
    });
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      property_name: "",
      tenant_name: "",
      lease_status: "",
      payment_status: "",
    });
    const propertyIds = userProperties.map((prop) => prop._id);
    getTenants({
      search: searchTerm,
      page: 1,
      property_id: propertyIds.join(","),
    });
  };

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
      header: "Tenant",
      key: "tenant",
      render: (_, row) => (
        <div>
          <p className="font-medium">
            {row.tenant.first_name} {row.tenant.last_name}
          </p>
          <p className="text-sm text-gray-600">{row.tenant.email}</p>
          <p className="text-sm text-gray-600">{row.tenant.phone}</p>
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
          {isLeaseExpiringSoon(row) && (
            <div className="mt-1">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                <FaClock className="w-3 h-3 mr-1" />
                Expiring Soon
              </span>
            </div>
          )}
          {isLeaseOverdue(row) && (
            <div className="mt-1">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                <FaExclamationTriangle className="w-3 h-3 mr-1" />
                Overdue
              </span>
            </div>
          )}
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
        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleViewTenant(row._id)}
            className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm font-medium"
          >
            View Details
          </button>
          <button
            onClick={() => handleEditLease(row)}
            className="px-3 py-1 text-green-600 hover:bg-green-50 rounded text-sm font-medium"
          >
            Edit Lease
          </button>
          <button
            onClick={() => handleEditTenant(row)}
            className="px-3 py-1 text-purple-600 hover:bg-purple-50 rounded text-sm font-medium"
          >
            Edit Tenant
          </button>
          {row.lease_status === "active" && (
            <button
              onClick={() => {
                setSelectedTenant(row);
                setShowTerminateModal(true);
              }}
              className="px-3 py-1 text-red-600 hover:bg-red-50 rounded text-sm font-medium"
            >
              Terminate
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      {isLoading && <LoadingOverlay />}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Tenant Management
          </h2>
          <p className="text-gray-600 mt-1">
            Manage your tenants, lease agreements, and rental payments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <FaFileContract className="text-blue-600 w-5 h-5" />
          <FaMoneyBillWave className="text-green-600 w-5 h-5" />
        </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  Tenant Name
                </label>
                <input
                  type="text"
                  name="tenant_name"
                  value={filters.tenant_name}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Filter by tenant name"
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

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <DataTable columns={columns} data={tenants || []} />
      </div>

      {pagination && (
        <div className="mt-6">
          <Pagination
            currentPage={pagination.current_page}
            totalPages={pagination.total_pages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Lease Management Modal */}
      <Modal
        isOpen={showLeaseModal}
        onClose={() => setShowLeaseModal(false)}
        title="Edit Lease Information"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lease Start Date *
              </label>
              <input
                type="date"
                name="lease_start_date"
                value={leaseForm.lease_start_date}
                onChange={handleLeaseFormChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lease Duration (Months) *
              </label>
              <select
                name="lease_duration"
                value={leaseForm.lease_duration}
                onChange={handleLeaseFormChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="6">6 Months</option>
                <option value="12">12 Months</option>
                <option value="18">18 Months</option>
                <option value="24">24 Months</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lease End Date (Auto-calculated)
              </label>
              <input
                type="date"
                name="lease_end_date"
                value={leaseForm.lease_end_date}
                readOnly
                className="w-full px-3 py-2 border rounded-lg bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Rent *
              </label>
              <input
                type="number"
                name="monthly_rent"
                value={leaseForm.monthly_rent}
                onChange={handleLeaseFormChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Rent *
              </label>
              <input
                type="number"
                name="annual_rent"
                value={leaseForm.annual_rent}
                onChange={handleLeaseFormChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Security Deposit *
              </label>
              <input
                type="number"
                name="security_deposit"
                value={leaseForm.security_deposit}
                onChange={handleLeaseFormChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="auto_renew"
                checked={leaseForm.auto_renew}
                onChange={handleLeaseFormChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Auto-renew lease
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Renewal Notice (Days)
              </label>
              <input
                type="number"
                name="renewal_notice_days"
                value={leaseForm.renewal_notice_days}
                onChange={handleLeaseFormChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="30"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowLeaseModal(false)}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateLease}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Update Lease
            </button>
          </div>
        </div>
      </Modal>

      {/* Tenant Management Modal */}
      <Modal
        isOpen={showTenantModal}
        onClose={() => setShowTenantModal(false)}
        title="Edit Tenant Information"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Tenants
              </label>
              <input
                type="number"
                name="tenant_count"
                value={tenantForm.tenant_count}
                onChange={handleTenantFormChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tenant Phone
              </label>
              <input
                type="tel"
                name="tenant_phone"
                value={tenantForm.tenant_phone}
                onChange={handleTenantFormChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-3">
              Next of Kin
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="next_of_kin.name"
                  value={tenantForm.next_of_kin.name}
                  onChange={handleTenantFormChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="next_of_kin.phone"
                  value={tenantForm.next_of_kin.phone}
                  onChange={handleTenantFormChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relationship
                </label>
                <input
                  type="text"
                  name="next_of_kin.relationship"
                  value={tenantForm.next_of_kin.relationship}
                  onChange={handleTenantFormChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="next_of_kin.address"
                  value={tenantForm.next_of_kin.address}
                  onChange={handleTenantFormChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-3">
              Employment Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employer Name
                </label>
                <input
                  type="text"
                  name="employment_info.employer_name"
                  value={tenantForm.employment_info.employer_name}
                  onChange={handleTenantFormChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  name="employment_info.job_title"
                  value={tenantForm.employment_info.job_title}
                  onChange={handleTenantFormChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Income
                </label>
                <input
                  type="number"
                  name="employment_info.monthly_income"
                  value={tenantForm.employment_info.monthly_income}
                  onChange={handleTenantFormChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employment Type
                </label>
                <select
                  name="employment_info.employment_type"
                  value={tenantForm.employment_info.employment_type}
                  onChange={handleTenantFormChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="self_employed">Self Employed</option>
                  <option value="student">Student</option>
                  <option value="unemployed">Unemployed</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-3">
              Emergency Contact
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="emergency_contact.name"
                  value={tenantForm.emergency_contact.name}
                  onChange={handleTenantFormChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="emergency_contact.phone"
                  value={tenantForm.emergency_contact.phone}
                  onChange={handleTenantFormChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relationship
                </label>
                <input
                  type="text"
                  name="emergency_contact.relationship"
                  value={tenantForm.emergency_contact.relationship}
                  onChange={handleTenantFormChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Requests
            </label>
            <textarea
              name="special_requests"
              value={tenantForm.special_requests}
              onChange={handleTenantFormChange}
              rows="3"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any special requests or requirements..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={tenantForm.notes}
              onChange={handleTenantFormChange}
              rows="3"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Private notes about the tenant..."
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowTenantModal(false)}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateTenant}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Update Tenant
            </button>
          </div>
        </div>
      </Modal>

      {/* Terminate Tenant Modal */}
      <Modal
        isOpen={showTerminateModal}
        onClose={() => setShowTerminateModal(false)}
        title="Terminate Tenant Lease"
      >
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <FaExclamationTriangle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Confirm Lease Termination
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    Are you sure you want to terminate the lease for{" "}
                    <strong>
                      {selectedTenant?.tenant?.first_name}{" "}
                      {selectedTenant?.tenant?.last_name}
                    </strong>{" "}
                    at{" "}
                    <strong>
                      {selectedTenant?.property_id?.property_name}
                    </strong>
                    ?
                  </p>
                  <p className="mt-2">
                    This action cannot be undone and will immediately terminate
                    the rental agreement.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowTerminateModal(false)}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleTerminateTenant}
              className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Terminate Lease
            </button>
          </div>
        </div>
      </Modal>

      <RightSidebarModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Tenant Details"
      >
        <TenantDetails tenant={tenant} />
      </RightSidebarModal>
    </div>
  );
}
