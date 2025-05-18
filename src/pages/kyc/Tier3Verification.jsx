import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "../../hooks/useAuth";
import useKycStore from "../../store/kycStore";
import { uploadService } from "../../services/api";
import InteractiveButton from "../../components/InteractiveButton";
import { HiCheckCircle, HiOfficeBuilding, HiCreditCard } from "react-icons/hi";
import toast from "react-hot-toast";

// Form validation schema
const tier3Schema = yup.object().shape({
  // Employment fields
  employer_name: yup.string().required("Employer name is required"),
  position: yup.string().required("Position is required"),
  employment_status: yup.string().required("Employment status is required"),
  work_address: yup.string().required("Work address is required"),
  work_phone: yup.string().required("Work phone is required"),

  // Bank fields
  bank_name: yup.string().required("Bank name is required"),
  account_number: yup
    .string()
    .required("Account number is required")
    .matches(/^\d{10}$/, "Account number must be 10 digits"),
});

export default function Tier3Verification({ kycStatus }) {
  const { user } = useAuth();
  const { submitTier3Verification, isLoading } = useKycStore();
  const [activeSection, setActiveSection] = useState("employment");
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [bankStatement, setBankStatement] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(tier3Schema),
    defaultValues: {
      employer_name: kycStatus?.tier3?.employment?.employer_name || "",
      position: kycStatus?.tier3?.employment?.position || "",
      employment_status: kycStatus?.tier3?.employment?.employment_status || "",
      work_address: kycStatus?.tier3?.employment?.work_address || "",
      work_phone: kycStatus?.tier3?.employment?.work_phone || "",
      bank_name: kycStatus?.tier3?.bank_statement?.bank_name || "",
      account_number: kycStatus?.tier3?.bank_statement?.account_number || "",
    },
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a PDF, JPEG, or PNG file");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should not exceed 5MB");
      return;
    }

    try {
      setUploadingDocument(true);
      const formData = new FormData();
      formData.append("image", file);

      const response = await uploadService.uploadImage(formData);
      setBankStatement(response.data);
      toast.success("Bank statement uploaded successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload bank statement");
    } finally {
      setUploadingDocument(false);
    }
  };

  const onSubmit = async (data) => {
    if (!bankStatement && activeSection === "bank") {
      toast.error("Please upload your bank statement");
      return;
    }

    try {
      const formattedData = {
        employment: {
          employer_name: data.employer_name,
          position: data.position,
          employment_status: data.employment_status,
          work_address: data.work_address,
          work_phone: data.work_phone,
        },
        bank_statement: {
          bank_name: data.bank_name,
          account_number: data.account_number,
          document: bankStatement,
        },
      };

      await submitTier3Verification(formattedData);
    } catch (error) {
      console.error("Error submitting Tier 3 verification:", error);
    }
  };

  const isEmploymentVerified =
    kycStatus?.tier3?.employment?.verification_status === "verified";
  const isBankVerified =
    kycStatus?.tier3?.bank_statement?.verification_status === "verified";
  const isTier3Verified = kycStatus?.tier3?.status === "verified";
  const isTier3Pending = kycStatus?.tier3?.status === "pending";

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Tier 3: Financial Verification
      </h2>
      <p className="text-gray-600 mb-6">
        Complete employment check and credit history check to complete Tier 3
        verification. This is required for monthly rent payment options.
      </p>

      {isTier3Verified ? (
        <div className="bg-green-50 text-green-700 p-4 rounded-md">
          <div className="flex items-center">
            <HiCheckCircle className="w-6 h-6 mr-2" />
            <p className="font-medium">
              Tier 3 verification completed successfully!
            </p>
          </div>
          {kycStatus?.tier3?.completed_at && (
            <p className="mt-1 text-sm">
              Completed on:{" "}
              {new Date(kycStatus.tier3.completed_at).toLocaleDateString()}
            </p>
          )}
        </div>
      ) : isTier3Pending ? (
        <div className="bg-yellow-50 text-yellow-700 p-4 rounded-md mb-6">
          <p className="font-medium">
            Your Tier 3 verification is pending review.
          </p>
          <p className="mt-1 text-sm">
            We'll notify you once the verification is complete. This usually
            takes 2-3 business days.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Tab Navigation */}
          <div className="flex border-b mb-6">
            <button
              type="button"
              className={`py-2 px-4 font-medium ${
                activeSection === "employment"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveSection("employment")}
            >
              <div className="flex items-center">
                <HiOfficeBuilding className="w-5 h-5 mr-2" />
                Employment Check
              </div>
            </button>
            <button
              type="button"
              className={`py-2 px-4 font-medium ${
                activeSection === "bank"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveSection("bank")}
            >
              <div className="flex items-center">
                <HiCreditCard className="w-5 h-5 mr-2" />
                Credit History Check
              </div>
            </button>
          </div>

          {/* Employment Section */}
          {activeSection === "employment" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="employer_name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Employer Name
                  </label>
                  <input
                    id="employer_name"
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.employer_name
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    {...register("employer_name")}
                  />
                  {errors.employer_name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.employer_name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="position"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Position/Title
                  </label>
                  <input
                    id="position"
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.position ? "border-red-500" : "border-gray-300"
                    }`}
                    {...register("position")}
                  />
                  {errors.position && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.position.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="employment_status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Employment Status
                </label>
                <select
                  id="employment_status"
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.employment_status
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  {...register("employment_status")}
                >
                  <option value="">Select employment status</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="self-employed">Self-employed</option>
                  <option value="contract">Contract</option>
                  <option value="freelance">Freelance</option>
                </select>
                {errors.employment_status && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.employment_status.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="work_address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Work Address
                </label>
                <input
                  id="work_address"
                  type="text"
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.work_address ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("work_address")}
                />
                {errors.work_address && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.work_address.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="work_phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Work Phone
                </label>
                <input
                  id="work_phone"
                  type="tel"
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.work_phone ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("work_phone")}
                />
                {errors.work_phone && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.work_phone.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end mt-4">
                <InteractiveButton
                  type="button"
                  onClick={() => setActiveSection("bank")}
                  className="px-4 py-2"
                >
                  Next: Credit History Check
                </InteractiveButton>
              </div>
            </div>
          )}

          {/* Bank Section */}
          {activeSection === "bank" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="bank_name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Primary Bank
                  </label>
                  <input
                    id="bank_name"
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.bank_name ? "border-red-500" : "border-gray-300"
                    }`}
                    {...register("bank_name")}
                  />
                  {errors.bank_name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.bank_name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="account_number"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Account Number
                  </label>
                  <input
                    id="account_number"
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.account_number
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    {...register("account_number")}
                  />
                  {errors.account_number && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.account_number.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Credit History Document (Last 3 months)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="bank-statement"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                      >
                        <span>Upload a file</span>
                        <input
                          id="bank-statement"
                          name="bank-statement"
                          type="file"
                          className="sr-only"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileUpload}
                          disabled={uploadingDocument}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, PNG, JPG up to 5MB
                    </p>
                  </div>
                </div>
                {bankStatement && (
                  <div className="mt-2 flex items-center text-sm text-green-600">
                    <HiCheckCircle className="w-5 h-5 mr-1" />
                    <span>Credit history document uploaded successfully</span>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 p-4 rounded-md mt-4">
                <p className="text-sm text-blue-700">
                  Your credit history document should include bank statements,
                  credit reports, or other financial records for the last 3
                  months. This information will be used to verify your financial
                  stability and creditworthiness.
                </p>
              </div>

              <div className="flex justify-between mt-6">
                <InteractiveButton
                  type="button"
                  onClick={() => setActiveSection("employment")}
                  className="px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300"
                >
                  Back to Employment Check
                </InteractiveButton>

                <InteractiveButton
                  type="submit"
                  isLoading={isLoading}
                  className="px-4 py-2"
                >
                  Submit Verification
                </InteractiveButton>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
