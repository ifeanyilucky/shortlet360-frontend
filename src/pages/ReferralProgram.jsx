import { useState, useEffect } from "react";
import {
  FiUsers,
  FiGift,
  FiTool,
  FiSend,
  FiCopy,
  FiCheck,
  FiTrendingUp,
  FiClock,
  FiAward,
} from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { referralService } from "../services/api";

export default function ReferralProgram() {
  const { isAuthenticated, user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [referralEmail, setReferralEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referralStats, setReferralStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Generate referral code and link
  const currentYear = new Date().getFullYear();
  const referralCode = isAuthenticated
    ? referralStats?.referralCode ||
      `APLET-${user?.short_id || "REF"}-${currentYear}`
    : `APLET-REF-${currentYear}`;
  const referralLink = `${window.location.origin}/auth/register?ref=${referralCode}`;

  // Fetch referral statistics
  useEffect(() => {
    if (isAuthenticated) {
      fetchReferralStats();
    }
  }, [isAuthenticated]);

  const fetchReferralStats = async () => {
    try {
      setLoadingStats(true);
      const response = await referralService.getReferralStats();
      setReferralStats(response.data);
    } catch (error) {
      console.error("Error fetching referral stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral link copied to clipboard!");
    setTimeout(() => setCopied(false), 3000);
  };

  const handleReferralSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await referralService.sendReferralInvitation({
        email: referralEmail,
      });

      toast.success(`Invitation sent to ${referralEmail} successfully!`);
      setReferralEmail("");
    } catch (error) {
      console.error("Error sending referral invitation:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to send invitation. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    {
      icon: <FiUsers className="h-8 w-8 text-primary-900" />,
      title: "Invite Friends",
      description:
        "Share your unique referral link with landlords, property managers, and potential tenants looking for rental or shortlet apartments.",
    },
    {
      icon: <FiGift className="h-8 w-8 text-primary-900" />,
      title: "They Sign Up & Verify",
      description:
        "When they register using your referral link and complete their account verification, you both qualify for Home Fix service rewards.",
    },
    {
      icon: <FiTool className="h-8 w-8 text-primary-900" />,
      title: "Earn Home Fix Services",
      description:
        "Get free Home Fix services for home repairs and maintenance - no cash, just valuable services when you need them most.",
    },
  ];

  const rewards = [
    "Get 1 FREE Home Fix service for every 5 landlords/property managers you refer who verify their accounts",
    "Get 1 FREE Home Fix service for every 20 tenants/users you refer who verify their accounts",
    "Free Home Fix services include plumbing, electrical work, painting, carpentry, and general repairs",
    "No cash rewards - we reward you with the valuable services you actually need for your home",
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Referral Program
          </h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Refer friends to Aplet360 and earn FREE Home Fix services - fix that
            leaking roof or broken door without paying for it!
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="bg-tertiary-50 p-6 rounded-lg text-center"
              >
                <div className="flex justify-center mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-tertiary-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Referral Statistics Section - Only show for authenticated users */}
      {isAuthenticated && referralStats && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl font-bold mb-12 text-center">
              Your Referral Performance
            </h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">
                      Total Referrals
                    </p>
                    <h3 className="text-2xl font-bold text-blue-800">
                      {referralStats.totalReferrals}
                    </h3>
                  </div>
                  <FiUsers className="text-blue-600 text-2xl" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">
                      Verified Referrals
                    </p>
                    <h3 className="text-2xl font-bold text-green-800">
                      {referralStats.verifiedReferrals}
                    </h3>
                  </div>
                  <FiCheck className="text-green-600 text-2xl" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-600 font-medium">
                      Pending Verification
                    </p>
                    <h3 className="text-2xl font-bold text-yellow-800">
                      {referralStats.pendingReferrals}
                    </h3>
                  </div>
                  <FiClock className="text-yellow-600 text-2xl" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 font-medium">
                      Earned Rewards
                    </p>
                    <h3 className="text-2xl font-bold text-purple-800">
                      {referralStats.earnedRewards}
                    </h3>
                  </div>
                  <FiAward className="text-purple-600 text-2xl" />
                </div>
              </div>
            </div>

            {/* Reward Breakdown */}
            {referralStats.rewardBreakdown && (
              <div className="bg-tertiary-50 p-6 rounded-lg mb-8">
                <h3 className="text-lg font-semibold mb-4">Reward Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Owner Referrals</p>
                    <p className="text-lg font-semibold">
                      {referralStats.rewardBreakdown.ownerReferrals} referrals ={" "}
                      {referralStats.rewardBreakdown.ownerRewards} rewards
                    </p>
                    <p className="text-xs text-gray-500">
                      1 reward per 5 owner referrals
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600">User Referrals</p>
                    <p className="text-lg font-semibold">
                      {referralStats.rewardBreakdown.userReferrals} referrals ={" "}
                      {referralStats.rewardBreakdown.userRewards} rewards
                    </p>
                    <p className="text-xs text-gray-500">
                      1 reward per 20 user referrals
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Referrals */}
            {referralStats.recentReferrals &&
              referralStats.recentReferrals.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold">Recent Referrals</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {referralStats.recentReferrals.map((referral) => (
                          <tr key={referral.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {referral.referredUser?.first_name}{" "}
                                  {referral.referredUser?.last_name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {referral.referredUser?.email}
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  referral.role === "owner"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {referral.role === "owner"
                                  ? "Property Owner"
                                  : "User"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  referral.status === "verified"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {referral.status === "verified"
                                  ? "Verified"
                                  : "Pending"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(
                                referral.createdAt
                              ).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
          </div>
        </section>
      )}

      {/* Referral Link Section */}
      <section className="py-16 bg-tertiary-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Your Referral Link
            </h2>

            {isAuthenticated ? (
              <>
                <p className="text-tertiary-600 mb-8 text-center">
                  Share this link with landlords and tenants to earn FREE Home
                  Fix services when they sign up and verify their accounts on
                  Aplet360.
                </p>
                <div className="flex items-center mb-8">
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="flex-grow px-4 py-2 border border-tertiary-300 rounded-l-md focus:ring-primary-900 focus:border-primary-900"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-white bg-primary-900 hover:bg-primary-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-900"
                  >
                    {copied ? (
                      <FiCheck className="h-5 w-5" />
                    ) : (
                      <FiCopy className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <div className="border-t border-tertiary-200 pt-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Send Invitation by Email
                  </h3>
                  <form
                    onSubmit={handleReferralSubmit}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <input
                      type="email"
                      value={referralEmail}
                      onChange={(e) => setReferralEmail(e.target.value)}
                      placeholder="Friend's email address"
                      required
                      className="flex-grow px-4 py-2 border border-tertiary-300 rounded-md sm:rounded-r-none focus:ring-primary-900 focus:border-primary-900"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center px-6 py-2 border border-transparent rounded-md sm:rounded-l-none shadow-sm text-white bg-primary-900 hover:bg-primary-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-900 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          <FiSend className="mr-2" /> Send Invitation
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <p className="text-tertiary-600 mb-6">
                  Please log in or create an account to get your unique referral
                  link and start earning rewards.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link
                    to="/auth/login"
                    className="inline-flex items-center justify-center px-6 py-2 border border-primary-900 rounded-md shadow-sm text-primary-900 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-900"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/auth/register"
                    className="inline-flex items-center justify-center px-6 py-2 border border-transparent rounded-md shadow-sm text-white bg-primary-900 hover:bg-primary-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-900"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Rewards Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Rewards</h2>
            <p className="text-lg text-tertiary-600 max-w-3xl mx-auto">
              Here&apos;s how you can earn FREE Home Fix services through our
              referral program - real value for your home maintenance needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rewards.map((reward, index) => (
              <div
                key={index}
                className="flex items-start p-4 bg-tertiary-50 rounded-lg"
              >
                <div className="flex-shrink-0 mr-3">
                  <FiGift className="h-6 w-6 text-primary-900" />
                </div>
                <p className="text-tertiary-700">{reward}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Terms and Conditions */}
      <section className="py-16 bg-tertiary-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Terms & Conditions
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <ul className="list-disc pl-5 space-y-2 text-tertiary-700">
              <li>
                Home Fix service rewards are only issued after your referred
                friend completes their account verification and KYC process.
              </li>
              <li>
                Both the referrer and the referred friend must have active and
                verified accounts on Aplet360.
              </li>
              <li>
                Free Home Fix services must be redeemed within 12 months of
                earning them.
              </li>
              <li>
                Home Fix services are subject to availability and must be
                scheduled through Aplet360&apos;s ApletFix platform.
              </li>
              <li>
                Aplet360 reserves the right to modify or terminate the referral
                program at any time.
              </li>
              <li>
                Home Fix service rewards cannot be exchanged for cash or
                combined with other promotional offers.
              </li>
              <li>
                Users found abusing the referral program will have their
                accounts suspended and forfeit all earned rewards.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
