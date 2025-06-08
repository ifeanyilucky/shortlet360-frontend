import { useState, useRef } from "react";
import { FiUpload, FiX, FiPlay, FiImage, FiVideo } from "react-icons/fi";
import { HiPhotograph, HiVideoCamera } from "react-icons/hi";
import { useFormContext } from "react-hook-form";
import { toast } from "react-hot-toast";

export default function ImageUpload() {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'images', 'videos'
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const propertyImages = watch("property_images") || [];
  const propertyVideos = watch("property_videos") || [];

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
    const newImages = validFiles.filter((file) =>
      file.type.startsWith("image/")
    );
    const newVideos = validFiles.filter((file) =>
      file.type.startsWith("video/")
    );

    // Check limits
    if (propertyImages.length + newImages.length > 20) {
      toast.error("Maximum 20 images allowed");
      return;
    }
    if (propertyVideos.length + newVideos.length > 5) {
      toast.error("Maximum 5 videos allowed");
      return;
    }

    // Update form values
    if (newImages.length > 0) {
      setValue("property_images", [...propertyImages, ...newImages], {
        shouldValidate: true,
      });
    }
    if (newVideos.length > 0) {
      setValue("property_videos", [...propertyVideos, ...newVideos], {
        shouldValidate: true,
      });
    }

    if (validFiles.length > 0) {
      toast.success(
        `Added ${newImages.length} image(s) and ${newVideos.length} video(s)`
      );
    }
  };

  const removeImage = (index) => {
    setValue(
      "property_images",
      propertyImages.filter((_, i) => i !== index),
      { shouldValidate: true }
    );
  };

  const removeVideo = (index) => {
    setValue(
      "property_videos",
      propertyVideos.filter((_, i) => i !== index),
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

  const getVideoPreview = (video) => {
    // If it's a File object (new upload)
    if (video instanceof File) return URL.createObjectURL(video);

    // If it's an existing video with preview property
    if (video.preview) {
      // If preview is an object with url property (from backend)
      if (typeof video.preview === "object" && video.preview.url) {
        return video.preview.url;
      }
      // If preview is a string (direct URL)
      if (typeof video.preview === "string") {
        return video.preview;
      }
    }

    // If it's a direct string URL
    if (typeof video === "string") return video;

    // Fallback
    return null;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Filter media based on active tab
  const getFilteredMedia = () => {
    switch (activeTab) {
      case "images":
        return { images: propertyImages, videos: [] };
      case "videos":
        return { images: [], videos: propertyVideos };
      default:
        return { images: propertyImages, videos: propertyVideos };
    }
  };

  const { images: filteredImages, videos: filteredVideos } = getFilteredMedia();

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 ${
          dragActive ? "border-primary-900 bg-primary-50" : "border-gray-300"
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
              className="px-6 py-3 bg-primary-900 text-white rounded-md hover:bg-primary-800 transition-colors"
            >
              Select Images & Videos
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleChange}
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
              <p>• Videos: MP4, MOV, AVI (max 100MB each, up to 5 videos)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Media Count Summary */}
      {(propertyImages.length > 0 || propertyVideos.length > 0) && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <FiImage className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {propertyImages.length} Image
                  {propertyImages.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <FiVideo className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {propertyVideos.length} Video
                  {propertyVideos.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-white rounded-lg p-1 border">
              {[
                { id: "all", label: "All", icon: FiUpload },
                { id: "images", label: "Images", icon: FiImage },
                { id: "videos", label: "Videos", icon: FiVideo },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-1 px-3 py-1 rounded text-xs font-medium transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary-900 text-white"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Media Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Images */}
        {filteredImages.map((image, index) => (
          <div key={`image-${index}`} className="relative group aspect-square">
            <img
              src={getImagePreview(image)}
              alt={`Property Image ${index + 1}`}
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

            {/* Image indicators */}
            <div className="absolute bottom-2 left-2 flex space-x-1">
              <div className="px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded flex items-center space-x-1">
                <FiImage className="w-3 h-3" />
                <span>IMG</span>
              </div>
              {index === 0 && (
                <div className="px-2 py-1 bg-primary-900 text-white text-xs rounded">
                  Cover
                </div>
              )}
            </div>

            {/* File size for new uploads */}
            {image instanceof File && (
              <div className="absolute top-2 left-2 px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">
                {formatFileSize(image.size)}
              </div>
            )}
          </div>
        ))}

        {/* Videos */}
        {filteredVideos.map((video, index) => (
          <div key={`video-${index}`} className="relative group aspect-square">
            {getVideoPreview(video) ? (
              <video
                src={getVideoPreview(video)}
                className="w-full h-full object-cover rounded-lg"
                muted
                onError={(e) => {
                  console.error("Video preview error:", e);
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                <FiPlay className="w-8 h-8 text-gray-400" />
              </div>
            )}

            <button
              type="button"
              onClick={() => removeVideo(index)}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <FiX className="w-4 h-4" />
            </button>

            {/* Video play overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="bg-black bg-opacity-50 rounded-full p-3">
                <FiPlay className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Video indicators */}
            <div className="absolute bottom-2 left-2 flex space-x-1">
              <div className="px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded flex items-center space-x-1">
                <FiVideo className="w-3 h-3" />
                <span>VID</span>
              </div>
            </div>

            {/* File size for new uploads */}
            {video instanceof File && (
              <div className="absolute top-2 left-2 px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded">
                {formatFileSize(video.size)}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {propertyImages.length === 0 && propertyVideos.length === 0 && (
        <div className="text-center py-8">
          <div className="flex justify-center mb-4">
            <div className="flex items-center space-x-2 text-gray-400">
              <HiPhotograph className="w-8 h-8" />
              <HiVideoCamera className="w-8 h-8" />
            </div>
          </div>
          <p className="text-gray-500 text-lg font-medium">
            No media uploaded yet
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Please upload at least one image to showcase your property
          </p>
        </div>
      )}

      {/* Validation Errors */}
      {errors.property_images && (
        <p className="text-red-500 text-sm text-center mt-2">
          {errors.property_images.message}
        </p>
      )}
      {errors.property_videos && (
        <p className="text-red-500 text-sm text-center mt-2">
          {errors.property_videos.message}
        </p>
      )}
    </div>
  );
}
