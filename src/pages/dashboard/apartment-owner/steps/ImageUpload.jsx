import { useState, useRef } from "react";
import { FiUpload, FiX } from "react-icons/fi";
import { useFormContext } from "react-hook-form";

export default function ImageUpload() {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const propertyImages = watch("property_images") || [];

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
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const newImages = Array.from(files);
    setValue("property_images", [...propertyImages, ...newImages], {
      shouldValidate: true,
    });
  };

  const removeImage = (index) => {
    setValue(
      "property_images",
      propertyImages.filter((_, i) => i !== index),
      { shouldValidate: true }
    );
  };

  const getImagePreview = (image) => {
    // If it's a File object (new upload)
    if (image instanceof File) return URL.createObjectURL(image);

    // If it's an existing image with preview property
    if (image.preview) {
      // If preview is an object with url property (from backend)
      if (typeof image.preview === "object" && image.preview.url) {
        return image.preview.url;
      }
      // If preview is a string (direct URL)
      if (typeof image.preview === "string") {
        return image.preview;
      }
    }

    // If it's a direct string URL
    if (typeof image === "string") return image;

    // Fallback
    return "https://via.placeholder.com/400x400?text=Image+Not+Found";
  };

  return (
    <div className="space-y-6">
      <div
        className={`border-2 border-dashed rounded-lg p-6 ${
          dragActive ? "border-primary-900 bg-primary-50" : "border-gray-300"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-primary-900 text-white rounded-md hover:bg-primary-900"
            >
              Select Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            or drag and drop your images here
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {propertyImages.map((image, index) => (
          <div key={index} className="relative group aspect-square">
            <img
              src={getImagePreview(image)}
              alt={`Property ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/400x400?text=Image+Not+Found";
              }}
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <FiX className="w-4 h-4" />
            </button>
            {index === 0 && (
              <div className="absolute top-2 left-2 px-2 py-1 bg-primary-900 text-white text-xs rounded">
                Cover Photo
              </div>
            )}
          </div>
        ))}
      </div>

      {propertyImages.length === 0 && (
        <p className="text-center text-gray-500 mt-4">
          No images uploaded yet. Please upload at least one image.
        </p>
      )}

      {errors.property_images && (
        <p className="text-red-500 text-sm text-center mt-2">
          {errors.property_images.message}
        </p>
      )}
    </div>
  );
}
