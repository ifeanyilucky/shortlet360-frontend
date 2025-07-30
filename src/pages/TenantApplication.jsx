import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { usePaystackPayment } from "react-paystack";
import { BsArrowLeft, BsCheckCircle } from "react-icons/bs";
import { toast } from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { tenantService } from "../services/api";
import { paystackConfig } from "../config/paystack";
import { fCurrency } from "@utils/formatNumber";
import LoadingOverlay from "../components/LoadingOverlay";

const TenantApplication = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [property, setProperty] = useState(null);
  const [paymentPeriod, setPaymentPeriod] = useState("yearly");
  const [monthlyPaymentOption, setMonthlyPaymentOption] = useState("6months");

  // Form state
  const [formData, setFormData] = useState({
    tenant_phone: user?.phone || "",
    tenant_relationship: "self",
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
  });

  // Get property data from location state or fetch it
  useEffect(() => {
    if (location.state?.property) {
      setProperty(location.state.property);
    } else {
      // Fetch property data if not passed through state
      // This would need to be implemented based on your property service
      console.log("Property data not found in state, need to fetch");
    }
  }, [location.state]);

  // Handle renewal state
  const isRenewal = location.state?.isRenewal;
  const currentTenant = location.state?.currentTenant;
  const renewalType = location.state?.renewalType;

  // Calculate static yearly total
  const calculateStaticYearlyTotal = () => {
    if (!property?.pricing?.rent_per_year) return 0;

    const {
      annual_rent,
      agency_fee,
      commission_fee,
      caution_fee,
      legal_fee,
      is_agency_fee_active,
      is_commission_fee_active,
      is_caution_fee_active,
      is_legal_fee_active,
    } = property.pricing.rent_per_year;

    let total = annual_rent;
    if (is_agency_fee_active) total += agency_fee;
    if (is_commission_fee_active) total += commission_fee;
    if (is_caution_fee_active) total += caution_fee;
    if (is_legal_fee_active) total += legal_fee;
    return total;
  };

  // Calculate total rent based on payment period
  const calculateTotalRent = () => {
    if (!property?.pricing?.rent_per_year) return 0;

    if (paymentPeriod === "yearly") {
      return calculateStaticYearlyTotal();
    }

    if (monthlyPaymentOption === "6months") {
      return calculate6MonthsPayment();
    } else if (monthlyPaymentOption === "12months") {
      return calculate12MonthsPayment();
    }

    return 0;
  };

  // Calculate 6 months payment
  const calculate6MonthsPayment = () => {
    if (!property?.pricing?.rent_per_year) return 0;
    const totalAmount = calculateStaticYearlyTotal();
    const monthlyInterest = totalAmount * 0.015;
    return totalAmount / 6 + monthlyInterest;
  };

  // Calculate 12 months payment
  const calculate12MonthsPayment = () => {
    if (!property?.pricing?.rent_per_year) return 0;
    const totalAmount = calculateStaticYearlyTotal();
    const monthlyInterest = totalAmount * 0.02;
    return totalAmount / 12 + monthlyInterest;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle nested object changes
  const handleNestedChange = (objectName, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [objectName]: {
        ...prev[objectName],
        [field]: value,
      },
    }));
  };

  // Validate form
  const validateForm = () => {
    const errors = [];

    if (!formData.tenant_phone) errors.push("Phone number is required");
    if (!formData.tenant_relationship) errors.push("Relationship is required");

    if (!formData.next_of_kin.name) errors.push("Next of kin name is required");
    if (!formData.next_of_kin.phone)
      errors.push("Next of kin phone is required");
    if (!formData.next_of_kin.relationship)
      errors.push("Next of kin relationship is required");
    if (!formData.next_of_kin.address)
      errors.push("Next of kin address is required");

    if (!formData.employment_info.employer_name)
      errors.push("Employer name is required");
    if (!formData.employment_info.job_title)
      errors.push("Job title is required");
    if (!formData.employment_info.monthly_income)
      errors.push("Monthly income is required");
    if (!formData.employment_info.employment_type)
      errors.push("Employment type is required");

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      return false;
    }
    return true;
  };
  console.log("calculateTotalRent", calculateTotalRent());
  // Initialize Paystack payment hook
  const initializePayment = usePaystackPayment();

  // Handle payment success
  const handlePaymentSuccess = async (reference) => {
    try {
      setIsLoading(true);

      // Set default lease dates
      const now = new Date();
      let leaseStartDate, leaseEndDate;

      leaseStartDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      if (paymentPeriod === "yearly") {
        leaseEndDate = new Date(
          leaseStartDate.getFullYear() + 1,
          leaseStartDate.getMonth(),
          leaseStartDate.getDate()
        );
      } else if (paymentPeriod === "6months") {
        leaseEndDate = new Date(
          leaseStartDate.getFullYear(),
          leaseStartDate.getMonth() + 6,
          leaseStartDate.getDate()
        );
      } else if (paymentPeriod === "12months") {
        leaseEndDate = new Date(
          leaseStartDate.getFullYear() + 1,
          leaseStartDate.getMonth(),
          leaseStartDate.getDate()
        );
      }

      // Create tenant data
      const tenantData = {
        property_id: id,
        lease_start_date: leaseStartDate,
        lease_end_date: leaseEndDate,
        tenant_count: 1,
        payment: reference,
        payment_method: "paystack",
        payment_reference: reference.reference,
        ...formData,
      };

      const response = await tenantService.createTenant(tenantData);
      toast.success(
        isRenewal
          ? "Rent renewal completed successfully"
          : "Rental agreement created successfully"
      );
      navigate(`/${id}/tenant-receipt/${response?.data?._id}`);
    } catch (error) {
      console.error("Payment success error:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred while processing your request");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle payment close
  const handlePaymentClose = () => {
    toast.error("Payment was not completed");
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const paymentAmount = calculateTotalRent();

    // Create payment config
    const paymentConfig = {
      ...paystackConfig({
        ...user,
        amount: paymentAmount, // paystackConfig already converts to kobo
      }),
      metadata: {
        custom_fields: [
          {
            display_name: "Customer Name",
            variable_name: "customer_name",
            value: user?.first_name + " " + user?.last_name,
          },
          {
            display_name: "Customer ID",
            variable_name: "customer_id",
            value: user?._id,
          },
          {
            display_name: "Property",
            variable_name: "property_name",
            value: property?.property_name || "",
          },
          {
            display_name: "Application Type",
            variable_name: "application_type",
            value: isRenewal ? "rental_renewal" : "rental",
          },
          {
            display_name: "Payment Period",
            variable_name: "payment_period",
            value: paymentPeriod,
          },
          {
            display_name: "Payment Option",
            variable_name: "payment_option",
            value: paymentPeriod === "yearly" ? "yearly" : monthlyPaymentOption,
          },
        ],
      },
    };

    initializePayment({
      onSuccess: handlePaymentSuccess,
      onClose: handlePaymentClose,
      config: paymentConfig,
    });
  };

  if (isLoading) return <LoadingOverlay />;

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading property information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <BsArrowLeft className="w-5 h-5" />
            Back to Property
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isRenewal ? "Rent Renewal Application" : "Tenant Application"}
          </h1>
          <p className="text-gray-600">
            {isRenewal
              ? `Renew your rental agreement for ${property.property_name}`
              : `Complete your rental application for ${property.property_name}`}
          </p>
          {isRenewal && (
            <div
              className={`mt-3 p-3 rounded-lg ${
                renewalType === "overdue"
                  ? "bg-red-50 border border-red-200"
                  : "bg-orange-50 border border-orange-200"
              }`}
            >
              <p
                className={`text-sm font-medium ${
                  renewalType === "overdue" ? "text-red-800" : "text-orange-800"
                }`}
              >
                {renewalType === "overdue"
                  ? "⚠️ Your rent is overdue. Please complete the renewal process."
                  : "⏰ Your rent is due for renewal. Please proceed with payment."}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Application Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-6">
                Personal Information
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800">
                    Basic Information
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="tenant_phone"
                      value={formData.tenant_phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Relationship to Property *
                    </label>
                    <select
                      name="tenant_relationship"
                      value={formData.tenant_relationship}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="self">Self</option>
                      <option value="spouse">Spouse</option>
                      <option value="family_member">Family Member</option>
                      <option value="friend">Friend</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Next of Kin */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800">
                    Next of Kin
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.next_of_kin.name}
                        onChange={(e) =>
                          handleNestedChange(
                            "next_of_kin",
                            "name",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={formData.next_of_kin.phone}
                        onChange={(e) =>
                          handleNestedChange(
                            "next_of_kin",
                            "phone",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter phone number"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Relationship *
                      </label>
                      <input
                        type="text"
                        value={formData.next_of_kin.relationship}
                        onChange={(e) =>
                          handleNestedChange(
                            "next_of_kin",
                            "relationship",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Father, Mother, Spouse"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        value={formData.next_of_kin.address}
                        onChange={(e) =>
                          handleNestedChange(
                            "next_of_kin",
                            "address",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter full address"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Employment Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800">
                    Employment Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Employer Name *
                      </label>
                      <input
                        type="text"
                        value={formData.employment_info.employer_name}
                        onChange={(e) =>
                          handleNestedChange(
                            "employment_info",
                            "employer_name",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter employer name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Title *
                      </label>
                      <input
                        type="text"
                        value={formData.employment_info.job_title}
                        onChange={(e) =>
                          handleNestedChange(
                            "employment_info",
                            "job_title",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter job title"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monthly Income (₦) *
                      </label>
                      <input
                        type="number"
                        value={formData.employment_info.monthly_income}
                        onChange={(e) =>
                          handleNestedChange(
                            "employment_info",
                            "monthly_income",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter monthly income"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Employment Type *
                      </label>
                      <select
                        value={formData.employment_info.employment_type}
                        onChange={(e) =>
                          handleNestedChange(
                            "employment_info",
                            "employment_type",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
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

                {/* Emergency Contact */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-800">
                    Emergency Contact (Optional)
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={formData.emergency_contact.name}
                        onChange={(e) =>
                          handleNestedChange(
                            "emergency_contact",
                            "name",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.emergency_contact.phone}
                        onChange={(e) =>
                          handleNestedChange(
                            "emergency_contact",
                            "phone",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Relationship
                      </label>
                      <input
                        type="text"
                        value={formData.emergency_contact.relationship}
                        onChange={(e) =>
                          handleNestedChange(
                            "emergency_contact",
                            "relationship",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Friend, Colleague"
                      />
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    name="special_requests"
                    value={formData.special_requests}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Any special requests or additional information..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  Proceed to Payment
                </button>
              </form>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-8">
              <h2 className="text-xl font-semibold mb-6">Payment Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Property:</span>
                  <span className="font-medium">{property.property_name}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{property.location.city}</span>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3">Payment Options</h3>

                  {/* One Year Payment Option */}
                  <div
                    className={`border-2 rounded-lg p-3 cursor-pointer transition-all mb-3 ${
                      paymentPeriod === "yearly"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                    onClick={() => setPaymentPeriod("yearly")}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">One year</p>
                        <p className="text-sm text-gray-600">0% interest</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">
                          {fCurrency(calculateStaticYearlyTotal())}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Six Months Payment Option */}
                  <div
                    className={`border-2 rounded-lg p-3 cursor-pointer transition-all mb-3 ${
                      paymentPeriod === "6months"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                    onClick={() => {
                      setPaymentPeriod("6months");
                      setMonthlyPaymentOption("6months");
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">Six months</p>
                        <p className="text-sm text-gray-600">
                          1.5% monthly interest
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">
                          {fCurrency(calculate6MonthsPayment() * 6)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {fCurrency(calculate6MonthsPayment())}/month
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 12 Months Payment Option */}
                  <div
                    className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                      paymentPeriod === "12months"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                    onClick={() => {
                      setPaymentPeriod("12months");
                      setMonthlyPaymentOption("12months");
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">12 months</p>
                        <p className="text-sm text-gray-600">
                          2% monthly interest
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">
                          {fCurrency(calculate12MonthsPayment() * 12)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {fCurrency(calculate12MonthsPayment())}/month
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total Payment:</span>
                    <span className="text-blue-600">
                      {fCurrency(calculateTotalRent())}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {paymentPeriod === "yearly"
                      ? "One-time payment"
                      : "First month payment"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantApplication;
