import React, { useState } from 'react';
import MediaUpload from './MediaUpload';
import VideoUpload from './VideoUpload';
import { uploadService } from '../services/api';
import { toast } from 'react-hot-toast';

const UploadExample = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [activeTab, setActiveTab] = useState('images');

  // Handle successful uploads
  const handleUploadSuccess = (response) => {
    console.log('Upload successful:', response);
    
    // Add uploaded files to state
    if (response.urls) {
      setUploadedFiles(prev => [...prev, ...response.urls]);
    } else if (response.data) {
      setUploadedFiles(prev => [...prev, response.data]);
    }
  };

  // Handle upload errors
  const handleUploadError = (error) => {
    console.error('Upload error:', error);
    toast.error('Upload failed. Please try again.');
  };

  // Example of programmatic upload
  const handleFileInputChange = async (event) => {
    const files = Array.from(event.target.files);
    
    if (files.length === 0) return;

    try {
      // Example: Upload single image
      if (files.length === 1 && files[0].type.startsWith('image/')) {
        const formData = uploadService.createSingleFileFormData(files[0], 'image');
        const response = await uploadService.uploadImage(formData);
        handleUploadSuccess(response);
      }
      // Example: Upload multiple videos
      else if (files.every(file => file.type.startsWith('video/'))) {
        const formData = uploadService.createMultipleFilesFormData(files, 'videos');
        const response = await uploadService.uploadVideos(formData);
        handleUploadSuccess(response);
      }
      // Example: Upload mixed media
      else {
        const formData = uploadService.createMultipleFilesFormData(files, 'media');
        const response = await uploadService.uploadMedia(formData);
        handleUploadSuccess(response);
      }
    } catch (error) {
      handleUploadError(error);
    }
  };

  // Clear uploaded files
  const clearUploads = () => {
    setUploadedFiles([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        File Upload Examples
      </h1>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'images', label: 'Images Only' },
            { id: 'videos', label: 'Videos Only' },
            { id: 'mixed', label: 'Mixed Media' },
            { id: 'programmatic', label: 'Programmatic' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-8">
        {activeTab === 'images' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Image Upload Only</h2>
            <MediaUpload
              acceptedTypes={['image']}
              maxFiles={5}
              maxFileSize={5}
              uploadEndpoint="image"
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
              className="border border-gray-200 rounded-lg p-4"
            />
          </div>
        )}

        {activeTab === 'videos' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Video Upload Only</h2>
            <VideoUpload
              multiple={true}
              maxFiles={3}
              maxFileSize={100}
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
              className="border border-gray-200 rounded-lg p-4"
            />
          </div>
        )}

        {activeTab === 'mixed' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Mixed Media Upload</h2>
            <MediaUpload
              acceptedTypes={['image', 'video']}
              maxFiles={10}
              maxFileSize={100}
              uploadEndpoint="media"
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
              className="border border-gray-200 rounded-lg p-4"
            />
          </div>
        )}

        {activeTab === 'programmatic' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Programmatic Upload</h2>
            <div className="border border-gray-200 rounded-lg p-6">
              <p className="text-gray-600 mb-4">
                Example of handling file uploads programmatically using the upload service.
              </p>
              
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileInputChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              
              <div className="mt-4 text-sm text-gray-500">
                <p>• Single images will use the image upload endpoint</p>
                <p>• Multiple videos will use the video upload endpoint</p>
                <p>• Mixed files will use the media upload endpoint</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Uploaded Files Display */}
      {uploadedFiles.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Uploaded Files</h2>
            <button
              onClick={clearUploads}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Clear All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="aspect-video bg-gray-100 rounded-lg mb-3 overflow-hidden">
                  {file.type === 'image' ? (
                    <img
                      src={file.url}
                      alt="Uploaded"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={file.url}
                      controls
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900">
                    {file.type || 'Unknown'} file
                  </p>
                  <p className="text-xs text-gray-500 break-all">
                    {file.public_id}
                  </p>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    View Full Size
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Usage Examples */}
      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Usage Examples</h3>
        
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-900">Basic Image Upload:</h4>
            <pre className="bg-gray-800 text-green-400 p-3 rounded mt-2 overflow-x-auto">
{`<MediaUpload
  acceptedTypes={['image']}
  maxFiles={5}
  onUploadSuccess={(response) => console.log(response)}
/>`}
            </pre>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900">Video Upload:</h4>
            <pre className="bg-gray-800 text-green-400 p-3 rounded mt-2 overflow-x-auto">
{`<VideoUpload
  multiple={true}
  maxFileSize={100}
  onUploadSuccess={(response) => console.log(response)}
/>`}
            </pre>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900">Programmatic Upload:</h4>
            <pre className="bg-gray-800 text-green-400 p-3 rounded mt-2 overflow-x-auto">
{`const formData = uploadService.createSingleFileFormData(file, 'video');
const response = await uploadService.uploadVideo(formData);`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadExample;
