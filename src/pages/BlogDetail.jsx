import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FiCalendar,
  FiUser,
  FiEye,
  FiClock,
  FiArrowLeft,
  FiTag,
} from "react-icons/fi";
import { format } from "date-fns";
import { blogService } from "../services/api";
import NewsletterSubscription from "../components/NewsletterSubscription";

export default function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [error, setError] = useState(null);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await blogService.getBlogBySlug(slug);

      if (response.success) {
        setBlog(response.data);
        // Fetch related blogs
        fetchRelatedBlogs(response.data.category, response.data._id);
      } else {
        setError("Blog post not found");
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
      setError("Failed to load blog post");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async (category, currentBlogId) => {
    try {
      const response = await blogService.getAllBlogs({ category, limit: 3 });

      if (response.success) {
        // Filter out current blog and limit to 3
        const filtered = response.data
          .filter((b) => b._id !== currentBlogId)
          .slice(0, 3);
        setRelatedBlogs(filtered);
      }
    } catch (error) {
      console.error("Error fetching related blogs:", error);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Blog Post Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            {error || "The blog post you're looking for doesn't exist."}
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiArrowLeft size={16} />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <FiArrowLeft size={16} />
        Back
      </button>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <article className="lg:col-span-3">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                {blog.category.charAt(0).toUpperCase() +
                  blog.category.slice(1).replace("-", " ")}
              </span>
              {blog.is_featured && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                  Featured
                </span>
              )}
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {blog.title}
            </h1>

            {blog.excerpt && (
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                {blog.excerpt}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-2">
                <FiUser size={16} />
                <span>
                  By {blog.author?.first_name} {blog.author?.last_name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FiCalendar size={16} />
                <span>
                  {format(
                    new Date(blog.published_at || blog.createdAt),
                    "MMMM dd, yyyy"
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FiClock size={16} />
                <span>{blog.reading_time} min read</span>
              </div>
              <div className="flex items-center gap-2">
                <FiEye size={16} />
                <span>{blog.views} views</span>
              </div>
            </div>

            {/* Featured Image */}
            {blog.featured_image?.url && (
              <div className="mb-8">
                <img
                  src={blog.featured_image.url}
                  alt={blog.title}
                  className="w-full h-64 md:h-96 object-cover rounded-lg shadow-sm"
                />
              </div>
            )}
          </header>

          {/* Content */}
          <div className="prose prose-lg max-w-none mb-8">
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />

            {/* Call to Action Section */}
            <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Ready to Experience Premium Shortlets?
              </h3>
              <p className="text-gray-600 mb-6">
                Discover verified, premium shortlet apartments across Nigeria.
                From luxury stays to budget-friendly options, find your perfect
                home away from home.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/properties"
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Browse Verified Shortlets
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                >
                  Contact Customer Support
                </Link>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                <p>
                  📧 Subscribe to our property alerts and never miss out on the
                  best deals.{" "}
                  <Link
                    to="/newsletter"
                    className="text-blue-600 hover:underline"
                  >
                    Subscribe now
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <FiTag size={18} />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, index) => (
                  <Link
                    key={index}
                    to={`/blog?tag=${tag}`}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="border-t pt-8">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiArrowLeft size={16} />
              Back to All Posts
            </Link>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="space-y-6">
            {/* Author Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-3">About the Author</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FiUser size={20} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {blog.author?.first_name} {blog.author?.last_name}
                  </h4>
                  <p className="text-sm text-gray-500">Author</p>
                </div>
              </div>
            </div>

            {/* Related Posts */}
            {relatedBlogs.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Related Posts</h3>
                <div className="space-y-4">
                  {relatedBlogs.map((relatedBlog) => (
                    <article key={relatedBlog._id} className="group">
                      <Link to={`/blog/${relatedBlog.slug}`}>
                        {relatedBlog.featured_image?.url && (
                          <img
                            src={relatedBlog.featured_image.url}
                            alt={relatedBlog.title}
                            className="w-full h-32 object-cover rounded-lg mb-2"
                          />
                        )}
                        <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                          {relatedBlog.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {format(
                            new Date(
                              relatedBlog.published_at || relatedBlog.createdAt
                            ),
                            "MMM dd, yyyy"
                          )}
                        </p>
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Newsletter Subscription Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <NewsletterSubscription
            source="blog"
            title="Enjoyed This Article?"
            description="Subscribe to our newsletter for more property insights, market updates, and exclusive tips delivered to your inbox."
            className="text-center"
          />
        </div>
      </section>
    </div>
  );
}
