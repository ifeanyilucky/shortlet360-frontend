import { useState, useRef } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';

export default function ImageUpload({ formData, setFormData }) {
    const fileInputRef = useRef(null);
    const [dragActive, setDragActive] = useState(false);

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
        setFormData(prev => ({
            ...prev,
            property_images: [...prev.property_images, ...newImages]
        }));
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            property_images: prev.property_images.filter((_, i) => i !== index)
        }));
    };

    const getImagePreview = (image) => {
        if (typeof image === 'string') return image;
        if (image instanceof File) return URL.createObjectURL(image);
        return '';
    };

    return (
        <div className="space-y-6">
            <div
                className={`border-2 border-dashed rounded-lg p-6 ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
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
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
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
                {formData.property_images.map((image, index) => (
                    <div key={index} className="relative group aspect-square">
                        <img
                            src={getImagePreview(image)}
                            alt={`Property ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
                            }}
                        />
                        <button
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                            <FiX className="w-4 h-4" />
                        </button>
                        {index === 0 && (
                            <div className="absolute top-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs rounded">
                                Cover Photo
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {formData.property_images.length === 0 && (
                <p className="text-center text-gray-500 mt-4">
                    No images uploaded yet. Please upload at least one image.
                </p>
            )}
        </div>
    );
} 