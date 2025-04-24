import { useState, useEffect } from "react";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
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
  const [formData, setFormData] = useState({
    property_name: "",
    property_description: "",
    property_type: "",
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
    },
    available_dates: [],
    property_images: [],
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const steps = [
    {
      title: "Basic Info",
      content: <BasicInfo formData={formData} setFormData={setFormData} />,
    },
    {
      title: "Amenities & Rules",
      content: <AmenitiesRules formData={formData} setFormData={setFormData} />,
    },
    {
      title: "Pricing",
      content: (
        <PricingAvailability formData={formData} setFormData={setFormData} />
      ),
    },
    {
      title: "Images",
      content: <ImageUpload formData={formData} setFormData={setFormData} />,
    },
    {
      title: "Review",
      content: <ReviewStep formData={formData} />,
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
          setFormData({
            ...property,
            property_images: property.property_images.map((url) => ({
              preview: url,
              isExisting: true,
            })),
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
  }, [id]);

  const handleSubmit = async () => {
    setSubmitLoading(true);
    try {
      toast.loading("Updating property...");

      // Handle image uploads
      let finalImageUrls = formData.property_images
        .filter((img) => img.isExisting)
        .map((img) => img.preview);

      const newImages = formData.property_images.filter(
        (img) => !img.isExisting
      );
      if (newImages.length > 0) {
        const imageFormData = new FormData();
        newImages.forEach((image) => {
          imageFormData.append("images", image);
        });

        const response = await uploadService.uploadImages(imageFormData);
        finalImageUrls = [...finalImageUrls, ...response.urls];
      }

      // Create the final form data with all image URLs
      const finalFormData = {
        ...formData,
        property_images: finalImageUrls,
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl p-5">
      <div className="bg-white rounded-lg">
        {/* Steps indicator */}
        <div className="relative flex justify-between mb-12">
          {/* Progress Line */}
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-200 -translate-y-1/2">
            <div
              className="h-full bg-primary-500 transition-all duration-300"
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
                                        ? "bg-primary-500 text-white border-2 border-primary-500"
                                        : index === current
                                        ? "bg-white text-primary-500 border-2 border-primary-500"
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
                                    ? "text-primary-500 font-medium"
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
              onClick={prev}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              <FiChevronLeft className="mr-2" />
              Previous
            </button>
          )}
          {current < steps.length - 1 ? (
            <button
              onClick={next}
              className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 ml-auto"
            >
              Next
              <FiChevronRight className="ml-2" />
            </button>
          ) : (
            <InteractiveButton
              onClick={handleSubmit}
              disabled={submitLoading}
              isLoading={submitLoading}
              className="flex items-center px-4 py-2 text-white rounded-md ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitLoading ? "Updating..." : "Update Property"}
            </InteractiveButton>
          )}
        </div>
      </div>
    </div>
  );
}
