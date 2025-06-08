import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminService from "../../../services/adminService";
import { uploadService } from "../../../services/api";
import toast from "react-hot-toast";
import InteractiveButton from "../../../components/InteractiveButton";
import { FiUpload, FiX, FiPlay, FiImage, FiVideo } from "react-icons/fi";
import { HiPhotograph, HiVideoCamera } from "react-icons/hi";

export default function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [property, setProperty] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'images', 'videos'
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [existingVideos, setExistingVideos] = useState([]);
  const [newVideos, setNewVideos] = useState([]);
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
    property_videos: [],
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
          property_videos: propertyData.property_videos || [],
        });

        // Set existing media for management
        setExistingImages(propertyData.property_images || []);
        setExistingVideos(propertyData.property_videos || []);
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

  const validateFile = (file) => {
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      toast.error("Please select only image or video files");
      return false;
    }

    // Check file size limits
    const fileSizeInMB = file.size / (1024 * 1024);
    if (isImage && fileSizeInMB > 5) {
      toast.error("Image files must be less than 5MB");
      return false;
    }
    if (isVideo && fileSizeInMB > 100) {
      toast.error("Video files must be less than 100MB");
      return false;
    }

    return true;
  };

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(validateFile);

    if (validFiles.length === 0) return;

    // Separate images and videos
    const newImageFiles = validFiles.filter((file) =>
      file.type.startsWith("image/")
    );
    const newVideoFiles = validFiles.filter((file) =>
      file.type.startsWith("video/")
    );

    // Check limits
    if (existingImages.length + newImages.length + newImageFiles.length > 20) {
      toast.error("Maximum 20 images allowed");
      return;
    }
    if (existingVideos.length + newVideos.length + newVideoFiles.length > 5) {
      toast.error("Maximum 5 videos allowed");
      return;
    }

    // Update state
    if (newImageFiles.length > 0) {
      setNewImages((prev) => [...prev, ...newImageFiles]);
    }
    if (newVideoFiles.length > 0) {
      setNewVideos((prev) => [...prev, ...newVideoFiles]);
    }

    if (validFiles.length > 0) {
      toast.success(
        `Added ${newImageFiles.length} image(s) and ${newVideoFiles.length} video(s)`
      );
    }
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingVideo = (index) => {
    setExistingVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewVideo = (index) => {
    setNewVideos((prev) => prev.filter((_, i) => i !== index));
  };

  // Format file size helper
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      toast.loading("Updating property...");

      // Handle image uploads
      let finalImages = [...existingImages];
      let finalVideos = [...existingVideos];

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

      // Upload new videos if any
      if (newVideos.length > 0) {
        const videoFormData = new FormData();
        newVideos.forEach((video) => {
          videoFormData.append("videos", video);
        });

        const response = await uploadService.uploadVideos(videoFormData);
        const newVideoObjects = response.urls.map((videoObj) => ({
          url: videoObj.url,
          public_id: videoObj.public_id,
          asset_id: videoObj.asset_id,
        }));
        finalVideos = [...finalVideos, ...newVideoObjects];
      }

      // Create final form data with updated media
      const finalFormData = {
        ...formData,
        property_images: finalImages,
        property_videos: finalVideos,
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

        {/* Property Media Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
              Property Media
            </h2>

            {/* Media Count Summary */}
            {(existingImages.length > 0 ||
              newImages.length > 0 ||
              existingVideos.length > 0 ||
              newVideos.length > 0) && (
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <FiImage className="w-4 h-4" />
                  <span>{existingImages.length + newImages.length} Images</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FiVideo className="w-4 h-4" />
                  <span>{existingVideos.length + newVideos.length} Videos</span>
                </div>
              </div>
            )}
          </div>

          {/* Filter Tabs */}
          {(existingImages.length > 0 ||
            newImages.length > 0 ||
            existingVideos.length > 0 ||
            newVideos.length > 0) && (
            <div className="flex bg-gray-100 rounded-lg p-1 w-fit">
              {[
                { id: "all", label: "All Media", icon: FiUpload },
                { id: "images", label: "Images", icon: FiImage },
                { id: "videos", label: "Videos", icon: FiVideo },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-1 px-3 py-1 rounded text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Existing Images */}
          {existingImages.length > 0 &&
            (activeTab === "all" || activeTab === "images") && (
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
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        IMG
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Existing Videos */}
          {existingVideos.length > 0 &&
            (activeTab === "all" || activeTab === "videos") && (
              <div>
                <h3 className="text-md font-medium text-gray-600 mb-3">
                  Current Videos
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {existingVideos.map((video, index) => (
                    <div key={index} className="relative group">
                      <div className="w-full h-32 bg-gray-200 rounded-lg border border-gray-200 flex items-center justify-center relative overflow-hidden">
                        <video
                          src={video.url}
                          className="w-full h-full object-cover"
                          muted
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <FiPlay className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeExistingVideo(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FiX size={16} />
                      </button>
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        VID
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* New Images */}
          {newImages.length > 0 &&
            (activeTab === "all" || activeTab === "images") && (
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
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        IMG
                      </div>
                      <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        {formatFileSize(image.size)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* New Videos */}
          {newVideos.length > 0 &&
            (activeTab === "all" || activeTab === "videos") && (
              <div>
                <h3 className="text-md font-medium text-gray-600 mb-3">
                  New Videos to Upload
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {newVideos.map((video, index) => (
                    <div key={index} className="relative group">
                      <div className="w-full h-32 bg-gray-200 rounded-lg border border-gray-200 flex items-center justify-center relative overflow-hidden">
                        <video
                          src={URL.createObjectURL(video)}
                          className="w-full h-full object-cover"
                          muted
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <FiPlay className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeNewVideo(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FiX size={16} />
                      </button>
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        VID
                      </div>
                      <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        {formatFileSize(video.size)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Media Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 ${
              dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex items-center space-x-4">
                  <HiPhotograph className="h-8 w-8 text-gray-400" />
                  <span className="text-gray-400">+</span>
                  <HiVideoCamera className="h-8 w-8 text-gray-400" />
                </div>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Select Images & Videos
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileInputChange}
                  accept="image/*,video/*"
                  className="hidden"
                />
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-600">
                  or drag and drop your images and videos here
                </p>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>• Images: JPG, PNG, GIF (max 5MB each, up to 20 images)</p>
                  <p>
                    • Videos: MP4, MOV, AVI (max 100MB each, up to 5 videos)
                  </p>
                </div>
              </div>
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
