import React, { useState, useRef } from 'react';
import { uploadService } from '../services/api';
import { toast } from 'react-hot-toast';
import { 
  HiCloudUpload, 
  HiX, 
  HiPlay, 
  HiPhotograph,
  HiVideoCamera,
  HiDocumentAdd 
} from 'react-icons/hi';

const MediaUpload = ({
  onUploadSuccess,
  onUploadError,
  acceptedTypes = ['image', 'video'], // 'image', 'video', or both
  maxFiles = 10,
  maxFileSize = 100, // MB
  className = '',
  showPreview = true,
  uploadEndpoint = 'media' // 'image', 'video', or 'media'
}) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Generate accept attribute for file input
  const getAcceptAttribute = () => {
    const typeMap = {
      image: 'image/*',
      video: 'video/*'
    };
    return acceptedTypes.map(type => typeMap[type]).join(',');
  };

  // Validate file type and size
  const validateFile = (file) => {
    // Check file type
    const isValidType = acceptedTypes.some(type => {
      if (type === 'image') return file.type.startsWith('image/');
      if (type === 'video') return file.type.startsWith('video/');
      return false;
    });

    if (!isValidType) {
      toast.error(`Invalid file type. Only ${acceptedTypes.join(' and ')} files are allowed.`);
      return false;
    }

    // Check file size
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > maxFileSize) {
      toast.error(`File size must be less than ${maxFileSize}MB`);
      return false;
    }

    return true;
  };

  // Handle file selection
  const handleFileSelect = (selectedFiles) => {
    const fileArray = Array.from(selectedFiles);
    
    // Check max files limit
    if (files.length + fileArray.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate each file
    const validFiles = fileArray.filter(validateFile);
    
    if (validFiles.length > 0) {
      const newFiles = validFiles.map(file => ({
        file,
        id: Date.now() + Math.random(),
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
        type: file.type.startsWith('image/') ? 'image' : 'video'
      }));
      
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  // Remove file
  const removeFile = (fileId) => {
    setFiles(prev => {
      const updatedFiles = prev.filter(f => f.id !== fileId);
      // Clean up object URLs
      const removedFile = prev.find(f => f.id === fileId);
      if (removedFile?.preview) {
        URL.revokeObjectURL(removedFile.preview);
      }
      return updatedFiles;
    });
  };

  // Upload files
  const uploadFiles = async () => {
    if (files.length === 0) {
      toast.error('Please select files to upload');
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      
      // Determine the correct field name and endpoint based on upload type
      let fieldName, uploadMethod;
      
      if (uploadEndpoint === 'image') {
        fieldName = files.length === 1 ? 'image' : 'images';
        uploadMethod = files.length === 1 ? uploadService.uploadImage : uploadService.uploadImages;
      } else if (uploadEndpoint === 'video') {
        fieldName = files.length === 1 ? 'video' : 'videos';
        uploadMethod = files.length === 1 ? uploadService.uploadVideo : uploadService.uploadVideos;
      } else {
        fieldName = 'media';
        uploadMethod = uploadService.uploadMedia;
      }

      // Append files to FormData
      files.forEach(fileObj => {
        formData.append(fieldName, fileObj.file);
      });

      const response = await uploadMethod(formData);
      
      if (response.success) {
        toast.success(response.message || 'Upload successful!');
        onUploadSuccess?.(response);
        
        // Clean up
        files.forEach(fileObj => {
          if (fileObj.preview) {
            URL.revokeObjectURL(fileObj.preview);
          }
        });
        setFiles([]);
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Upload failed');
      onUploadError?.(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`media-upload ${className}`}>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={maxFiles > 1}
          accept={getAcceptAttribute()}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            {acceptedTypes.includes('video') && acceptedTypes.includes('image') ? (
              <HiDocumentAdd className="w-12 h-12 text-gray-400" />
            ) : acceptedTypes.includes('video') ? (
              <HiVideoCamera className="w-12 h-12 text-gray-400" />
            ) : (
              <HiPhotograph className="w-12 h-12 text-gray-400" />
            )}
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-700">
              Drop your {acceptedTypes.join(' or ')} files here
            </p>
            <p className="text-sm text-gray-500 mt-1">
              or{' '}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                browse files
              </button>
            </p>
          </div>
          
          <div className="text-xs text-gray-500">
            <p>Maximum {maxFiles} files, up to {maxFileSize}MB each</p>
            <p>Supported formats: {acceptedTypes.join(', ')}</p>
          </div>
        </div>
      </div>

      {/* File Preview */}
      {showPreview && files.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Selected Files ({files.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((fileObj) => (
              <div key={fileObj.id} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  {fileObj.type === 'image' ? (
                    <img
                      src={fileObj.preview}
                      alt={fileObj.file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <HiPlay className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => removeFile(fileObj.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <HiX className="w-4 h-4" />
                </button>
                
                <p className="text-xs text-gray-600 mt-1 truncate">
                  {fileObj.file.name}
                </p>
                <p className="text-xs text-gray-400">
                  {(fileObj.file.size / (1024 * 1024)).toFixed(1)}MB
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Button */}
      {files.length > 0 && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={uploadFiles}
            disabled={uploading}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <HiCloudUpload className="w-5 h-5" />
            {uploading ? 'Uploading...' : `Upload ${files.length} file${files.length > 1 ? 's' : ''}`}
          </button>
        </div>
      )}
    </div>
  );
};

export default MediaUpload;
