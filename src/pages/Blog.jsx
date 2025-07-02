import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiSearch, FiCalendar, FiUser, FiEye, FiClock } from "react-icons/fi";
import { format } from "date-fns";
import { blogService } from "../services/api";
import NewsletterSubscription from "../components/NewsletterSubscription";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [popularTags, setPopularTags] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [pagination, setPagination] = useState({});

  const currentPage = parseInt(searchParams.get("page")) || 1;
  const currentCategory = searchParams.get("category") || "";
  const currentSearch = searchParams.get("search") || "";
  const currentTag = searchParams.get("tag") || "";

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "9",
      });

      if (currentCategory) params.append("category", currentCategory);
      if (currentSearch) params.append("search", currentSearch);
      if (currentTag) params.append("tags", currentTag);

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

  const fetchPopularTags = async () => {
    try {
      const response = await blogService.getTags();
      if (response.success) {
        setPopularTags(response.data.slice(0, 10)); // Show top 10 tags
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, currentCategory, currentSearch, currentTag]);

  useEffect(() => {
    fetchCategories();
    fetchPopularTags();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const search = formData.get("search");

    const newParams = new URLSearchParams(searchParams);
    if (search) {
      newParams.set("search", search);
    } else {
      newParams.delete("search");
    }
    newParams.delete("page");
    setSearchParams(newParams);
  };

  const handleCategoryFilter = (category) => {
    const newParams = new URLSearchParams(searchParams);
    if (category) {
      newParams.set("category", category);
    } else {
      newParams.delete("category");
    }
    newParams.delete("page");
    setSearchParams(newParams);
  };

  const handleTagFilter = (tag) => {
    const newParams = new URLSearchParams(searchParams);
    if (tag) {
      newParams.set("tag", tag);
    } else {
      newParams.delete("tag");
    }
    newParams.delete("page");
    setSearchParams(newParams);
  };

  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", page.toString());
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Blog</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Discover insights, tips, and stories about short-term rentals,
          property management, and travel.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="search"
                placeholder="Search blog posts..."
                defaultValue={currentSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </form>

          {/* Category Filter */}
          <select
            value={currentCategory}
            onChange={(e) => handleCategoryFilter(e.target.value)}
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

        {/* Active Filters */}
        {(currentCategory || currentSearch || currentTag) && (
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-sm text-gray-600">Active filters:</span>
            {currentCategory && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Category:{" "}
                {currentCategory.charAt(0).toUpperCase() +
                  currentCategory.slice(1).replace("-", " ")}
              </span>
            )}
            {currentSearch && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Search: {currentSearch}
              </span>
            )}
            {currentTag && (
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                Tag: {currentTag}
              </span>
            )}
            <button
              onClick={clearFilters}
              className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm hover:bg-red-200"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {blogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No blog posts found.</p>
            </div>
          ) : (
            <>
              {/* Blog Posts Grid */}
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {blogs.map((blog) => (
                  <article
                    key={blog._id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {blog.featured_image?.url && (
                      <img
                        src={blog.featured_image.url}
                        alt={blog.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {blog.category.charAt(0).toUpperCase() +
                            blog.category.slice(1).replace("-", " ")}
                        </span>
                        {blog.is_featured && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            Featured
                          </span>
                        )}
                      </div>

                      <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                        <Link
                          to={`/blog/${blog.slug}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {blog.title}
                        </Link>
                      </h2>

                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {blog.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <FiUser size={14} />
                            <span>
                              {blog.author?.first_name} {blog.author?.last_name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FiCalendar size={14} />
                            <span>
                              {format(
                                new Date(blog.published_at || blog.createdAt),
                                "MMM dd, yyyy"
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <FiClock size={14} />
                            <span>{blog.reading_time} min</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FiEye size={14} />
                            <span>{blog.views}</span>
                          </div>
                        </div>
                      </div>

                      <Link
                        to={`/blog/${blog.slug}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Read more →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center gap-2">
                  {pagination.hasPrevPage && (
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Previous
                    </button>
                  )}

                  {Array.from(
                    { length: pagination.pages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 border rounded-lg ${
                        page === currentPage
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  {pagination.hasNextPage && (
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Next
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* Popular Tags */}
            {popularTags.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <button
                      key={tag.name}
                      onClick={() => handleTagFilter(tag.name)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        currentTag === tag.name
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {tag.name} ({tag.count})
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Newsletter Subscription Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <NewsletterSubscription
            source="blog"
            title="Stay Updated with Our Latest Posts"
            description="Subscribe to our newsletter and never miss our latest property insights, tips, and market updates."
            className="text-center"
          />
        </div>
      </section>
    </div>
  );
}
