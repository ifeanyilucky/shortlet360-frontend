import api from "./api";

const blogService = {
  // Public endpoints
  getAllBlogs: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`/api/v1/blog${queryString ? `?${queryString}` : ""}`);
    return response.json();
  },

  getBlogBySlug: async (slug) => {
    const response = await fetch(`/api/v1/blog/slug/${slug}`);
    return response.json();
  },

  getCategories: async () => {
    const response = await fetch("/api/v1/blog/categories");
    return response.json();
  },

  getPopularTags: async () => {
    const response = await fetch("/api/v1/blog/tags");
    return response.json();
  },

  // Admin endpoints (require authentication)
  createBlog: async (blogData) => {
    return api.post("/blog", blogData);
  },

  updateBlog: async (id, blogData) => {
    return api.put(`/blog/${id}`, blogData);
  },

  deleteBlog: async (id) => {
    return api.delete(`/blog/${id}`);
  },

  getBlogById: async (id) => {
    return api.get(`/blog/${id}`);
  },

  getBlogStats: async () => {
    return api.get("/blog/stats");
  },

  // Admin blog list with filters
  getAdminBlogs: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/blog${queryString ? `?${queryString}` : ""}`);
  },
};

export default blogService;
