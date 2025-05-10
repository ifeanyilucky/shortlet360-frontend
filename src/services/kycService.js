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

  verifyPhoneNumber: async (phoneNumber) => {
    const response = await api.post("/kyc/tier1/verify-phone", { phone_number: phoneNumber });
    return response.data;
  },

  verifyEmail: async (token) => {
    const response = await api.get(`/kyc/verify-email/${token}`);
    return response.data;
  },

  // Tier 2 verification (address and identity)
  submitTier2Verification: async (data) => {
    const response = await api.post("/kyc/tier2/submit", data);
    return response.data;
  },

  // Tier 3 verification (employment and bank statement)
  submitTier3Verification: async (data) => {
    const response = await api.post("/kyc/tier3/submit", data);
    return response.data;
  }
};

export default kycService;
