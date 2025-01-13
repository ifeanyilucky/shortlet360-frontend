import { useState } from "react";
import { Icon } from "@iconify/react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
export default function MyProfile() {
  const [activeTab, setActiveTab] = useState("posts");
  const { user } = useAuth();
  const navigate = useNavigate();
  //   const user = {
  //     name: "Justin",
  //     username: "@u453946439",
  //     status: "Available",
  //     avatar: "Ju", // This will be the fallback if no image is available
  //   };

  return (
    <div className="w-full mx-auto">
      {/* Header with back button */}
      <div className="flex items-center p-4 border-b">
        <button className="p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h1 className="text-xl font-semibold ml-4">
          {user?.name || user?.username}
        </h1>
      </div>

      {/* Profile Section */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          {/* Avatar */}
          <div className="flex items-start space-x-4">
            <button>
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                  <Icon fontSize={40} icon="ph:user" />
                </div>
              )}
            </button>

            <div className="mt-2">
              <h2 className="text-xl font-semibold">
                {user.displayName || user?.username}
              </h2>
              <p className="text-gray-600">@{user.username}</p>
              <div className="flex items-center mt-1">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm text-gray-600">Active</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => navigate("/settings/profile")}
              className="flex items-center px-4 py-2 rounded-full border border-primary text-primary"
            >
              <Icon icon="ph:pencil-bold" />
              <span className="ml-2">EDIT PROFILE</span>
            </button>
            <button className="p-2 rounded-full border border-gray-300">
              <Icon icon="ph:share-bold" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 border-b">
          <div className="flex w-full justify-center">
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === "posts"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("posts")}
            >
              NO POSTS
            </button>
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === "media"
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("media")}
            >
              NO MEDIA
            </button>
          </div>
        </div>

        {/* Empty State */}
        <div className="mt-12 text-center">
          <div className="max-w-xs mx-auto">
            <div className="flex justify-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gray-100 rounded"></div>
              <div className="w-16 h-16 bg-gray-100 rounded"></div>
              <div className="w-16 h-16 bg-gray-100 rounded"></div>
            </div>
            <p className="text-gray-500">No posts yet</p>
          </div>
        </div>
      </div>
    </div>
  );
}
