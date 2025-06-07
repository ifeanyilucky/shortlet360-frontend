import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminService from "../../../services/adminService";
import { uploadService } from "../../../services/api";
import toast from "react-hot-toast";
import InteractiveButton from "../../../components/InteractiveButton";
import { FiUpload, FiX } from "react-icons/fi";

export default function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [property, setProperty] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [formData, setFormData] = useState({
    property_name: "",
    property_description: "",
    property_type: "",
    property_category: "",
    publication_status: "pending",
    is_active: false,
    location: {
      street_address: "",
      city: "",
      state: "",
      country: "Nigeria",
      zip_code: "",
    },
    amenities: [],
    rules: [],
    max_guests: 1,
    bedrooms: 1,
    bathrooms: 1,
    property_images: [],
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const res = await adminService.getPropertyById(id);
        setProperty(res.data.property);

        // Initialize form data with property details
        const propertyData = res.data.property;
        setFormData({
          property_name: propertyData.property_name || "",
          property_description: propertyData.property_description || "",
          property_type: propertyData.property_type || "",
          property_category: propertyData.property_category || "",
          publication_status: propertyData.publication_status || "pending",
          is_active: propertyData.is_active || false,
          location: {
            street_address: propertyData.location?.street_address || "",
            city: propertyData.location?.city || "",
            state: propertyData.location?.state || "",
            country: propertyData.location?.country || "Nigeria",
            zip_code: propertyData.location?.zip_code || "",
          },
          amenities: propertyData.amenities || [],
          rules: propertyData.rules || [],
          max_guests: propertyData.max_guests || 1,
          bedrooms: propertyData.bedrooms || 1,
          bathrooms: propertyData.bathrooms || 1,
          property_images: propertyData.property_images || [],
        });

        // Set existing images for management
        setExistingImages(propertyData.property_images || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch property details");
        navigate("/admin/properties");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleAmenitiesChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, value],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        amenities: prev.amenities.filter((amenity) => amenity !== value),
      }));
    }
  };

  const handleRulesChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setFormData((prev) => ({
        ...prev,
        rules: [...prev.rules, value],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        rules: prev.rules.filter((rule) => rule !== value),
      }));
    }
  };

  // Image handling functions
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

  const handleFileInputChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const validFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (validFiles.length !== files.length) {
      toast.error("Only image files are allowed");
    }

    setNewImages((prev) => [...prev, ...validFiles]);
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      toast.loading("Updating property...");

      // Handle image uploads
      let finalImages = [...existingImages];

      // Upload new images if any
      if (newImages.length > 0) {
        const imageFormData = new FormData();
        newImages.forEach((image) => {
          imageFormData.append("images", image);
        });

        const response = await uploadService.uploadImages(imageFormData);
        const newImageObjects = response.urls.map((imageObj) => ({
          url: imageObj.url,
          public_id: imageObj.public_id,
          asset_id: imageObj.asset_id,
        }));
        finalImages = [...finalImages, ...newImageObjects];
      }

      // Create final form data with updated images
      const finalFormData = {
        ...formData,
        property_images: finalImages,
      };

      await adminService.updateProperty(id, finalFormData);
      toast.dismiss();
      toast.success("Property updated successfully");
      navigate("/admin/properties");
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error("Failed to update property");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Edit Property</h1>
        <button
          onClick={() => navigate("/admin/properties")}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          Back to Properties
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
              Basic Information
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Name
              </label>
              <input
                type="text"
                name="property_name"
                value={formData.property_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Description
              </label>
              <textarea
                name="property_description"
                value={formData.property_description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Type
              </label>
              <select
                name="property_type"
                value={formData.property_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Type</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="condo">Condo</option>
                <option value="studio">Studio</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="property_category"
                value={formData.property_category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Category</option>
                <option value="shortlet">Shortlet</option>
                <option value="rent">Rent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Publication Status
              </label>
              <select
                name="publication_status"
                value={formData.publication_status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="pending">Pending</option>
                <option value="published">Published</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Only published properties will be visible to users on the
                platform.
              </p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="is_active"
                className="ml-2 block text-sm text-gray-700"
              >
                Active
              </label>
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
              Location
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address
              </label>
              <input
                type="text"
                name="location.street_address"
                value={formData.location.street_address}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                name="location.city"
                value={formData.location.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                name="location.state"
                value={formData.location.state}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Zip Code
              </label>
              <input
                type="text"
                name="location.zip_code"
                value={formData.location.zip_code}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Property Images Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
            Property Images
          </h2>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div>
              <h3 className="text-md font-medium text-gray-600 mb-3">
                Current Images
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {existingImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.url}
                      alt={`Property ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Images */}
          {newImages.length > 0 && (
            <div>
              <h3 className="text-md font-medium text-gray-600 mb-3">
                New Images to Upload
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {newImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`New ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Image Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 ${
              dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Select Images
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileInputChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                or drag and drop your images here
              </p>
              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG, GIF up to 5MB each
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <InteractiveButton
            type="submit"
            isLoading={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Changes
          </InteractiveButton>
        </div>
      </form>
    </div>
  );
}
