import { useState } from "react";
import { FiMail, FiCheck, FiX } from "react-icons/fi";
import toast from "react-hot-toast";

export default function NewsletterWidget({ 
  source = "widget",
  compact = false,
  className = "",
  placeholder = "Your email",
  buttonText = "Subscribe"
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/v1/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          source,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubscribed(true);
        setEmail("");
        if (!compact) {
          toast.success(data.message);
        }
      } else {
        setError(data.message || "Failed to subscribe to newsletter");
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      setError("Failed to subscribe. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (subscribed) {
    return (
      <div className={`${compact ? 'p-3' : 'p-4'} bg-green-50 border border-green-200 rounded-lg ${className}`}>
        <div className="flex items-center">
          <FiCheck className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
          <div>
            <p className={`text-green-800 font-medium ${compact ? 'text-sm' : 'text-base'}`}>
              Subscribed!
            </p>
            {!compact && (
              <p className="text-green-700 text-sm">
                Check your email for confirmation.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${compact ? 'p-3' : 'p-4'} bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {!compact && (
        <div className="flex items-center mb-3">
          <FiMail className="w-5 h-5 text-accent-600 mr-2" />
          <h3 className="font-semibold text-gray-900">Stay Updated</h3>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent-500 focus:border-transparent outline-none transition-all ${
              error ? 'border-red-300' : ''
            } ${compact ? 'text-sm' : ''}`}
            disabled={loading}
          />
          {error && (
            <div className="flex items-center mt-1">
              <FiX className="w-4 h-4 text-red-500 mr-1" />
              <p className="text-red-600 text-xs">{error}</p>
            </div>
          )}
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-accent-500 hover:bg-accent-600 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            compact ? 'py-2 text-sm' : 'py-2.5'
          }`}
        >
          {loading ? "Subscribing..." : buttonText}
        </button>
      </form>
      
      {!compact && (
        <p className="text-xs text-gray-500 mt-2">
          Get property insights and exclusive deals. Unsubscribe anytime.
        </p>
      )}
    </div>
  );
}
