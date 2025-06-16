import React, { useState } from 'react';
import { SitemapDevUtils } from '../utils/sitemapDev.js';

/**
 * Sitemap Generator Component
 * A React component for manually generating sitemaps in development
 */
const SitemapGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('generate');

  const sitemapDev = new SitemapDevUtils();

  const handleGenerate = async () => {
    setIsGenerating(true);
    setResult(null);
    
    try {
      const result = await sitemapDev.generateAndDownload();
      setResult(result);
    } catch (error) {
      setResult({ success: false, error: error.message });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreview = async () => {
    setIsGenerating(true);
    setResult(null);
    
    try {
      const result = await sitemapDev.previewSitemap();
      setResult(result);
    } catch (error) {
      setResult({ success: false, error: error.message });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleValidate = async () => {
    setIsGenerating(true);
    setResult(null);
    
    try {
      const result = await sitemapDev.validateSitemap();
      setResult({ success: true, validation: result });
    } catch (error) {
      setResult({ success: false, error: error.message });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTestDynamic = async () => {
    setIsGenerating(true);
    setResult(null);
    
    try {
      const result = await sitemapDev.testDynamicRoutes();
      setResult({ success: true, dynamicTest: result });
    } catch (error) {
      setResult({ success: false, error: error.message });
    } finally {
      setIsGenerating(false);
    }
  };

  const renderResult = () => {
    if (!result) return null;

    if (!result.success) {
      return (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="text-red-800 font-semibold">Error</h4>
          <p className="text-red-600">{result.error}</p>
        </div>
      );
    }

    return (
      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h4 className="text-green-800 font-semibold">Success!</h4>
        
        {result.stats && (
          <div className="mt-2 text-green-700">
            <p>Total URLs: {result.stats.totalUrls}</p>
            <p>Static URLs: {result.stats.staticUrls}</p>
            <p>Dynamic URLs: {result.stats.dynamicUrls}</p>
          </div>
        )}

        {result.validation && (
          <div className="mt-2 text-green-700">
            <p>Valid URLs: {result.validation.validUrls}</p>
            <p>Invalid URLs: {result.validation.invalidUrls}</p>
            {result.validation.errors.length > 0 && (
              <div className="mt-2">
                <p className="font-semibold">Errors:</p>
                <ul className="list-disc list-inside">
                  {result.validation.errors.map((error, index) => (
                    <li key={index} className="text-red-600">
                      {error.url}: {error.error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {result.dynamicTest && (
          <div className="mt-2 text-green-700">
            <p className="font-semibold">Dynamic Route Test Results:</p>
            {Object.entries(result.dynamicTest).map(([routeType, testResult]) => (
              <div key={routeType} className="ml-4">
                <p>
                  {routeType}: {testResult.success ? '✅' : '❌'} 
                  {testResult.count !== undefined && ` (${testResult.count} items)`}
                </p>
                {testResult.error && (
                  <p className="text-red-600 ml-4">{testResult.error}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {result.xml && (
          <div className="mt-2">
            <p className="text-green-700">Check browser console for XML preview</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Sitemap Generator</h2>
      
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6">
        {[
          { id: 'generate', label: 'Generate' },
          { id: 'preview', label: 'Preview' },
          { id: 'validate', label: 'Validate' },
          { id: 'test', label: 'Test Dynamic' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'generate' && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Generate Sitemap</h3>
            <p className="text-gray-600 mb-4">
              Generate and download a complete sitemap.xml file for your website.
            </p>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? 'Generating...' : 'Generate & Download Sitemap'}
            </button>
          </div>
        )}

        {activeTab === 'preview' && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Preview Sitemap</h3>
            <p className="text-gray-600 mb-4">
              Preview the sitemap XML in the browser console.
            </p>
            <button
              onClick={handlePreview}
              disabled={isGenerating}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? 'Generating...' : 'Preview Sitemap'}
            </button>
          </div>
        )}

        {activeTab === 'validate' && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Validate Sitemap</h3>
            <p className="text-gray-600 mb-4">
              Validate all URLs in the sitemap to ensure they are properly formatted.
            </p>
            <button
              onClick={handleValidate}
              disabled={isGenerating}
              className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? 'Validating...' : 'Validate Sitemap'}
            </button>
          </div>
        )}

        {activeTab === 'test' && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Test Dynamic Routes</h3>
            <p className="text-gray-600 mb-4">
              Test the fetching of dynamic routes (blogs, properties, etc.) to ensure they work correctly.
            </p>
            <button
              onClick={handleTestDynamic}
              disabled={isGenerating}
              className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? 'Testing...' : 'Test Dynamic Routes'}
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      {renderResult()}

      {/* Instructions */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">Instructions</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Use "Generate" to create and download a sitemap.xml file</li>
          <li>• Use "Preview" to see the sitemap XML in the console</li>
          <li>• Use "Validate" to check for URL formatting issues</li>
          <li>• Use "Test Dynamic" to verify API endpoints are working</li>
          <li>• For production builds, the sitemap is automatically generated</li>
        </ul>
      </div>
    </div>
  );
};

export default SitemapGenerator;
