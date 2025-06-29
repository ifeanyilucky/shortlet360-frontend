// Sitemap configuration
export const sitemapConfig = {
  // Base URL of your website
  baseUrl: "https://aplet360.com", // Update this to your actual domain

  // Default values for sitemap entries
  defaults: {
    changefreq: "weekly",
    priority: 0.5,
  },

  // Static routes configuration
  staticRoutes: [
    {
      path: "/",
      changefreq: "daily",
      priority: 1.0,
    },
    {
      path: "/about",
      changefreq: "monthly",
      priority: 0.8,
    },
    {
      path: "/book-now",
      changefreq: "weekly",
      priority: 0.9,
    },
    {
      path: "/faq",
      changefreq: "monthly",
      priority: 0.6,
    },
    {
      path: "/blog",
      changefreq: "daily",
      priority: 0.8,
    },
    {
      path: "/contact",
      changefreq: "monthly",
      priority: 0.7,
    },
    {
      path: "/home-fix",
      changefreq: "weekly",
      priority: 0.7,
    },
    {
      path: "/career",
      changefreq: "monthly",
      priority: 0.6,
    },
    {
      path: "/referral-program",
      changefreq: "monthly",
      priority: 0.6,
    },
    {
      path: "/become-artisan",
      changefreq: "monthly",
      priority: 0.7,
    },
    {
      path: "/marketplace",
      changefreq: "daily",
      priority: 0.8,
    },
    {
      path: "/property-management-solutions",
      changefreq: "monthly",
      priority: 0.7,
    },
    {
      path: "/privacy-policy",
      changefreq: "yearly",
      priority: 0.3,
    },
    {
      path: "/terms-conditions",
      changefreq: "yearly",
      priority: 0.3,
    },
    // Location-specific landing pages for SEO
    {
      path: "/apartments-for-rent-lagos",
      changefreq: "daily",
      priority: 0.9,
    },
    {
      path: "/apartments-for-rent-lagos-nigeria",
      changefreq: "daily",
      priority: 0.9,
    },
    {
      path: "/houses-for-rent-lagos",
      changefreq: "daily",
      priority: 0.8,
    },
    {
      path: "/flats-for-rent-nigeria",
      changefreq: "daily",
      priority: 0.9,
    },
    {
      path: "/cheap-shortlets-lagos",
      changefreq: "daily",
      priority: 0.8,
    },
    {
      path: "/apartments-for-rent-nigeria",
      changefreq: "daily",
      priority: 0.9,
    },
    {
      path: "/apartments-for-rent-africa",
      changefreq: "weekly",
      priority: 0.8,
    },
  ],

  // Dynamic routes configuration
  dynamicRoutes: {
    // Blog posts
    blog: {
      endpoint: "/api/blogs", // API endpoint to fetch blog posts
      pathTemplate: "/blog/{slug}",
      changefreq: "weekly",
      priority: 0.6,
    },
    // Properties
    properties: {
      endpoint: "/api/properties",
      pathTemplate: "/property/{id}",
      changefreq: "weekly",
      priority: 0.7,
    },
  },

  // Routes to exclude from sitemap
  excludeRoutes: [
    "/auth/*",
    "/user/*",
    "/owner/*",
    "/admin/*",
    "/reset-password/*",
    "/verify-email/*",
    "/:property_id/receipt/:booking_id",
    "/404",
  ],

  // Additional sitemap settings
  settings: {
    // Include lastmod timestamp
    includeLastmod: true,
    // Pretty print XML
    prettyPrint: true,
    // Maximum URLs per sitemap file (for large sites)
    maxUrls: 50000,
  },
};

export default sitemapConfig;
