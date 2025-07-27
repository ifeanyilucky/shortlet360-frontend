import { format } from "date-fns";
import {
  FiHome,
  FiCalendar,
  FiDollarSign,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";
import { MdOutlineAssignment } from "react-icons/md";
import { fCurrency } from "../utils/formatNumber";

export default function TenantDetails({ tenant }) {
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

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      low: { color: "bg-green-100 text-green-800", label: "Low" },
      medium: { color: "bg-yellow-100 text-yellow-800", label: "Medium" },
      high: { color: "bg-red-100 text-red-800", label: "High" },
      urgent: { color: "bg-purple-100 text-purple-800", label: "Urgent" },
    };

    const config = priorityConfig[priority] || priorityConfig.medium;
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-xl font-bold text-blue-600">
              {tenant.tenant?.first_name?.charAt(0)}
              {tenant.tenant?.last_name?.charAt(0)}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {tenant.tenant?.first_name} {tenant.tenant?.last_name}
            </h2>
            <p className="text-gray-600">{tenant.tenant?.email}</p>
            <p className="text-gray-600">{tenant.tenant?.phone}</p>
          </div>
          <div className="ml-auto">{getStatusBadge(tenant.lease_status)}</div>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        <div className="space-y-6">
          {/* Property Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FiHome className="w-5 h-5 mr-2" />
              Property Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Property Name
                </p>
                <p className="text-gray-900">
                  {tenant.property_id?.property_name}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Location</p>
                <p className="text-gray-900 flex items-center">
                  <FiMapPin className="w-4 h-4 mr-1" />
                  {tenant.property_id?.location?.street_address},{" "}
                  {tenant.property_id?.location?.city},{" "}
                  {tenant.property_id?.location?.state}
                </p>
              </div>
            </div>
          </div>

          {/* Lease Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MdOutlineAssignment className="w-5 h-5 mr-2" />
              Lease Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Lease Start Date
                </p>
                <p className="text-gray-900 flex items-center">
                  <FiCalendar className="w-4 h-4 mr-1" />
                  {format(new Date(tenant.lease_start_date), "MMMM dd, yyyy")}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Lease End Date
                </p>
                <p className="text-gray-900 flex items-center">
                  <FiCalendar className="w-4 h-4 mr-1" />
                  {format(new Date(tenant.lease_end_date), "MMMM dd, yyyy")}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Tenant Count
                </p>
                <p className="text-gray-900">{tenant.tenant_count} person(s)</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Payment Status
                </p>
                <div className="mt-1">
                  {getPaymentStatusBadge(tenant.payment_status)}
                </div>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FiDollarSign className="w-5 h-5 mr-2" />
              Financial Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Monthly Rent
                </p>
                <p className="text-gray-900">
                  {fCurrency(tenant.monthly_rent)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Annual Rent</p>
                <p className="text-gray-900">{fCurrency(tenant.annual_rent)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Security Deposit
                </p>
                <p className="text-gray-900">
                  {fCurrency(tenant.security_deposit)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Initial Payment
                </p>
                <p className="text-gray-900 font-semibold">
                  {fCurrency(tenant.total_initial_payment)}
                </p>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          {tenant.emergency_contact && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FiPhone className="w-5 h-5 mr-2" />
                Emergency Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Name</p>
                  <p className="text-gray-900">
                    {tenant.emergency_contact.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Phone</p>
                  <p className="text-gray-900">
                    {tenant.emergency_contact.phone}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Relationship
                  </p>
                  <p className="text-gray-900">
                    {tenant.emergency_contact.relationship}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Special Requests */}
          {tenant.special_requests && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Special Requests
              </h3>
              <p className="text-gray-900">{tenant.special_requests}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
