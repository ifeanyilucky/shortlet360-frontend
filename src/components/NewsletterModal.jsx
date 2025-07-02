import { useState, useEffect } from "react";
import { FiX, FiMail, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";

export default function NewsletterModal({ 
  isOpen, 
  onClose, 
  source = "modal",
  title = "Stay in the Loop!",
  description = "Get the latest property insights, market updates, and exclusive deals delivered to your inbox.",
  trigger = null // Can be 'scroll', 'time', 'exit', etc.
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  // Auto-close modal after successful subscription
  useEffect(() => {
    if (subscribed) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [subscribed, onClose]);

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
        toast.success(data.message);
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

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FiX size={24} />
        </button>

        <div className="p-6">
          {subscribed ? (
            // Success state
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Thank You for Subscribing!
              </h3>
              <p className="text-gray-600 mb-4">
                Check your email for a confirmation message. We'll keep you updated with the latest from Aplet360.
              </p>
              <p className="text-sm text-gray-500">
                This window will close automatically in a few seconds.
              </p>
            </div>
          ) : (
            // Subscription form
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiMail className="w-8 h-8 text-accent-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {title}
                </h3>
                <p className="text-gray-600">
                  {description}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent outline-none transition-all ${
                      error ? 'border-red-300' : ''
                    }`}
                    disabled={loading}
                  />
                  {error && (
                    <p className="text-red-600 text-sm mt-1">{error}</p>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-accent-500 hover:bg-accent-600 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Subscribing..." : "Subscribe Now"}
                </button>
              </form>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  By subscribing, you agree to receive marketing emails from Aplet360. 
                  You can unsubscribe at any time.
                </p>
              </div>

              <div className="mt-4 text-center">
                <button
                  onClick={onClose}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  No thanks, maybe later
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
