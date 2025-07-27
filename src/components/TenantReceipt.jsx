import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { tenantService } from "../services/api";
import LoadingOverlay from "./LoadingOverlay";
import { format } from "date-fns";

export default function TenantReceipt() {
  const { property_id, tenant_id } = useParams();
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(false);

  const getTenant = async () => {
    setLoading(true);
    try {
      const tenantResponse = await tenantService.getTenant(tenant_id);
      setTenant(tenantResponse.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTenant();
  }, [tenant_id]);

  if (loading || !tenant) {
    return <LoadingOverlay />;
  }

  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd MMM yyyy");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-primary-900">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
            <div className="flex items-center space-x-2">
              <img
                src="/logo.png"
                alt="aplet360-logo"
                className="w-32 h-auto"
              />
            </div>
            <div className="text-center sm:text-right">
              <h2 className="text-lg sm:text-xl font-semibold">
                {tenant.property_id.property_name}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                Tenant ID: {tenant._id}
              </p>
              <p className="text-xs sm:text-sm text-green-500">
                Status:{" "}
                {tenant.lease_status.charAt(0).toUpperCase() +
                  tenant.lease_status.slice(1)}
              </p>
            </div>
          </div>
        </div>

        {/* Tenant Information */}
        <div className="p-4 sm:p-6">
          <div className="mb-4 sm:mb-6">
            <h3 className="text-sm sm:text-base font-medium mb-2">
              Dear {tenant.tenant?.first_name} {tenant.tenant?.last_name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Thank you for choosing Aplet360 for your rental needs. Your rental
              agreement has been successfully processed.
            </p>
          </div>

          {/* Rental Details Table */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="text-left">
                  <th className="py-1 sm:py-2">TENANT NAME</th>
                  <th className="py-1 sm:py-2">CONTACT</th>
                  <th className="py-1 sm:py-2">TENANT COUNT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2">
                    {tenant.tenant?.first_name} {tenant.tenant?.last_name}
                  </td>
                  <td className="py-2">
                    {tenant.tenant_phone || tenant.tenant?.phone}
                  </td>
                  <td className="py-2">{tenant.tenant_count}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Property Details */}
          <div className="mb-4 sm:mb-6">
            <h4 className="text-sm sm:text-base font-medium mb-2">
              Property Details
            </h4>
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                <div>
                  <span className="font-medium">Property Name:</span>{" "}
                  {tenant.property_id.property_name}
                </div>
                <div>
                  <span className="font-medium">Location:</span>{" "}
                  {tenant.property_id.location?.city},{" "}
                  {tenant.property_id.location?.state}
                </div>
                <div>
                  <span className="font-medium">Lease Start:</span>{" "}
                  {formatDate(tenant.lease_start_date)}
                </div>
                <div>
                  <span className="font-medium">Lease End:</span>{" "}
                  {formatDate(tenant.lease_end_date)}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="mb-4 sm:mb-6">
            <h4 className="text-sm sm:text-base font-medium mb-2">
              Payment Details
            </h4>
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span>Annual Rent:</span>
                  <span>{formatCurrency(tenant.annual_rent)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Rent:</span>
                  <span>{formatCurrency(tenant.monthly_rent)}</span>
                </div>
                {tenant.security_deposit > 0 && (
                  <div className="flex justify-between">
                    <span>Security Deposit:</span>
                    <span>{formatCurrency(tenant.security_deposit)}</span>
                  </div>
                )}
                {tenant.agency_fee > 0 && (
                  <div className="flex justify-between">
                    <span>Agency Fee:</span>
                    <span>{formatCurrency(tenant.agency_fee)}</span>
                  </div>
                )}
                {tenant.commission_fee > 0 && (
                  <div className="flex justify-between">
                    <span>Commission Fee:</span>
                    <span>{formatCurrency(tenant.commission_fee)}</span>
                  </div>
                )}
                {tenant.legal_fee > 0 && (
                  <div className="flex justify-between">
                    <span>Legal Fee:</span>
                    <span>{formatCurrency(tenant.legal_fee)}</span>
                  </div>
                )}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-medium">
                    <span>Total Payment:</span>
                    <span>{formatCurrency(tenant.total_initial_payment)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="mb-4 sm:mb-6">
            <h4 className="text-sm sm:text-base font-medium mb-2">
              Payment Information
            </h4>
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                <div>
                  <span className="font-medium">Payment Method:</span>{" "}
                  {tenant.payment_method}
                </div>
                <div>
                  <span className="font-medium">Payment Reference:</span>{" "}
                  {tenant.payment_reference}
                </div>
                <div>
                  <span className="font-medium">Payment Status:</span>{" "}
                  <span
                    className={`font-medium ${
                      tenant.payment_status === "paid"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {tenant.payment_status.charAt(0).toUpperCase() +
                      tenant.payment_status.slice(1)}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Payment Date:</span>{" "}
                  {formatDate(tenant.createdAt)}
                </div>
              </div>
            </div>
          </div>

          {/* Next of Kin Information */}
          {tenant.next_of_kin && (
            <div className="mb-4 sm:mb-6">
              <h4 className="text-sm sm:text-base font-medium mb-2">
                Next of Kin
              </h4>
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                  <div>
                    <span className="font-medium">Name:</span>{" "}
                    {tenant.next_of_kin.name}
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span>{" "}
                    {tenant.next_of_kin.phone}
                  </div>
                  <div>
                    <span className="font-medium">Relationship:</span>{" "}
                    {tenant.next_of_kin.relationship}
                  </div>
                  <div>
                    <span className="font-medium">Address:</span>{" "}
                    {tenant.next_of_kin.address}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Employment Information */}
          {tenant.employment_info && (
            <div className="mb-4 sm:mb-6">
              <h4 className="text-sm sm:text-base font-medium mb-2">
                Employment Information
              </h4>
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                  <div>
                    <span className="font-medium">Employer:</span>{" "}
                    {tenant.employment_info.employer_name}
                  </div>
                  <div>
                    <span className="font-medium">Job Title:</span>{" "}
                    {tenant.employment_info.job_title}
                  </div>
                  <div>
                    <span className="font-medium">Monthly Income:</span>{" "}
                    {formatCurrency(tenant.employment_info.monthly_income)}
                  </div>
                  <div>
                    <span className="font-medium">Employment Type:</span>{" "}
                    {tenant.employment_info.employment_type.replace("_", " ")}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-xs sm:text-sm text-gray-600">
            <p>Thank you for choosing Aplet360!</p>
            <p>For any questions, please contact our support team.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
