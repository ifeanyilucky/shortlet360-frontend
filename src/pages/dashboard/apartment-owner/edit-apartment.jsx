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
import { useNavigate, useParams } from "react-router-dom";
import { uploadService } from "@services/api";

export default function EditApartment() {
  const { id } = useParams();
  const [current, setCurrent] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
          is_active: false,
        },
      },
      unavailable_dates: [],
      property_images: [],
      property_videos: [],
    },
    mode: "onChange",
  });

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

  const next = () => setCurrent(current + 1);
  const prev = () => setCurrent(current - 1);

  const { updateProperty, getPropertyById } = propertyStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const property = await getPropertyById(id);
        if (property) {
          // Reset form with property data
          methods.reset({
            ...property,
            property_images:
              property.property_images?.map((image) => ({
                preview: {
                  url: image.url || "",
                  public_id: image.public_id || "",
                  asset_id: image.asset_id || "",
                  _id: image._id || undefined,
                },
                isExisting: true,
              })) || [],
            property_videos:
              property.property_videos?.map((video) => ({
                preview: {
                  url: video.url || "",
                  public_id: video.public_id || "",
                  asset_id: video.asset_id || "",
                  _id: video._id || undefined,
                },
                isExisting: true,
              })) || [],
          });
        }
      } catch (error) {
        toast.error("Failed to fetch property details");
        navigate("/owner/apartments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [id, methods, navigate, getPropertyById]);

  const handleSubmit = async (data) => {
    setSubmitLoading(true);
    try {
      toast.loading("Updating property...");

      // Handle existing images
      let finalImages = data.property_images
        .filter((img) => img.isExisting)
        .map((img) => {
          // If it's already in the correct format with url, public_id, etc.
          if (typeof img.preview === "object" && img.preview.url) {
            return {
              url: img.preview.url,
              public_id: img.preview.public_id || "",
              asset_id: img.preview.asset_id || "",
              _id: img.preview._id || undefined,
            };
          }
          // If it's just a URL string, create the proper structure
          return {
            url: typeof img.preview === "string" ? img.preview : "",
            public_id: "",
            asset_id: "",
          };
        });

      // Handle existing videos
      let finalVideos = data.property_videos
        .filter((vid) => vid.isExisting)
        .map((vid) => {
          // If it's already in the correct format with url, public_id, etc.
          if (typeof vid.preview === "object" && vid.preview.url) {
            return {
              url: vid.preview.url,
              public_id: vid.preview.public_id || "",
              asset_id: vid.preview.asset_id || "",
              _id: vid.preview._id || undefined,
            };
          }
          // If it's just a URL string, create the proper structure
          return {
            url: typeof vid.preview === "string" ? vid.preview : "",
            public_id: "",
            asset_id: "",
          };
        });

      // Handle new images
      const newImages = data.property_images.filter((img) => !img.isExisting);
      if (newImages.length > 0) {
        const imageFormData = new FormData();
        newImages.forEach((image) => {
          imageFormData.append("images", image);
        });

        const response = await uploadService.uploadImages(imageFormData);
        // Add new images with proper structure
        const newImageObjects = response.urls.map((url) => ({
          url,
          public_id: "",
          asset_id: "",
        }));
        finalImages = [...finalImages, ...newImageObjects];
      }

      // Handle new videos
      const newVideos = data.property_videos.filter((vid) => !vid.isExisting);
      if (newVideos.length > 0) {
        const videoFormData = new FormData();
        newVideos.forEach((video) => {
          videoFormData.append("videos", video);
        });

        const response = await uploadService.uploadVideos(videoFormData);
        // Add new videos with proper structure
        const newVideoObjects = response.urls.map((url) => ({
          url,
          public_id: "",
          asset_id: "",
        }));
        finalVideos = [...finalVideos, ...newVideoObjects];
      }

      // Create the final form data with properly structured media
      const finalFormData = {
        ...data,
        property_images: finalImages,
        property_videos: finalVideos,
      };

      // Submit to API
      await updateProperty(id, finalFormData);
      toast.dismiss();
      toast.success("Property updated successfully!");
      navigate("/owner/apartments");
    } catch (error) {
      toast.dismiss();
      console.error(error);
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong during update");
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl p-5">
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(handleSubmit)}
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
              <div key={index} className="relative flex flex-col items-center">
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
                {submitLoading ? "Updating..." : "Update Property"}
              </InteractiveButton>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
