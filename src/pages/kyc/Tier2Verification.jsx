import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import PropTypes from "prop-types";
import useKycStore from "../../store/kycStore";
import InteractiveButton from "../../components/InteractiveButton";
import { HiCheckCircle, HiDocumentText, HiUpload, HiX } from "react-icons/hi";

// Form validation schema
const tier2Schema = yup.object().shape({
  document_type: yup.string().required("Document type is required"),
  utility_bill: yup
    .mixed()
    .required("Utility bill document is required")
    .test("fileSize", "File size must be less than 5MB", (value) => {
      return !value || (value && value.size <= 5 * 1024 * 1024);
    })
    .test(
      "fileType",
      "Only PDF, JPG, JPEG, and PNG files are allowed",
      (value) => {
        return (
          !value ||
          (value &&
            [
              "application/pdf",
              "image/jpeg",
              "image/jpg",
              "image/png",
            ].includes(value.type))
        );
      }
    ),
});

export default function Tier2Verification({ kycStatus }) {
  const { submitTier2Verification, isLoading } = useKycStore();
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(tier2Schema),
    defaultValues: {
      document_type: kycStatus?.tier2?.utility_bill?.document_type || "",
    },
  });

  const watchedFile = watch("utility_bill");

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setValue("utility_bill", file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setValue("utility_bill", null);
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("document_type", data.document_type);
      formData.append("utility_bill", data.utility_bill);

      await submitTier2Verification(formData);
    } catch (error) {
      console.error("Error submitting Tier 2 verification:", error);
    }
  };

  const isTier2Verified = kycStatus?.tier2?.status === "verified";
  const isTier2Pending = kycStatus?.tier2?.status === "pending";
  const isTier2Rejected = kycStatus?.tier2?.status === "rejected";

  const documentTypes = [
    { value: "electricity", label: "Electricity Bill" },
    { value: "water", label: "Water Bill" },
    { value: "gas", label: "Gas Bill" },
    { value: "internet", label: "Internet Bill" },
    { value: "cable_tv", label: "Cable TV Bill" },
    { value: "phone", label: "Phone Bill" },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Tier 2: Utility Bill Verification
      </h2>
      <p className="text-gray-600 mb-6">
        Upload a recent utility bill to verify your address. This will be
        reviewed by our admin team.
      </p>

      {isTier2Verified ? (
        <div className="bg-green-50 text-green-700 p-4 rounded-md">
          <div className="flex items-center">
            <HiCheckCircle className="w-6 h-6 mr-2" />
            <p className="font-medium">
              Tier 2 verification completed successfully!
            </p>
          </div>
          {kycStatus?.tier2?.completed_at && (
            <p className="mt-1 text-sm">
              Completed on:{" "}
              {new Date(kycStatus.tier2.completed_at).toLocaleDateString()}
            </p>
          )}
          {kycStatus?.tier2?.utility_bill?.document_type && (
            <p className="mt-1 text-sm">
              Document Type:{" "}
              {
                documentTypes.find(
                  (type) =>
                    type.value === kycStatus.tier2.utility_bill.document_type
                )?.label
              }
            </p>
          )}
        </div>
      ) : isTier2Pending ? (
        <div className="bg-yellow-50 text-yellow-700 p-4 rounded-md mb-6">
          <p className="font-medium">
            Your Tier 2 verification is pending review.
          </p>
          <p className="mt-1 text-sm">
            We&apos;ll notify you once the verification is complete. This
            usually takes 24-48 hours.
          </p>
          {kycStatus?.tier2?.utility_bill?.document_type && (
            <p className="mt-1 text-sm">
              Submitted Document:{" "}
              {
                documentTypes.find(
                  (type) =>
                    type.value === kycStatus.tier2.utility_bill.document_type
                )?.label
              }
            </p>
          )}
        </div>
      ) : isTier2Rejected ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          <p className="font-medium">Your Tier 2 verification was rejected.</p>
          {kycStatus?.tier2?.utility_bill?.admin_notes && (
            <p className="mt-1 text-sm">
              Admin Notes: {kycStatus.tier2.utility_bill.admin_notes}
            </p>
          )}
          <p className="mt-1 text-sm">
            Please upload a new utility bill with the correct information.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            {/* Document Type Selection */}
            <div>
              <label
                htmlFor="document_type"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Document Type
              </label>
              <select
                id="document_type"
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.document_type ? "border-red-500" : "border-gray-300"
                }`}
                {...register("document_type")}
              >
                <option value="">Select document type</option>
                {documentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.document_type && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.document_type.message}
                </p>
              )}
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Utility Bill
              </label>

              {!selectedFile ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    dragActive
                      ? "border-blue-400 bg-blue-50"
                      : errors.utility_bill
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() =>
                    document.getElementById("utility_bill").click()
                  }
                >
                  <HiUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">Click to upload</span> or drag
                    and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, JPG, JPEG, PNG up to 5MB
                  </p>
                </div>
              ) : (
                <div className="border border-gray-300 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <HiDocumentText className="h-8 w-8 text-blue-500" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-red-500 hover:text-red-700"
                    >
                      <HiX className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}

              <input
                id="utility_bill"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={handleFileChange}
              />

              {errors.utility_bill && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.utility_bill.message}
                </p>
              )}
            </div>

            {/* Requirements */}
            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                Document Requirements:
              </h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Document must be recent (within the last 3 months)</li>
                <li>• Your name and address must be clearly visible</li>
                <li>• Document must be in PDF, JPG, JPEG, or PNG format</li>
                <li>• File size must be less than 5MB</li>
                <li>• Document must be legible and not blurry</li>
              </ul>
            </div>

            <div className="flex justify-end">
              <InteractiveButton
                type="submit"
                isLoading={isLoading}
                disabled={!selectedFile}
                className="px-6 py-2"
              >
                Submit for Review
              </InteractiveButton>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

// PropTypes validation
Tier2Verification.propTypes = {
  kycStatus: PropTypes.shape({
    tier2: PropTypes.shape({
      status: PropTypes.string,
      completed_at: PropTypes.string,
      utility_bill: PropTypes.shape({
        document_type: PropTypes.string,
        verification_status: PropTypes.string,
        admin_notes: PropTypes.string,
        uploaded_at: PropTypes.string,
      }),
    }),
  }),
};

// Default props
Tier2Verification.defaultProps = {
  kycStatus: {
    tier2: {
      status: "",
      utility_bill: {
        document_type: "",
        verification_status: "",
      },
    },
  },
};
