import api from "../utils/axios";

export const kycService = {
  // Get KYC status
  getKycStatus: async () => {
    const response = await api.get("/kyc/status");
    return response.data;
  },

  // Tier 1 verification (email and phone)
  initiateTier1Verification: async () => {
    const response = await api.post("/kyc/tier1/initiate");
    return response.data;
  },

  initiatePhoneVerification: async (phoneNumber) => {
    const response = await api.post("/kyc/tier1/initiate-phone", {
      phone_number: phoneNumber,
    });
    return response.data;
  },

  // This method is kept for backward compatibility but is no longer used
  verifyPhoneNumber: async (verificationCode) => {
    const response = await api.post("/kyc/tier1/verify-phone", {
      verification_code: verificationCode,
    });
    return response.data;
  },

  verifyEmail: async (token) => {
    const response = await api.get(`/kyc/verify-email/${token}`);
    return response.data;
  },

  // Tier 1 verification (phone and NIN)
  submitTier1Verification: async (data) => {
    const response = await api.post("/kyc/tier1/submit", data);
    return response.data;
  },

  // Tier 2 verification (utility bill upload)
  submitTier2Verification: async (formData) => {
    const response = await api.post("/kyc/tier2/submit", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Tier 3 verification (BVN, bank account, and business verification)
  submitTier3Verification: async (data) => {
    const response = await api.post("/kyc/tier3/submit", data);
    return response.data;
  },
};

export default kycService;
