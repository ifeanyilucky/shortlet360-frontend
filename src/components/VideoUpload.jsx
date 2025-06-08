import React, { useState, useRef } from 'react';
import { uploadService } from '../services/api';
import { toast } from 'react-hot-toast';
import { HiVideoCamera, HiX, HiPlay, HiUpload } from 'react-icons/hi';

const VideoUpload = ({
  onUploadSuccess,
  onUploadError,
  maxFileSize = 100, // MB
  className = '',
  multiple = false,
  maxFiles = 5
}) => {
  const [videos, setVideos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Validate video file
  const validateVideo = (file) => {
    // Check if it's a video file
    if (!file.type.startsWith('video/')) {
      toast.error('Please select a valid video file');
      return false;
    }

    // Check file size
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > maxFileSize) {
      toast.error(`Video size must be less than ${maxFileSize}MB`);
      return false;
    }

    return true;
  };

  // Handle video selection
  const handleVideoSelect = (selectedFiles) => {
    const fileArray = Array.from(selectedFiles);
    
    // Check max files limit
    if (!multiple && fileArray.length > 1) {
      toast.error('Please select only one video file');
      return;
    }

    if (multiple && videos.length + fileArray.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} videos allowed`);
      return;
    }

    // Validate each video
    const validVideos = fileArray.filter(validateVideo);
    
    if (validVideos.length > 0) {
      const newVideos = validVideos.map(file => ({
        file,
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        duration: null, // Will be set after video loads
        thumbnail: null // Could be generated if needed
      }));
      
      if (multiple) {
        setVideos(prev => [...prev, ...newVideos]);
      } else {
        setVideos(newVideos);
      }
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
      handleVideoSelect(e.dataTransfer.files);
    }
  };

  // Remove video
  const removeVideo = (videoId) => {
    setVideos(prev => prev.filter(v => v.id !== videoId));
  };

  // Upload videos
  const uploadVideos = async () => {
    if (videos.length === 0) {
      toast.error('Please select a video to upload');
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      
      if (videos.length === 1) {
        formData.append('video', videos[0].file);
        const response = await uploadService.uploadVideo(formData);
        
        if (response.success) {
          toast.success('Video uploaded successfully!');
          onUploadSuccess?.(response);
          setVideos([]);
        } else {
          throw new Error(response.message || 'Upload failed');
        }
      } else {
        videos.forEach(videoObj => {
          formData.append('videos', videoObj.file);
        });
        
        const response = await uploadService.uploadVideos(formData);
        
        if (response.success) {
          toast.success(`${videos.length} videos uploaded successfully!`);
          onUploadSuccess?.(response);
          setVideos([]);
        } else {
          throw new Error(response.message || 'Upload failed');
        }
      }
    } catch (error) {
      console.error('Video upload error:', error);
      toast.error(error.message || 'Video upload failed');
      onUploadError?.(error);
    } finally {
      setUploading(false);
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`video-upload ${className}`}>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
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
          multiple={multiple}
          accept="video/*"
          onChange={(e) => handleVideoSelect(e.target.files)}
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <HiVideoCamera className="w-16 h-16 text-gray-400" />
          </div>
          
          <div>
            <p className="text-xl font-medium text-gray-700">
              Drop your video{multiple ? 's' : ''} here
            </p>
            <p className="text-sm text-gray-500 mt-2">
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
          
          <div className="text-sm text-gray-500">
            <p>Maximum {maxFileSize}MB per video</p>
            {multiple && <p>Up to {maxFiles} videos</p>}
            <p>Supported formats: MP4, MOV, AVI, WMV, etc.</p>
          </div>
        </div>
      </div>

      {/* Video List */}
      {videos.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-medium text-gray-700 mb-4">
            Selected Video{videos.length > 1 ? 's' : ''} ({videos.length})
          </h4>
          
          <div className="space-y-3">
            {videos.map((video) => (
              <div key={video.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <HiPlay className="w-6 h-6 text-gray-500" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {video.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(video.size)}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => removeVideo(video.id)}
                  className="flex-shrink-0 p-2 text-red-600 hover:text-red-800 transition-colors"
                >
                  <HiX className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Button */}
      {videos.length > 0 && (
        <div className="mt-6">
          <button
            onClick={uploadVideos}
            disabled={uploading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <HiUpload className="w-5 h-5" />
            {uploading 
              ? 'Uploading...' 
              : `Upload ${videos.length} Video${videos.length > 1 ? 's' : ''}`
            }
          </button>
          
          {uploading && (
            <p className="text-sm text-gray-500 text-center mt-2">
              This may take a few minutes depending on video size...
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
