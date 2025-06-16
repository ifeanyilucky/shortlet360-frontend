import React from 'react';
import SitemapGenerator from '../components/SitemapGenerator';

/**
 * Development page for sitemap generation
 * This page can be used during development to manually generate and test sitemaps
 */
const SitemapDevPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Sitemap Development Tools
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Use these tools to generate, preview, and test your website's sitemap during development.
            This page should only be accessible in development mode.
          </p>
        </div>

        {/* Main Sitemap Generator Component */}
        <SitemapGenerator />

        {/* Additional Information */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Quick Commands */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Quick Commands
            </h3>
            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded">
                <code className="text-sm text-gray-700">npm run sitemap:generate</code>
                <p className="text-xs text-gray-500 mt-1">Generate sitemap.xml</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <code className="text-sm text-gray-700">npm run sitemap:robots</code>
                <p className="text-xs text-gray-500 mt-1">Generate robots.txt</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <code className="text-sm text-gray-700">npm run sitemap:test</code>
                <p className="text-xs text-gray-500 mt-1">Run sitemap tests</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <code className="text-sm text-gray-700">npm run sitemap:all</code>
                <p className="text-xs text-gray-500 mt-1">Generate both files</p>
              </div>
            </div>
          </div>

          {/* Browser Console Commands */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Browser Console Commands
            </h3>
            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded">
                <code className="text-sm text-gray-700">generateSitemap()</code>
                <p className="text-xs text-gray-500 mt-1">Download sitemap.xml</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <code className="text-sm text-gray-700">previewSitemap()</code>
                <p className="text-xs text-gray-500 mt-1">Preview in console</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <code className="text-sm text-gray-700">validateSitemap()</code>
                <p className="text-xs text-gray-500 mt-1">Validate URLs</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <code className="text-sm text-gray-700">testDynamicRoutes()</code>
                <p className="text-xs text-gray-500 mt-1">Test API endpoints</p>
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Info */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Configuration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Static Routes</h4>
              <p className="text-sm text-gray-600">
                Configured in <code>src/config/sitemap.js</code>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Includes all public pages like home, about, contact, etc.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Dynamic Routes</h4>
              <p className="text-sm text-gray-600">
                Fetched from API endpoints
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Includes blog posts, properties, and other dynamic content.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Excluded Routes</h4>
              <p className="text-sm text-gray-600">
                Private and admin areas
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Auth pages, user dashboards, and admin panels are excluded.
              </p>
            </div>
          </div>
        </div>

        {/* SEO Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">
            SEO Best Practices
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="space-y-2 text-sm text-blue-700">
              <li>• Keep sitemaps under 50,000 URLs</li>
              <li>• Update changefreq realistically</li>
              <li>• Set priority based on page importance</li>
              <li>• Include lastmod for better crawling</li>
            </ul>
            <ul className="space-y-2 text-sm text-blue-700">
              <li>• Submit sitemap to Google Search Console</li>
              <li>• Reference sitemap in robots.txt</li>
              <li>• Regenerate after content updates</li>
              <li>• Monitor crawl errors regularly</li>
            </ul>
          </div>
        </div>

        {/* Warning for Production */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Development Only
              </h3>
              <p className="mt-1 text-sm text-yellow-700">
                This page should only be accessible in development mode. 
                In production, sitemaps are automatically generated during the build process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SitemapDevPage;
