import axios from "axios";
import { sitemapConfig } from "../config/sitemap.js";

/**
 * Sitemap Generator Utility
 * Generates XML sitemap for the aplet360 frontend application
 */
export class SitemapGenerator {
  constructor(config = sitemapConfig) {
    this.config = config;
    this.urls = [];
  }

  /**
   * Generate complete sitemap
   */
  async generateSitemap() {
    try {
      // Add static routes
      this.addStaticRoutes();

      // Add dynamic routes
      await this.addDynamicRoutes();

      // Generate XML
      const xml = this.generateXML();

      return xml;
    } catch (error) {
      console.error("Error generating sitemap:", error);
      throw error;
    }
  }

  /**
   * Add static routes to sitemap
   */
  addStaticRoutes() {
    this.config.staticRoutes.forEach((route) => {
      this.addUrl({
        loc: this.config.baseUrl + route.path,
        changefreq: route.changefreq || this.config.defaults.changefreq,
        priority: route.priority || this.config.defaults.priority,
        lastmod: this.config.settings.includeLastmod
          ? new Date().toISOString()
          : null,
      });
    });
  }

  /**
   * Add dynamic routes to sitemap
   */
  async addDynamicRoutes() {
    for (const [routeType, routeConfig] of Object.entries(
      this.config.dynamicRoutes
    )) {
      try {
        await this.fetchAndAddDynamicRoute(routeType, routeConfig);
      } catch (error) {
        console.warn(
          `Failed to fetch dynamic routes for ${routeType}:`,
          error.message
        );
        // Continue with other routes even if one fails
      }
    }
  }

  /**
   * Fetch data and add dynamic routes
   */
  async fetchAndAddDynamicRoute(routeType, routeConfig) {
    try {
      // In a real implementation, you would fetch from your API
      // For now, we'll create a mock implementation
      const data = await this.fetchDynamicData(routeConfig.endpoint);

      if (Array.isArray(data)) {
        data.forEach((item) => {
          const path = this.generateDynamicPath(routeConfig.pathTemplate, item);
          this.addUrl({
            loc: this.config.baseUrl + path,
            changefreq:
              routeConfig.changefreq || this.config.defaults.changefreq,
            priority: routeConfig.priority || this.config.defaults.priority,
            lastmod: this.getLastModified(item),
          });
        });
      }
    } catch (error) {
      console.warn(`Error fetching dynamic route ${routeType}:`, error);
    }
  }

  /**
   * Fetch dynamic data from API
   * This is a mock implementation - replace with actual API calls
   */
  async fetchDynamicData(endpoint) {
    try {
      // Mock data for demonstration
      if (endpoint.includes("blogs")) {
        return [
          { slug: "welcome-to-aplet360", updatedAt: "2024-01-15T10:00:00Z" },
          {
            slug: "property-management-tips",
            updatedAt: "2024-01-10T15:30:00Z",
          },
          { slug: "booking-guide", updatedAt: "2024-01-05T09:15:00Z" },
        ];
      }

      if (endpoint.includes("properties")) {
        return [
          { id: "1", updatedAt: "2024-01-12T14:20:00Z" },
          { id: "2", updatedAt: "2024-01-08T11:45:00Z" },
          { id: "3", updatedAt: "2024-01-03T16:30:00Z" },
        ];
      }

      return [];
    } catch (error) {
      console.error("Error fetching dynamic data:", error);
      return [];
    }
  }

  /**
   * Generate dynamic path from template
   */
  generateDynamicPath(template, item) {
    let path = template;

    // Replace placeholders with actual values
    Object.keys(item).forEach((key) => {
      const placeholder = `{${key}}`;
      if (path.includes(placeholder)) {
        path = path.replace(placeholder, item[key]);
      }
    });

    return path;
  }

  /**
   * Get last modified date from item
   */
  getLastModified(item) {
    if (!this.config.settings.includeLastmod) return null;

    // Try different common field names for last modified
    const lastModFields = [
      "updatedAt",
      "updated_at",
      "lastModified",
      "last_modified",
      "modifiedAt",
    ];

    for (const field of lastModFields) {
      if (item[field]) {
        return new Date(item[field]).toISOString();
      }
    }

    return new Date().toISOString();
  }

  /**
   * Add URL to sitemap
   */
  addUrl(urlData) {
    // Validate URL
    if (!urlData.loc) {
      console.warn("URL location is required");
      return;
    }

    // Check if URL should be excluded
    if (this.shouldExcludeUrl(urlData.loc)) {
      return;
    }

    this.urls.push(urlData);
  }

  /**
   * Check if URL should be excluded from sitemap
   */
  shouldExcludeUrl(url) {
    const path = url.replace(this.config.baseUrl, "");

    return this.config.excludeRoutes.some((excludePattern) => {
      if (excludePattern.includes("*")) {
        const regex = new RegExp(excludePattern.replace("*", ".*"));
        return regex.test(path);
      }
      return path === excludePattern;
    });
  }

  /**
   * Generate XML sitemap
   */
  generateXML() {
    const indent = this.config.settings.prettyPrint ? "  " : "";
    const newline = this.config.settings.prettyPrint ? "\n" : "";

    let xml = '<?xml version="1.0" encoding="UTF-8"?>' + newline;
    xml +=
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + newline;

    this.urls.forEach((url) => {
      xml += indent + "<url>" + newline;
      xml +=
        indent + indent + `<loc>${this.escapeXml(url.loc)}</loc>` + newline;

      if (url.lastmod) {
        xml += indent + indent + `<lastmod>${url.lastmod}</lastmod>` + newline;
      }

      if (url.changefreq) {
        xml +=
          indent +
          indent +
          `<changefreq>${url.changefreq}</changefreq>` +
          newline;
      }

      if (url.priority) {
        xml +=
          indent + indent + `<priority>${url.priority}</priority>` + newline;
      }

      xml += indent + "</url>" + newline;
    });

    xml += "</urlset>";

    return xml;
  }

  /**
   * Escape XML special characters
   */
  escapeXml(unsafe) {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case "&":
          return "&amp;";
        case "'":
          return "&apos;";
        case '"':
          return "&quot;";
        default:
          return c;
      }
    });
  }

  /**
   * Get sitemap statistics
   */
  getStats() {
    return {
      totalUrls: this.urls.length,
      staticUrls: this.config.staticRoutes.length,
      dynamicUrls: this.urls.length - this.config.staticRoutes.length,
    };
  }
}

export default SitemapGenerator;
