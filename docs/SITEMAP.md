# Sitemap Generator Documentation

This document explains how to use the sitemap generation system for the Shortlet360 frontend application.

## Overview

The sitemap generator automatically creates XML sitemaps for your website, helping search engines discover and index your pages. It supports both static and dynamic routes, and can be integrated into your build process.

## Features

- ✅ **Static Route Generation** - Automatically includes all static pages
- ✅ **Dynamic Route Support** - Fetches dynamic content (blogs, properties) from APIs
- ✅ **SEO Optimization** - Includes priority, changefreq, and lastmod attributes
- ✅ **Build Integration** - Automatically generates sitemap during build
- ✅ **Development Tools** - Manual generation and testing utilities
- ✅ **Validation** - URL validation and error checking
- ✅ **Robots.txt Generation** - Creates robots.txt file

## Quick Start

### 1. Generate Sitemap Manually

```bash
# Generate basic sitemap
npm run sitemap:generate

# Generate sitemap with API integration
npm run sitemap:generate-with-api

# Generate robots.txt
npm run sitemap:robots

# Generate both sitemap and robots.txt
npm run sitemap:all
```

### 2. Automatic Generation

The sitemap is automatically generated during the build process:

```bash
npm run build
```

### 3. Development Mode

Use the React component for manual generation:

```jsx
import SitemapGenerator from './components/SitemapGenerator';

// Add to your development page
<SitemapGenerator />
```

Or use browser console commands:

```javascript
// Available in development mode
generateSitemap()     // Download sitemap.xml
previewSitemap()      // Preview in console
validateSitemap()     // Validate URLs
testDynamicRoutes()   // Test API endpoints
```

## Configuration

### Basic Configuration

Edit `src/config/sitemap.js` to customize your sitemap:

```javascript
export const sitemapConfig = {
  baseUrl: 'https://shortlet360.com', // Your domain
  
  staticRoutes: [
    {
      path: '/',
      changefreq: 'daily',
      priority: 1.0,
    },
    // Add more static routes...
  ],
  
  dynamicRoutes: {
    blog: {
      endpoint: '/api/blogs',
      pathTemplate: '/blog/{slug}',
      changefreq: 'weekly',
      priority: 0.6,
    },
    // Add more dynamic routes...
  },
  
  excludeRoutes: [
    '/auth/*',
    '/user/*',
    // Add routes to exclude...
  ],
};
```

### Dynamic Route Configuration

For dynamic routes, specify:

- `endpoint`: API endpoint to fetch data
- `pathTemplate`: URL pattern with placeholders
- `changefreq`: How often the page changes
- `priority`: Page priority (0.0 to 1.0)

Example:
```javascript
properties: {
  endpoint: '/api/properties',
  pathTemplate: '/property/{id}',
  changefreq: 'weekly',
  priority: 0.7,
}
```

## API Integration

### Real API Integration

To integrate with real APIs, modify the `fetchDynamicData` method in `scripts/generateSitemap.js`:

```javascript
// Replace mock implementation with real API calls
generator.fetchDynamicData = async function(endpoint) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  const data = await response.json();
  return data.results || data; // Adjust based on your API response
};
```

### API Response Format

Your API should return an array of objects with the required fields:

```javascript
// For blog posts
[
  {
    slug: 'post-slug',
    updatedAt: '2024-01-15T10:00:00Z'
  }
]

// For properties
[
  {
    id: '123',
    updatedAt: '2024-01-15T10:00:00Z'
  }
]
```

## File Structure

```
src/
├── config/
│   └── sitemap.js              # Sitemap configuration
├── utils/
│   ├── sitemapGenerator.js     # Core generator logic
│   └── sitemapDev.js          # Development utilities
└── components/
    └── SitemapGenerator.jsx    # React component for manual generation

scripts/
└── generateSitemap.js          # Build-time generation script

docs/
└── SITEMAP.md                 # This documentation

public/
├── sitemap.xml                # Generated sitemap (created by script)
└── robots.txt                 # Generated robots.txt (optional)
```

## Advanced Usage

### Custom Generator

Create a custom sitemap generator:

```javascript
import { SitemapGenerator } from './src/utils/sitemapGenerator.js';

const generator = new SitemapGenerator(customConfig);

// Override methods for custom behavior
generator.fetchDynamicData = async (endpoint) => {
  // Custom API integration
};

const xml = await generator.generateSitemap();
```

### Multiple Sitemaps

For large sites, split into multiple sitemaps:

```javascript
// Generate separate sitemaps for different content types
const blogSitemap = new SitemapGenerator(blogConfig);
const propertySitemap = new SitemapGenerator(propertyConfig);

// Create sitemap index
const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://shortlet360.com/sitemap-blog.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://shortlet360.com/sitemap-properties.xml</loc>
  </sitemap>
</sitemapindex>`;
```

## Troubleshooting

### Common Issues

1. **Empty Sitemap**
   - Check if routes are properly configured
   - Verify API endpoints are accessible
   - Check console for error messages

2. **Missing Dynamic Routes**
   - Verify API endpoints return correct data format
   - Check network connectivity
   - Ensure API authentication if required

3. **Build Errors**
   - Make sure all dependencies are installed
   - Check Node.js version compatibility
   - Verify file paths are correct

### Debugging

Enable debug mode by setting environment variable:

```bash
DEBUG=sitemap npm run sitemap:generate
```

Or use the validation tools:

```bash
npm run sitemap:generate
node -e "
const fs = require('fs');
const xml = fs.readFileSync('public/sitemap.xml', 'utf8');
console.log('Sitemap size:', xml.length);
console.log('URL count:', (xml.match(/<url>/g) || []).length);
"
```

## SEO Best Practices

1. **Update Frequency**: Set realistic `changefreq` values
2. **Priority**: Use priority to indicate page importance
3. **Last Modified**: Include `lastmod` for better crawling
4. **URL Limits**: Keep under 50,000 URLs per sitemap
5. **File Size**: Keep under 50MB uncompressed

## Integration with CI/CD

Add to your deployment pipeline:

```yaml
# GitHub Actions example
- name: Generate Sitemap
  run: npm run sitemap:all

- name: Deploy
  run: |
    # Deploy files including sitemap.xml and robots.txt
```

## Support

For issues or questions:
1. Check this documentation
2. Review console error messages
3. Test with development tools
4. Validate sitemap XML format
