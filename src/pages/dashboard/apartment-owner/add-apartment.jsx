import { useState, useEffect } from "react";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { useForm, FormProvider } from "react-hook-form";
import BasicInfo from "./steps/BasicInfo";
import AmenitiesRules from "./steps/AmenitiesRules";
import PricingAvailability from "./steps/PricingAvailability";
import ImageUpload from "./steps/ImageUpload";
import ReviewStep from "./steps/ReviewStep";
import { propertyStore } from "@store/propertyStore";
import toast from "react-hot-toast";
import InteractiveButton from "@components/InteractiveButton";
import { useNavigate } from "react-router-dom";
import { uploadService } from "@services/api";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import KycVerificationStatus from "@components/KycVerificationStatus";
import { useAuth } from "../../../hooks/useAuth";

export default function AddApartment() {
  const [current, setCurrent] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [kycVerified, setKycVerified] = useState(false);
  const { user } = useAuth();

  const validationSchema = yup.object().shape({
    // Basic Info validations
    property_name: yup.string().required("Property name is required"),
    property_description: yup
      .string()
      .required("Property description is required"),
    property_type: yup.string().required("Property type is required"),
    property_category: yup.string().required("Property category is required"),
    bedroom_count: yup.number().min(1, "Must have at least 1 bedroom"),
    bathroom_count: yup.number().min(1, "Must have at least 1 bathroom"),
    max_guests: yup.number().min(1, "Must accommodate at least 1 guest"),
    location: yup.object().shape({
      street_address: yup.string().required("Street address is required"),
      city: yup.string().required("City is required"),
      state: yup.string().required("State is required"),
      country: yup.string().required("Country is required"),
    }),
    // Amenities & Rules validations
    amenities: yup.array(),
    house_rules: yup.array(),
    // Pricing validations
    pricing: yup.object().shape({
      per_day: yup.object(),
      per_week: yup.object(),
      per_month: yup.object(),
      rent_per_year: yup.object(),
    }),
    // Media validation - only validate on the last step
    property_images: yup.array().when("$isLastStep", (isLastStep, schema) => {
      return isLastStep
        ? schema
            .min(1, "Please upload at least one image")
            .required("Property images are required")
        : schema;
    }),
    property_videos: yup.array().max(5, "Maximum 5 videos allowed"),
  });

  const methods = useForm({
    defaultValues: {
      property_name: "",
      property_description: "",
      property_type: "",
      property_category: "shortlet",
      bedroom_count: 1,
      bathroom_count: 1,
      max_guests: 1,
      location: {
        street_address: "",
        city: "",
        state: "",
        country: "",
        coordinates: { latitude: null, longitude: null },
      },
      amenities: [],
      house_rules: [],
      pricing: {
        per_day: {
          base_price: 0,
          cleaning_fee: 0,
          security_deposit: 0,
          is_active: false,
        },
        per_week: {
          base_price: 0,
          cleaning_fee: 0,
          security_deposit: 0,
          is_active: false,
        },
        per_month: {
          base_price: 0,
          cleaning_fee: 0,
          security_deposit: 0,
          is_active: false,
        },
        rent_per_year: {
          annual_rent: 0,
          agency_fee: 0,
          commission_fee: 0,
          caution_fee: 0,
          legal_fee: 0,
          is_agency_fee_active: true,
          is_commission_fee_active: true,
          is_caution_fee_active: true,
          is_legal_fee_active: true,
          is_active: true,
        },
      },
      unavailable_dates: [],
      property_images: [],
      property_videos: [],
    },
    resolver: yupResolver(validationSchema),
    context: { isLastStep: current === 3 },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  // Watch for property category changes and update pricing structure
  const propertyCategory = methods.watch("property_category");

  useEffect(() => {
    if (propertyCategory === "rent") {
      // Reset to rental pricing structure
      methods.setValue("pricing", {
        per_day: { is_active: false },
        per_week: { is_active: false },
        per_month: { is_active: false },
        rent_per_year: {
          annual_rent: 0,
          agency_fee: 0,
          commission_fee: 0,
          caution_fee: 0,
          legal_fee: 0,
          is_agency_fee_active: true,
          is_commission_fee_active: true,
          is_caution_fee_active: true,
          is_legal_fee_active: true,
          is_active: true,
        },
      });
    } else if (propertyCategory === "office") {
      // Reset to office pricing structure (similar to rent but with monthly options)
      methods.setValue("pricing", {
        per_day: { is_active: false },
        per_week: { is_active: false },
        per_month: {
          base_price: 0,
          cleaning_fee: 0,
          security_deposit: 0,
          is_active: true,
        },
        rent_per_year: {
          annual_rent: 0,
          agency_fee: 0,
          commission_fee: 0,
          caution_fee: 0,
          legal_fee: 0,
          is_agency_fee_active: true,
          is_commission_fee_active: true,
          is_caution_fee_active: true,
          is_legal_fee_active: true,
          is_active: true,
        },
      });
    } else {
      // Reset to shortlet pricing structure
      methods.setValue("pricing", {
        per_day: {
          base_price: 0,
          cleaning_fee: 0,
          security_deposit: 0,
          is_active: false,
        },
        per_week: {
          base_price: 0,
          cleaning_fee: 0,
          security_deposit: 0,
          is_active: false,
        },
        per_month: {
          base_price: 0,
          cleaning_fee: 0,
          security_deposit: 0,
          is_active: false,
        },
        rent_per_year: {
          base_price: 0,
          cleaning_fee: 0,
          security_deposit: 0,
          is_active: false,
        },
      });
    }
  }, [propertyCategory]);

  const steps = [
    {
      title: "Basic Info",
      content: <BasicInfo />,
    },
    {
      title: "Amenities & Rules",
      content: <AmenitiesRules />,
    },
    {
      title: "Pricing",
      content: <PricingAvailability />,
    },
    {
      title: "Media",
      content: <ImageUpload />,
    },
    {
      title: "Review",
      content: <ReviewStep formData={methods.getValues()} />,
    },
  ];

  const getStepFields = (stepIndex) => {
    switch (stepIndex) {
      case 0: // Basic Info
        return [
          "property_name",
          "property_description",
          "property_type",
          "property_category",
          "bedroom_count",
          "bathroom_count",
          "max_guests",
          "location.street_address",
          "location.city",
          "location.state",
          "location.country",
        ];
      case 1: // Amenities & Rules
        return ["amenities", "house_rules"];
      case 2: // Pricing
        return ["pricing"];
      case 3: // Images & Videos
        return ["property_images", "property_videos"];
      default:
        return [];
    }
  };

  const next = async () => {
    const fields = getStepFields(current);
    const isValid = await methods.trigger(fields);

    // if (isValid) {
    setCurrent(current + 1);
    // } else {
    //   // Optionally show an error message
    //   toast.error("Please fill in all required fields correctly");
    // }
  };

  const prev = () => setCurrent(current - 1);

  const { addProperty } = propertyStore();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setSubmitLoading(true);
    try {
      toast.loading("Uploading media files...");

      let uploadedImageUrls = [];
      let uploadedVideoUrls = [];

      // Upload images if any
      if (data.property_images && data.property_images.length > 0) {
        const imageFormData = new FormData();
        data.property_images.forEach((image) => {
          imageFormData.append("images", image);
        });

        const imageResponse = await uploadService.uploadImages(imageFormData);
        uploadedImageUrls = imageResponse.urls || [];
      }

      // Upload videos if any
      if (data.property_videos && data.property_videos.length > 0) {
        const videoFormData = new FormData();
        data.property_videos.forEach((video) => {
          videoFormData.append("videos", video);
        });

        const videoResponse = await uploadService.uploadVideos(videoFormData);
        uploadedVideoUrls = videoResponse.urls || [];
      }

      // Create final form data
      const finalFormData = {
        ...data,
        property_images: uploadedImageUrls,
        property_videos: uploadedVideoUrls,
      };

      await addProperty(finalFormData);
      toast.dismiss();
      toast.success(
        "Property added successfully! It will be reviewed by our team before being published."
      );
      navigate("/owner/apartments");
    } catch (error) {
      toast.dismiss();
      console.error(error);
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong during upload");
      }
      console.log(error);
    } finally {
      setSubmitLoading(false);
    }
  };
  console.log(methods.formState.errors);
  return (
    <div className="max-w-5xl p-5">
      <h1 className="text-2xl font-semibold mb-6">Add New Apartment</h1>

      {/* Admin Review Notice */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Important:</strong> All new properties require admin
              approval before being published on the platform. Our team will
              review your listing within 24-48 hours.
            </p>
          </div>
        </div>
      </div>

      {/* KYC Verification Check */}
      {!kycVerified && (
        <div className="mb-6">
          <KycVerificationStatus
            requiredTier="tier1"
            actionText="Continue to Add Apartment"
            onVerified={() => setKycVerified(true)}
          />
        </div>
      )}

      {kycVerified && (
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="bg-white rounded-lg"
          >
            {/* Steps indicator */}
            <div className="relative flex justify-between mb-12">
              {/* Progress Line */}
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-200 -translate-y-1/2">
                <div
                  className="h-full bg-primary-900 transition-all duration-300"
                  style={{ width: `${(current / (steps.length - 1)) * 100}%` }}
                />
              </div>

              {/* Steps */}
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="relative flex flex-col items-center"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center z-10
                                    ${
                                      index < current
                                        ? "bg-primary-900 text-white border-2 border-primary-900"
                                        : index === current
                                        ? "bg-white text-primary-900 border-2 border-primary-900"
                                        : "bg-white text-gray-500 border-2 border-gray-200"
                                    }`}
                  >
                    {index < current ? (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <span
                    className={`absolute -bottom-6 text-sm whitespace-nowrap
                                ${
                                  index <= current
                                    ? "text-primary-900 font-medium"
                                    : "text-gray-500"
                                }`}
                  >
                    {step.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Content */}
            <div className="min-h-[400px] p-4">{steps[current].content}</div>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              {current > 0 && (
                <button
                  type="button"
                  onClick={prev}
                  className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  <FiChevronLeft className="mr-2" />
                  Previous
                </button>
              )}
              {current < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={next}
                  className="flex items-center px-4 py-2 bg-primary-900 text-white rounded-md hover:bg-primary-900 ml-auto"
                >
                  Next
                  <FiChevronRight className="ml-2" />
                </button>
              ) : (
                <InteractiveButton
                  type="submit"
                  disabled={submitLoading}
                  isLoading={submitLoading}
                  className="flex items-center px-4 py-2 text-white rounded-md ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitLoading ? "Submitting..." : "Submit"}
                </InteractiveButton>
              )}
            </div>
          </form>
        </FormProvider>
      )}
    </div>
  );
}
