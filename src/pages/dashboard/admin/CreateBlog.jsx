import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSave, FiEye, FiUpload, FiX } from "react-icons/fi";
import { uploadService } from "../../../services/api";
import { blogService, newsletterService } from "../../../services/api";
import toast from "react-hot-toast";

export default function CreateBlog() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    tags: "",
    status: "draft",
    is_featured: false,
    meta_title: "",
    meta_description: "",
    featured_image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [sendToNewsletter, setSendToNewsletter] = useState(false);
  const [newsletterSubject, setNewsletterSubject] = useState("");

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

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, featured_image: file }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, featured_image: null }));
    setImagePreview(null);
  };

  const uploadImage = async (file) => {
    const uploadFormData = new FormData();
    uploadFormData.append("image", file);

    try {
      const response = await uploadService.uploadImage(uploadFormData);

      if (response.success) {
        return response.data;
      }
      throw new Error("Upload failed");
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let blogData = { ...formData };

      // Upload featured image if provided
      if (formData.featured_image) {
        const imageData = await uploadImage(formData.featured_image);
        blogData.featured_image = {
          url: imageData.url,
          public_id: imageData.public_id,
          asset_id: imageData.asset_id,
        };
      }

      // Remove the file object from form data
      if (blogData.featured_image instanceof File) {
        delete blogData.featured_image;
      }

      const response = await blogService.createBlog(blogData);

      if (response.success) {
        // Send to newsletter if requested and blog is published
        if (sendToNewsletter && blogData.status === "published") {
          try {
            const subject =
              newsletterSubject || `New Blog Post: ${blogData.title}`;
            const blogUrl = `${window.location.origin}/blog/${response.data.slug}`;

            // Create a simple blog post content for the newsletter
            const blogPostContent = `
              <h2>${blogData.title}</h2>
              ${blogData.excerpt ? `<p>${blogData.excerpt}</p>` : ""}
              <p><a href="${blogUrl}" style="color: #3B82F6; font-weight: 600;">Read the full article on our blog</a></p>
            `;

            await newsletterService.sendNewsletter({
              subject,
              content: blogPostContent,
              html_content: blogPostContent,
              use_template: true,
            });

            toast.success(
              "Blog post created and sent to newsletter subscribers!"
            );
          } catch (newsletterError) {
            console.error("Error sending newsletter:", newsletterError);
            toast.success(
              "Blog post created successfully, but failed to send newsletter"
            );
          }
        } else {
          toast.success("Blog post created successfully!");
        }

        navigate("/admin/blogs");
      } else {
        toast.error(response.message || "Failed to create blog post");
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      toast.error("Failed to create blog post");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsDraft = () => {
    setFormData((prev) => ({ ...prev, status: "draft" }));
    setTimeout(() => {
      document.getElementById("blog-form").requestSubmit();
    }, 100);
  };

  const handlePublish = () => {
    setFormData((prev) => ({ ...prev, status: "published" }));
    setTimeout(() => {
      document.getElementById("blog-form").requestSubmit();
    }, 100);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Create Blog Post</h1>
          <p className="text-gray-600">Write and publish a new blog post</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSaveAsDraft}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <FiSave size={16} />
            Save Draft
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <FiEye size={16} />
            Publish
          </button>
        </div>
      </div>

      <form
        id="blog-form"
        onSubmit={handleSubmit}
        className="grid lg:grid-cols-3 gap-6"
      >
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter blog post title..."
            />
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Content *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
              rows={20}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Write your blog post content here... (HTML supported)"
            />
            <p className="text-sm text-gray-500 mt-2">
              You can use HTML tags for formatting. For rich text editing,
              consider integrating a WYSIWYG editor.
            </p>
          </div>

          {/* Excerpt */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <label
              htmlFor="excerpt"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Excerpt
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief description of the blog post (optional - will be auto-generated if left empty)"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Featured Image */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Featured Image
            </label>
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                >
                  <FiX size={16} />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <FiUpload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <label htmlFor="featured_image" className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-700">
                    Upload an image
                  </span>
                  <input
                    type="file"
                    id="featured_image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Category */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              // required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() +
                    category.slice(1).replace("-", " ")}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tags
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter tags separated by commas"
            />
            <p className="text-sm text-gray-500 mt-1">
              Separate multiple tags with commas
            </p>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Settings</h3>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_featured"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="is_featured"
                  className="ml-2 text-sm text-gray-700"
                >
                  Featured post
                </label>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              Newsletter
            </h3>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="send_to_newsletter"
                  checked={sendToNewsletter}
                  onChange={(e) => setSendToNewsletter(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="send_to_newsletter"
                  className="ml-2 text-sm text-gray-700"
                >
                  Send to newsletter subscribers when published
                </label>
              </div>

              {sendToNewsletter && (
                <div>
                  <label
                    htmlFor="newsletter_subject"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Newsletter Subject (Optional)
                  </label>
                  <input
                    type="text"
                    id="newsletter_subject"
                    value={newsletterSubject}
                    onChange={(e) => setNewsletterSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Custom newsletter subject (defaults to blog title)"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Leave empty to use "New Blog Post: [Blog Title]"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">SEO</h3>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="meta_title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Meta Title
                </label>
                <input
                  type="text"
                  id="meta_title"
                  name="meta_title"
                  value={formData.meta_title}
                  onChange={handleInputChange}
                  maxLength={60}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="SEO title (max 60 chars)"
                />
              </div>

              <div>
                <label
                  htmlFor="meta_description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Meta Description
                </label>
                <textarea
                  id="meta_description"
                  name="meta_description"
                  value={formData.meta_description}
                  onChange={handleInputChange}
                  maxLength={160}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="SEO description (max 160 chars)"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
