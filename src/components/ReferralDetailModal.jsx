import { useState, useEffect } from "react";
import {
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiTrendingUp,
  FiUsers,
  FiGift,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { referralService } from "../services/api";
import toast from "react-hot-toast";

export default function ReferralDetailModal({ referralId, isOpen, onClose }) {
  const [referralData, setReferralData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && referralId) {
      fetchReferralDetails();
    }
  }, [isOpen, referralId]);

  const fetchReferralDetails = async () => {
    try {
      setLoading(true);
      const response = await referralService.getReferralById(referralId);
      setReferralData(response.data);
    } catch (error) {
      console.error("Error fetching referral details:", error);
      toast.error("Failed to fetch referral details");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800";
      case "rewarded":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getRoleColor = (role) => {
    return role === "owner" 
      ? "bg-blue-100 text-blue-800" 
      : "bg-green-100 text-green-800";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Referral Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : referralData ? (
          <div className="p-6 space-y-6">
            {/* Referral Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Referrer Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <FiUser className="mr-2" />
                  Referrer Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <FiUser className="mr-2 text-gray-500" size={16} />
                    <span className="font-medium">
                      {referralData.referral.referrer.first_name} {referralData.referral.referrer.last_name}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FiMail className="mr-2 text-gray-500" size={16} />
                    <span>{referralData.referral.referrer.email}</span>
                  </div>
                  {referralData.referral.referrer.phone && (
                    <div className="flex items-center">
                      <FiPhone className="mr-2 text-gray-500" size={16} />
                      <span>{referralData.referral.referrer.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">Referral Code:</span>
                    <span className="font-mono bg-gray-200 px-2 py-1 rounded text-sm">
                      {referralData.referral.referral_code}
                    </span>
                  </div>
                </div>
              </div>

              {/* Referred User Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <FiUsers className="mr-2" />
                  Referred User Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <FiUser className="mr-2 text-gray-500" size={16} />
                    <span className="font-medium">
                      {referralData.referral.referred_user.first_name} {referralData.referral.referred_user.last_name}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FiMail className="mr-2 text-gray-500" size={16} />
                    <span>{referralData.referral.referred_user.email}</span>
                  </div>
                  {referralData.referral.referred_user.phone && (
                    <div className="flex items-center">
                      <FiPhone className="mr-2 text-gray-500" size={16} />
                      <span>{referralData.referral.referred_user.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">Role:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(referralData.referral.referred_user_role)}`}>
                      {referralData.referral.referred_user_role === 'owner' ? 'Property Owner' : 'User'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FiCalendar className="mr-2 text-gray-500" size={16} />
                    <span className="text-sm">
                      Joined: {new Date(referralData.referral.referred_user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Referral Status and Timeline */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">Referral Status & Timeline</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <FiCalendar className="text-blue-500" size={20} />
                  </div>
                  <p className="text-sm text-gray-500">Referred On</p>
                  <p className="font-semibold">{new Date(referralData.referral.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    {referralData.referral.status === 'verified' ? (
                      <FiCheckCircle className="text-green-500" size={20} />
                    ) : (
                      <FiClock className="text-yellow-500" size={20} />
                    )}
                  </div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(referralData.referral.status)}`}>
                    {referralData.referral.status.charAt(0).toUpperCase() + referralData.referral.status.slice(1)}
                  </span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <FiGift className="text-purple-500" size={20} />
                  </div>
                  <p className="text-sm text-gray-500">Reward Earned</p>
                  <p className="font-semibold">₦{referralData.referral.reward_earned || 0}</p>
                </div>
              </div>
            </div>

            {/* Referrer Performance Stats */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <FiTrendingUp className="mr-2" />
                Referrer Performance Overview
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center bg-blue-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-blue-600">{referralData.referrerStats.totalReferrals}</p>
                  <p className="text-sm text-gray-600">Total Referrals</p>
                </div>
                <div className="text-center bg-green-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-green-600">{referralData.referrerStats.verifiedReferrals}</p>
                  <p className="text-sm text-gray-600">Verified</p>
                </div>
                <div className="text-center bg-yellow-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-yellow-600">{referralData.referrerStats.conversionRate}%</p>
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                </div>
                <div className="text-center bg-purple-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-purple-600">₦{referralData.referrerStats.totalRewards}</p>
                  <p className="text-sm text-gray-600">Total Rewards</p>
                </div>
              </div>
            </div>

            {/* Recent Referrals by this Referrer */}
            {referralData.recentReferrals && referralData.recentReferrals.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3">Recent Referrals by this User</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left">Referred User</th>
                        <th className="px-3 py-2 text-left">Role</th>
                        <th className="px-3 py-2 text-left">Status</th>
                        <th className="px-3 py-2 text-left">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {referralData.recentReferrals.map((ref) => (
                        <tr key={ref.id}>
                          <td className="px-3 py-2">
                            {ref.referredUser?.first_name} {ref.referredUser?.last_name}
                          </td>
                          <td className="px-3 py-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(ref.role)}`}>
                              {ref.role === 'owner' ? 'Owner' : 'User'}
                            </span>
                          </td>
                          <td className="px-3 py-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ref.status)}`}>
                              {ref.status.charAt(0).toUpperCase() + ref.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-3 py-2">{new Date(ref.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            No referral data found
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
