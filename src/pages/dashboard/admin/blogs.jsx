import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiEye,
  FiSearch,
  FiFilter,
} from "react-icons/fi";
import { format } from "date-fns";
import { blogService } from "../../../services/api";

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: "",
    category: "",
    search: "",
  });
  const [stats, setStats] = useState({});
  const [categories, setCategories] = useState([]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await blogService.getAllBlogs(params);

      if (response.success) {
        setBlogs(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await blogService.getStats();

      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Error fetching blog stats:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await blogService.getCategories();

      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const deleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) {
      return;
    }

    try {
      const response = await blogService.deleteBlog(id);

      if (response.success) {
        fetchBlogs();
        fetchStats();
      } else {
        alert("Failed to delete blog post");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog post");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [filters]);

  useEffect(() => {
    fetchStats();
    fetchCategories();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key !== "page" ? 1 : value, // Reset page when other filters change
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const search = formData.get("search");
    handleFilterChange("search", search);
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      published: "bg-green-100 text-green-800",
      draft: "bg-yellow-100 text-yellow-800",
      archived: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`px-2 py-1 text-xs rounded-full ${
          statusStyles[status] || statusStyles.draft
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Blog Management</h1>
          <p className="text-gray-600">Manage your blog posts and content</p>
        </div>
        <Link
          to="/admin/blogs/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiPlus size={16} />
          Create Post
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Posts</p>
              <h3 className="text-2xl font-bold">{stats.totalBlogs || 0}</h3>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FiEdit size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Published</p>
              <h3 className="text-2xl font-bold">
                {stats.publishedBlogs || 0}
              </h3>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FiEye size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Drafts</p>
              <h3 className="text-2xl font-bold">{stats.draftBlogs || 0}</h3>
            </div>
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FiEdit size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Views</p>
              <h3 className="text-2xl font-bold">{stats.totalViews || 0}</h3>
            </div>
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FiEye size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="search"
                placeholder="Search blog posts..."
                defaultValue={filters.search}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </form>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() +
                  category.slice(1).replace("-", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Blog Posts Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {blogs.map((blog) => (
                <tr key={blog._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {blog.featured_image?.url && (
                        <img
                          src={blog.featured_image.url}
                          alt={blog.title}
                          className="w-12 h-12 object-cover rounded-lg mr-4"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900 line-clamp-1">
                          {blog.title}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {blog.excerpt}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {blog.category.charAt(0).toUpperCase() +
                        blog.category.slice(1).replace("-", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(blog.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {blog.views}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(blog.createdAt), "MMM dd, yyyy")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/blog/${blog.slug}`}
                        target="_blank"
                        className="text-blue-600 hover:text-blue-900"
                        title="View"
                      >
                        <FiEye size={16} />
                      </Link>
                      <Link
                        to={`/admin/blogs/edit/${blog._id}`}
                        className="text-green-600 hover:text-green-900"
                        title="Edit"
                      >
                        <FiEdit size={16} />
                      </Link>
                      <button
                        onClick={() => deleteBlog(blog._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Showing {(pagination.current - 1) * pagination.perPage + 1} to{" "}
                {Math.min(
                  pagination.current * pagination.perPage,
                  pagination.totalDocs
                )}{" "}
                of {pagination.totalDocs} results
              </div>
              <div className="flex gap-2">
                {pagination.hasPrevPage && (
                  <button
                    onClick={() =>
                      handleFilterChange("page", pagination.current - 1)
                    }
                    className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Previous
                  </button>
                )}
                {Array.from(
                  { length: Math.min(5, pagination.pages) },
                  (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handleFilterChange("page", page)}
                        className={`px-3 py-1 border rounded ${
                          page === pagination.current
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  }
                )}
                {pagination.hasNextPage && (
                  <button
                    onClick={() =>
                      handleFilterChange("page", pagination.current + 1)
                    }
                    className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
