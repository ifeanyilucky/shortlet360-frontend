import { create } from "zustand";
import { kycService } from "../services/kycService";
import toast from "react-hot-toast";

export const useKycStore = create((set, get) => ({
  kycStatus: null,
  requiredTiers: [],
  overallStatus: "incomplete",
  isLoading: false,
  error: null,

  // Get KYC status
  getKycStatus: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await kycService.getKycStatus();
      set({
        kycStatus: response.kyc,
        requiredTiers: response.requiredTiers,
        overallStatus: response.overallStatus,
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch KYC status",
        isLoading: false,
      });
      toast.error(
        error.response?.data?.message || "Failed to fetch KYC status"
      );
      throw error;
    }
  },

  // Tier 1 verification (email and phone)
  initiateTier1Verification: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await kycService.initiateTier1Verification();
      set((state) => ({
        kycStatus: response.kyc,
        isLoading: false,
      }));
      toast.success("Verification email sent successfully");
      return response;
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Failed to initiate verification",
        isLoading: false,
      });
      toast.error(
        error.response?.data?.message || "Failed to initiate verification"
      );
      throw error;
    }
  },

  initiatePhoneVerification: async (phoneNumber) => {
    try {
      set({ isLoading: true, error: null });
      const response = await kycService.initiatePhoneVerification(phoneNumber);
      set((state) => ({
        kycStatus: response.kyc,
        isLoading: false,
      }));
      toast.success("Phone number verified successfully");
      return response;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to verify phone number",
        isLoading: false,
      });
      toast.error(
        error.response?.data?.message || "Failed to verify phone number"
      );
      throw error;
    }
  },

  // This method is kept for backward compatibility but is no longer used
  verifyPhoneNumber: async (verificationCode) => {
    try {
      set({ isLoading: true, error: null });
      toast.error(
        "This verification method is no longer supported. Please use phone verification directly."
      );
      set({ isLoading: false });
      throw new Error("This verification method is no longer supported");
    } catch (error) {
      set({
        error: "This verification method is no longer supported",
        isLoading: false,
      });
      throw error;
    }
  },

  // Tier 1 verification (phone and NIN)
  submitTier1Verification: async (data, setUser) => {
    try {
      set({ isLoading: true, error: null });
      const response = await kycService.submitTier1Verification(data);
      set((state) => ({
        kycStatus: response.kyc,
        isLoading: false,
      }));

      // Update user in auth context if setUser function is provided and user data is returned
      if (setUser && response.user) {
        setUser(response.user);
      }

      toast.success("Tier 1 verification submitted successfully");
      return response;
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Failed to submit Tier 1 verification",
        isLoading: false,
      });
      toast.error(
        error.response?.data?.message || "Failed to submit Tier 1 verification"
      );
      throw error;
    }
  },

  // Tier 2 verification (address only)
  submitTier2Verification: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const response = await kycService.submitTier2Verification(data);
      set((state) => ({
        kycStatus: response.kyc,
        isLoading: false,
      }));
      toast.success("Tier 2 verification submitted successfully");
      return response;
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Failed to submit Tier 2 verification",
        isLoading: false,
      });
      toast.error(
        error.response?.data?.message || "Failed to submit Tier 2 verification"
      );
      throw error;
    }
  },

  // Tier 3 verification (employment and bank statement)
  submitTier3Verification: async (data) => {
    try {
      set({ isLoading: true, error: null });
      const response = await kycService.submitTier3Verification(data);
      set((state) => ({
        kycStatus: response.kyc,
        isLoading: false,
      }));
      toast.success("Tier 3 verification submitted successfully");
      return response;
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Failed to submit Tier 3 verification",
        isLoading: false,
      });
      toast.error(
        error.response?.data?.message || "Failed to submit Tier 3 verification"
      );
      throw error;
    }
  },

  // Reset KYC store
  resetKycStore: () => {
    set({
      kycStatus: null,
      requiredTiers: [],
      overallStatus: "incomplete",
      isLoading: false,
      error: null,
    });
  },
}));

export default useKycStore;
