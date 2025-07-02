import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FiCheck, FiX, FiMail } from "react-icons/fi";

export default function NewsletterUnsubscribe() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribe = async () => {
      const token = searchParams.get("token");
      const email = searchParams.get("email");

      if (!token && !email) {
        setStatus("error");
        setMessage("Invalid unsubscribe link. Please check your email for the correct link.");
        return;
      }

      try {
        const queryParams = new URLSearchParams();
        if (token) queryParams.append("token", token);
        if (email) queryParams.append("email", email);

        const response = await fetch(`/api/v1/newsletter/unsubscribe?${queryParams.toString()}`);
        const data = await response.json();

        if (data.success) {
          setStatus("success");
          setMessage(data.message);
        } else {
          setStatus("error");
          setMessage(data.message || "Failed to unsubscribe from newsletter");
        }
      } catch (error) {
        console.error("Unsubscribe error:", error);
        setStatus("error");
        setMessage("An error occurred while unsubscribing. Please try again later.");
      }
    };

    unsubscribe();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4">
            {status === "loading" && (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            )}
            {status === "success" && (
              <div className="bg-green-100 rounded-full p-4">
                <FiCheck className="h-8 w-8 text-green-600" />
              </div>
            )}
            {status === "error" && (
              <div className="bg-red-100 rounded-full p-4">
                <FiX className="h-8 w-8 text-red-600" />
              </div>
            )}
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {status === "loading" && "Processing..."}
            {status === "success" && "Unsubscribed Successfully"}
            {status === "error" && "Unsubscribe Failed"}
          </h2>

          <p className="text-gray-600 mb-8">
            {status === "loading" && "Please wait while we process your unsubscribe request."}
            {message}
          </p>

          {status === "success" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <FiMail className="h-5 w-5 text-green-600 mr-2" />
                <p className="text-sm text-green-800">
                  You have been successfully unsubscribed from our newsletter. 
                  You will no longer receive marketing emails from Aplet360.
                </p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">
                If you continue to have issues, please contact our support team at{" "}
                <a href="mailto:support@aplet360.com" className="underline">
                  support@aplet360.com
                </a>
              </p>
            </div>
          )}

          <div className="space-y-4">
            <a
              href="/"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-900 hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              Return to Aplet360
            </a>

            {status === "success" && (
              <p className="text-xs text-gray-500">
                Changed your mind?{" "}
                <a href="/#newsletter" className="text-primary-600 hover:text-primary-500 underline">
                  Subscribe again
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
