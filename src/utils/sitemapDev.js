import { SitemapGenerator } from './sitemapGenerator.js';

/**
 * Development utility for sitemap generation
 * This can be used in development mode or as a manual trigger
 */
export class SitemapDevUtils {
  constructor() {
    this.generator = new SitemapGenerator();
  }

  /**
   * Generate and download sitemap in browser
   */
  async generateAndDownload() {
    try {
      const sitemapXML = await this.generator.generateSitemap();
      const stats = this.generator.getStats();
      
      // Create blob and download
      const blob = new Blob([sitemapXML], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'sitemap.xml';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      console.log('✅ Sitemap downloaded successfully!', stats);
      return { success: true, stats };
    } catch (error) {
      console.error('❌ Error generating sitemap:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Preview sitemap in console
   */
  async previewSitemap() {
    try {
      const sitemapXML = await this.generator.generateSitemap();
      const stats = this.generator.getStats();
      
      console.log('📋 Sitemap Preview:');
      console.log('==================');
      console.log(sitemapXML);
      console.log('==================');
      console.log('📊 Statistics:', stats);
      
      return { success: true, xml: sitemapXML, stats };
    } catch (error) {
      console.error('❌ Error generating sitemap:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get sitemap URLs as array
   */
  async getSitemapUrls() {
    try {
      await this.generator.generateSitemap();
      return this.generator.urls;
    } catch (error) {
      console.error('❌ Error getting sitemap URLs:', error);
      return [];
    }
  }

  /**
   * Validate sitemap URLs
   */
  async validateSitemap() {
    try {
      const urls = await this.getSitemapUrls();
      const validation = {
        totalUrls: urls.length,
        validUrls: 0,
        invalidUrls: 0,
        errors: [],
      };

      for (const url of urls) {
        try {
          new URL(url.loc);
          validation.validUrls++;
        } catch (error) {
          validation.invalidUrls++;
          validation.errors.push({
            url: url.loc,
            error: 'Invalid URL format',
          });
        }
      }

      console.log('🔍 Sitemap Validation Results:', validation);
      return validation;
    } catch (error) {
      console.error('❌ Error validating sitemap:', error);
      return { error: error.message };
    }
  }

  /**
   * Test dynamic route fetching
   */
  async testDynamicRoutes() {
    try {
      console.log('🧪 Testing dynamic route fetching...');
      
      const results = {};
      const dynamicRoutes = this.generator.config.dynamicRoutes;
      
      for (const [routeType, routeConfig] of Object.entries(dynamicRoutes)) {
        console.log(`Testing ${routeType}...`);
        try {
          const data = await this.generator.fetchDynamicData(routeConfig.endpoint);
          results[routeType] = {
            success: true,
            count: Array.isArray(data) ? data.length : 0,
            data: data,
          };
        } catch (error) {
          results[routeType] = {
            success: false,
            error: error.message,
          };
        }
      }
      
      console.log('🧪 Dynamic route test results:', results);
      return results;
    } catch (error) {
      console.error('❌ Error testing dynamic routes:', error);
      return { error: error.message };
    }
  }
}

/**
 * Global development utilities
 * These can be called from browser console
 */
if (typeof window !== 'undefined') {
  window.sitemapDev = new SitemapDevUtils();
  
  // Add convenience methods to window
  window.generateSitemap = () => window.sitemapDev.generateAndDownload();
  window.previewSitemap = () => window.sitemapDev.previewSitemap();
  window.validateSitemap = () => window.sitemapDev.validateSitemap();
  window.testDynamicRoutes = () => window.sitemapDev.testDynamicRoutes();
  
  console.log('🛠️ Sitemap dev tools loaded!');
  console.log('Available commands:');
  console.log('  - generateSitemap() - Download sitemap.xml');
  console.log('  - previewSitemap() - Preview sitemap in console');
  console.log('  - validateSitemap() - Validate sitemap URLs');
  console.log('  - testDynamicRoutes() - Test dynamic route fetching');
}

export default SitemapDevUtils;
