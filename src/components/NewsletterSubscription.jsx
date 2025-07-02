import { useState } from "react";
import { FiMail, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";
import { newsletterService } from "../services/api";

export default function NewsletterSubscription({
  source = "landing_page",
  className = "",
  title = "Stay Updated with Aplet360",
  description = "Get the latest property insights, tips, and exclusive deals delivered to your inbox.",
  placeholder = "Enter your email address",
  buttonText = "Subscribe Now",
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const data = await newsletterService.subscribe({ email, source });

      if (data.success) {
        setSubscribed(true);
        setEmail("");
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to subscribe to newsletter");
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      toast.error("Failed to subscribe. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (subscribed) {
    return (
      <div className={`text-center ${className}`}>
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <FiCheck className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Thank You for Subscribing!
        </h3>
        <p className="text-gray-600">
          Check your email for a confirmation message. We'll keep you updated
          with the latest from Aplet360.
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-100 rounded-full mb-4">
          <FiMail className="w-8 h-8 text-accent-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 max-w-md mx-auto">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent outline-none transition-all"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loading ? "Subscribing..." : buttonText}
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-3 text-center">
          By subscribing, you agree to receive marketing emails from Aplet360.
          You can unsubscribe at any time.
        </p>
      </form>
    </div>
  );
}
