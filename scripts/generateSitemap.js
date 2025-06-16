#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { SitemapGenerator } from "../src/utils/sitemapGenerator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Build-time sitemap generation script
 * This script generates a sitemap.xml file in the public directory
 */
async function generateSitemap() {
  console.log("🚀 Starting sitemap generation...");

  try {
    // Create sitemap generator instance
    const generator = new SitemapGenerator();

    // Generate sitemap XML
    const sitemapXML = await generator.generateSitemap();

    // Get statistics
    const stats = generator.getStats();

    // Ensure public directory exists
    const publicDir = path.join(__dirname, "..", "public");
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Write sitemap to public directory
    const sitemapPath = path.join(publicDir, "sitemap.xml");
    fs.writeFileSync(sitemapPath, sitemapXML, "utf8");

    // Log success
    console.log("✅ Sitemap generated successfully!");
    console.log(`📍 Location: ${sitemapPath}`);
    console.log(`📊 Statistics:`);
    console.log(`   - Total URLs: ${stats.totalUrls}`);
    console.log(`   - Static URLs: ${stats.staticUrls}`);
    console.log(`   - Dynamic URLs: ${stats.dynamicUrls}`);

    // Validate sitemap size
    const sitemapSize = fs.statSync(sitemapPath).size;
    console.log(`📏 File size: ${(sitemapSize / 1024).toFixed(2)} KB`);

    if (stats.totalUrls > 50000) {
      console.warn(
        "⚠️  Warning: Sitemap contains more than 50,000 URLs. Consider splitting into multiple sitemaps."
      );
    }
  } catch (error) {
    console.error("❌ Error generating sitemap:", error);
    process.exit(1);
  }
}

/**
 * Enhanced sitemap generation with API integration
 * This function demonstrates how to integrate with real APIs
 */
async function generateSitemapWithAPI() {
  console.log(
    "🚀 Starting enhanced sitemap generation with API integration..."
  );

  try {
    // Import API configuration
    const apiConfig = await import("../src/config/index.js");

    // Create custom sitemap generator with API integration
    const generator = new SitemapGenerator();

    // Override the fetchDynamicData method to use real APIs
    generator.fetchDynamicData = async function (endpoint) {
      try {
        // Replace with your actual API base URL
        const baseURL =
          apiConfig.default?.API_BASE_URL || "https://api.aplet360.com";
        const fullURL = baseURL + endpoint;

        console.log(`📡 Fetching data from: ${fullURL}`);

        // Note: In a real implementation, you would use axios or fetch
        // For now, we'll return mock data
        if (endpoint.includes("blogs")) {
          return [
            {
              slug: "welcome-to-aplet360",
              updatedAt: new Date().toISOString(),
            },
            {
              slug: "property-management-tips",
              updatedAt: new Date().toISOString(),
            },
          ];
        }

        if (endpoint.includes("properties")) {
          return [
            { id: "1", updatedAt: new Date().toISOString() },
            { id: "2", updatedAt: new Date().toISOString() },
          ];
        }

        return [];
      } catch (error) {
        console.warn(`Failed to fetch from ${endpoint}:`, error.message);
        return [];
      }
    };

    // Generate sitemap
    const sitemapXML = await generator.generateSitemap();
    const stats = generator.getStats();

    // Write to file
    const publicDir = path.join(__dirname, "..", "public");
    const sitemapPath = path.join(publicDir, "sitemap.xml");
    fs.writeFileSync(sitemapPath, sitemapXML, "utf8");

    console.log("✅ Enhanced sitemap generated successfully!");
    console.log(`📊 Statistics: ${stats.totalUrls} total URLs`);
  } catch (error) {
    console.error("❌ Error generating enhanced sitemap:", error);
    process.exit(1);
  }
}

/**
 * Generate robots.txt file
 */
function generateRobotsTxt() {
  console.log("🤖 Generating robots.txt...");

  const robotsContent = `User-agent: *
Allow: /

# Disallow private areas
Disallow: /auth/
Disallow: /user/
Disallow: /owner/
Disallow: /admin/
Disallow: /api/

# Sitemap location
Sitemap: https://aplet360.com/sitemap.xml

# Crawl delay (optional)
Crawl-delay: 1
`;

  const publicDir = path.join(__dirname, "..", "public");
  const robotsPath = path.join(publicDir, "robots.txt");

  fs.writeFileSync(robotsPath, robotsContent, "utf8");
  console.log(`✅ robots.txt generated at: ${robotsPath}`);
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || "generate";

  switch (command) {
    case "generate":
      await generateSitemap();
      break;
    case "generate-with-api":
      await generateSitemapWithAPI();
      break;
    case "robots":
      generateRobotsTxt();
      break;
    case "all":
      await generateSitemap();
      generateRobotsTxt();
      break;
    default:
      console.log("Usage: node scripts/generateSitemap.js [command]");
      console.log("Commands:");
      console.log("  generate         - Generate basic sitemap");
      console.log(
        "  generate-with-api - Generate sitemap with API integration"
      );
      console.log("  robots          - Generate robots.txt");
      console.log("  all             - Generate both sitemap and robots.txt");
      break;
  }
}

// Run the script
main().catch(console.error);
