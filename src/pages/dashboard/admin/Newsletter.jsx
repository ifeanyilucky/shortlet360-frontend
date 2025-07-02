import { useState, useEffect } from "react";
import {
  FiMail,
  FiUsers,
  FiTrendingUp,
  FiSend,
  FiSearch,
  FiFilter,
  FiDownload,
  FiTrash2,
} from "react-icons/fi";
import { format } from "date-fns";
import { newsletterService } from "../../../services/api";
import toast from "react-hot-toast";

export default function AdminNewsletter() {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({});
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: "",
    source: "",
    search: "",
  });
  const [newsletterForm, setNewsletterForm] = useState({
    subject: "",
    content: "",
    html_content: "",
    use_template: true,
  });
  const [sendingNewsletter, setSendingNewsletter] = useState(false);

  const fetchStats = async () => {
    try {
      const response = await newsletterService.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Error fetching newsletter stats:", error);
    }
  };

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const response = await newsletterService.getAllSubscribers(filters);
      if (response.success) {
        setSubscribers(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      toast.error("Failed to fetch subscribers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === "subscribers") {
      fetchSubscribers();
    }
  }, [activeTab, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filtering
    }));
  };

  const handleExportSubscribers = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append("status", filters.status);
      if (filters.source) queryParams.append("source", filters.source);

      const response = await fetch(
        `/api/v1/newsletter/subscribers/export?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = `newsletter-subscribers-${
          new Date().toISOString().split("T")[0]
        }.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success("Subscribers exported successfully!");
      } else {
        toast.error("Failed to export subscribers");
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export subscribers");
    }
  };

  const handleSendNewsletter = async (e) => {
    e.preventDefault();

    if (!newsletterForm.subject || !newsletterForm.content) {
      toast.error("Subject and content are required");
      return;
    }

    setSendingNewsletter(true);
    try {
      const response = await newsletterService.sendNewsletter(newsletterForm);
      if (response.success) {
        toast.success(response.message);
        setNewsletterForm({ subject: "", content: "", html_content: "" });
      } else {
        toast.error(response.message || "Failed to send newsletter");
      }
    } catch (error) {
      console.error("Error sending newsletter:", error);
      toast.error("Failed to send newsletter");
    } finally {
      setSendingNewsletter(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = "blue" }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Newsletter Management
        </h1>
        <p className="text-gray-600">Manage subscribers and send newsletters</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "overview", label: "Overview", icon: FiTrendingUp },
            { id: "subscribers", label: "Subscribers", icon: FiUsers },
            { id: "send", label: "Send Newsletter", icon: FiSend },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={FiUsers}
              title="Active Subscribers"
              value={stats.total_active_subscribers || 0}
              color="green"
            />
            <StatCard
              icon={FiMail}
              title="Total Unsubscribed"
              value={stats.total_unsubscribed || 0}
              color="red"
            />
            <StatCard
              icon={FiTrendingUp}
              title="Recent Subscribers"
              value={stats.recent_subscribers || 0}
              subtitle="Last 30 days"
              color="blue"
            />
          </div>

          {/* Subscribers by Source */}
          {stats.subscribers_by_source &&
            stats.subscribers_by_source.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">
                  Subscribers by Source
                </h3>
                <div className="space-y-3">
                  {stats.subscribers_by_source.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between items-center"
                    >
                      <span className="capitalize text-gray-700">
                        {item._id.replace("_", " ")}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}

      {/* Subscribers Tab */}
      {activeTab === "subscribers" && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                <div className="relative">
                  <FiSearch
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Search by email..."
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="unsubscribed">Unsubscribed</option>
                </select>

                <select
                  value={filters.source}
                  onChange={(e) => handleFilterChange("source", e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Sources</option>
                  <option value="landing_page">Landing Page</option>
                  <option value="blog">Blog</option>
                  <option value="admin">Admin</option>
                </select>

                <button
                  onClick={() =>
                    setFilters({
                      page: 1,
                      limit: 10,
                      status: "",
                      source: "",
                      search: "",
                    })
                  }
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Clear Filters
                </button>
              </div>

              {/* Export Button */}
              <div className="flex gap-2">
                <button
                  onClick={handleExportSubscribers}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 whitespace-nowrap"
                >
                  <FiDownload size={16} />
                  Export CSV
                </button>
              </div>
            </div>
          </div>

          {/* Subscribers Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subscribed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                      </td>
                    </tr>
                  ) : subscribers.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No subscribers found
                      </td>
                    </tr>
                  ) : (
                    subscribers.map((subscriber) => (
                      <tr key={subscriber._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {subscriber.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              subscriber.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {subscriber.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                          {subscriber.source.replace("_", " ")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {format(
                            new Date(subscriber.subscribed_at),
                            "MMM dd, yyyy"
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {subscriber.user
                            ? `${subscriber.user.first_name} ${subscriber.user.last_name}`
                            : "Guest"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.total_pages > 1 && (
              <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing{" "}
                    {(pagination.current_page - 1) * pagination.items_per_page +
                      1}{" "}
                    to{" "}
                    {Math.min(
                      pagination.current_page * pagination.items_per_page,
                      pagination.total_items
                    )}{" "}
                    of {pagination.total_items} results
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        handleFilterChange("page", pagination.current_page - 1)
                      }
                      disabled={pagination.current_page === 1}
                      className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() =>
                        handleFilterChange("page", pagination.current_page + 1)
                      }
                      disabled={
                        pagination.current_page === pagination.total_pages
                      }
                      className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Send Newsletter Tab */}
      {activeTab === "send" && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <form onSubmit={handleSendNewsletter} className="space-y-6">
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                value={newsletterForm.subject}
                onChange={(e) =>
                  setNewsletterForm((prev) => ({
                    ...prev,
                    subject: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter newsletter subject..."
                required
              />
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Content *
              </label>
              <textarea
                id="content"
                rows={10}
                value={newsletterForm.content}
                onChange={(e) =>
                  setNewsletterForm((prev) => ({
                    ...prev,
                    content: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter newsletter content (HTML supported)..."
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                You can use HTML tags for formatting. An unsubscribe link will
                be automatically added.
              </p>
            </div>

            {/* Template Toggle */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="use_template"
                checked={newsletterForm.use_template}
                onChange={(e) =>
                  setNewsletterForm((prev) => ({
                    ...prev,
                    use_template: e.target.checked,
                  }))
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="use_template"
                className="ml-2 text-sm text-gray-700"
              >
                Use Aplet360 newsletter template (recommended)
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                This newsletter will be sent to{" "}
                {stats.total_active_subscribers || 0} active subscribers.
              </div>
              <button
                type="submit"
                disabled={sendingNewsletter}
                className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSend size={16} />
                {sendingNewsletter ? "Sending..." : "Send Newsletter"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
