import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/api";
import usePostStore from "../store/postStore";
import PostFeed from "../components/PostFeed";
import { config } from "../config";
import { useParams } from "react-router-dom";
import SubscriptionModal from "../components/SubscriptionModal";
import useWalletStore from "../store/walletStore";
const SOCIAL_LINKS_CONFIG = {
  facebook: {
    baseUrl: "https://facebook.com/",
    icon: "mdi:facebook",
    bgColor: "bg-blue-600",
    label: "Facebook",
  },
  instagram: {
    baseUrl: "https://instagram.com/",
    icon: "mdi:instagram",
    bgColor: "bg-red-600",
    label: "Instagram",
  },
  twitter: {
    baseUrl: "https://twitter.com/",
    icon: "mdi:twitter",
    bgColor: "bg-sky-500",
    label: "Twitter",
  },
  linkedin: {
    baseUrl: "https://linkedin.com/in/",
    icon: "mdi:linkedin",
    bgColor: "bg-blue-700",
    label: "LinkedIn",
  },
};

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("posts");
  const [userProfile, setUserProfile] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { posts, loadPosts } = usePostStore();
  const [openSubscription, setOpenSubscription] = useState(true);
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [openSubscriptionModal, setOpenSubscriptionModal] = useState(null);
  const { wallet, getWallet, isLoading: isLoadingWallet } = useWalletStore();

  const getUserProfile = async () => {
    try {
      const response = await userService.getUserProfile(username);
      setUserProfile(response.user);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserProfile();
    getWallet();
    loadPosts();
  }, [username]);

  const handleShare = () => {
    navigator.share({
      title: `${userProfile?.displayName || userProfile?.username}'s profile`,
      text: `Check out their profile on ${config.app_name}`,
      url: `${config.base_url}/${userProfile?.username}`,
    });
  };

  return (
    <div className="w-full mx-auto">
      {isLoading || isLoadingWallet ? (
        <div className="flex justify-center items-center h-screen">
          <div className="w-16 h-16 bg-gray-100 rounded-full animate-pulse"></div>
        </div>
      ) : (
        <>
          {/* Cover Photo and Profile Section */}
          <div className="relative">
            {/* Cover Photo */}
            <div className="h-48 w-full bg-primary relative">
              {userProfile?.coverPhoto ? (
                <img
                  src={userProfile?.coverPhoto}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary" />
              )}
              {/* Back Button */}
              <div className="flex items-center justify-center">
                <button
                  onClick={() => navigate(-1)}
                  className="absolute top-4 left-4 p-2 rounded-full bg-white/50 hover:bg-white/80 transition-colors"
                >
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
                <button
                  onClick={handleShare}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/50 hover:bg-white/80 transition-colors"
                >
                  <Icon icon="hugeicons:share-01" fontSize={20} />
                </button>
              </div>
            </div>

            {/* Profile Info Section - Overlapping the cover photo */}
            <div className="relative px-4 pb-4 -mt-10">
              <div className="bg-transparent rounded-lg p-4">
                <div className="flex items-start justify-between">
                  {/* Avatar - Moved up to overlap cover photo */}
                  <div className="flex items-start space-x-4">
                    <button className="transform -translate-y-6">
                      {userProfile?.avatar ? (
                        <img
                          src={userProfile?.avatar}
                          alt="Profile"
                          className="w-24 h-24 rounded-full object-cover border-4 border-white"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white flex items-center justify-center">
                          <Icon fontSize={48} icon="ph:user" />
                        </div>
                      )}
                    </button>
                  </div>
                </div>
                <div className="mt-0">
                  <h2 className="text-xl font-semibold">
                    {userProfile?.displayName || userProfile?.username}
                  </h2>
                  <div className="flex items-center space-x-5">
                    <p className="text-gray-600">@{userProfile?.username}</p>
                    <div className="flex items-center mt-1">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm text-gray-600">Active</span>
                    </div>
                  </div>
                  <div className="text-gray-600 my-2">{userProfile?.about}</div>
                  {/* social media links */}
                  <div className="flex items-center space-x-2 mt-4 flex-wrap gap-2">
                    {userProfile?.socialLinks &&
                      Object.entries(userProfile.socialLinks).map(
                        ([platform, username]) => {
                          if (!username || !SOCIAL_LINKS_CONFIG[platform])
                            return null;

                          const config = SOCIAL_LINKS_CONFIG[platform];
                          return (
                            <a
                              key={platform}
                              href={`${config.baseUrl}${username}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-1 bg-gray-100 p-1 rounded-full pr-3"
                            >
                              <div
                                className={`${config.bgColor} p-1 rounded-full h-6 w-6 flex items-center justify-center`}
                              >
                                <Icon
                                  icon={config.icon}
                                  fontSize={20}
                                  color="white"
                                />
                              </div>
                              <span className="text-sm">{config.label}</span>
                            </a>
                          );
                        }
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Subscription section */}
          {userProfile?.isSubscribed ? (
            <div className="mt-0 px-4 max-w-2xl mx-auto">
              <div className="bg-green-500 text-white py-3 px-6 rounded-full mb-6 flex items-center justify-between">
                <span>Subscribed</span>
                <Icon fontSize={24} icon="heroicons:check-circle" />
              </div>
            </div>
          ) : (
            <div className="mt-0 px-4 max-w-2xl mx-auto">
              <div className="">
                <h3 className="text-lg mb-6">Subscriptions</h3>

                {/* Subscribe button */}
                <button
                  onClick={() => setOpenSubscription(!openSubscription)}
                  className="w-full bg-purple-700 text-white py-3 px-6 rounded-full mb-6 flex items-center justify-between"
                >
                  <span className="">Subscribe</span>
                  <div className="flex items-center space-x-1">
                    <span className="">Now</span>
                    <Icon fontSize={24} icon="heroicons:chevron-down" />
                  </div>
                </button>
                {userProfile?.pricing && (
                  <>
                    {/* Subscription tiers */}
                    <div className="space-y-3">
                      {userProfile?.pricing.map((tier) => (
                        <button
                          onClick={() => setOpenSubscriptionModal(tier)}
                          key={tier.noOfMonths}
                          className="bg-pink-50 w-full rounded-full py-4 px-6 flex items-center justify-between"
                        >
                          <span className="">{tier.noOfMonths} month(s)</span>
                          <div className="">
                            ₦{tier.amount}
                            {tier.discount > 0 && (
                              <span className="ml-2">
                                ({tier.discount}% discount)
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="mt-8 border-b">
            <div className="flex w-full justify-center">
              <button
                className={`px-6 py-3 font-medium ${
                  activeTab === "posts"
                    ? "border-b-2 border-primary text-primary"
                    : "text-gray-600"
                }`}
                onClick={() => setActiveTab("posts")}
              >
                {posts?.length || 0} Posts
              </button>
              <button
                className={`px-6 py-3 font-medium ${
                  activeTab === "media"
                    ? "border-b-2 border-primary text-primary"
                    : "text-gray-600"
                }`}
                onClick={() => setActiveTab("media")}
              >
                NO MEDIA
              </button>
            </div>
          </div>

          {activeTab === "posts" && (
            <>
              {/* Posts */}
              {posts?.length > 0 ? (
                <PostFeed posts={posts} />
              ) : (
                <div className="mt-12 text-center">
                  {/* Empty State */}
                  <div className="max-w-xs mx-auto">
                    <div className="flex justify-center space-x-4 mb-6">
                      <div className="w-16 h-16 bg-gray-100 rounded"></div>
                      <div className="w-16 h-16 bg-gray-100 rounded"></div>
                      <div className="w-16 h-16 bg-gray-100 rounded"></div>
                    </div>
                    <p className="text-gray-500">No posts yet</p>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {openSubscriptionModal && (
        <SubscriptionModal
          tier={openSubscriptionModal}
          handleCancel={() => setOpenSubscriptionModal(null)}
          isOpen={!!openSubscriptionModal}
          wallet={wallet}
          user={userProfile}
        />
      )}
    </div>
  );
}
