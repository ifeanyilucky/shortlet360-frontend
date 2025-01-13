import { create } from "zustand";
import { bookingService } from "../services/api";

export const userStore = create((set) => ({
  statistics: null,
  isLoading: false,
  error: null,

  getUserStatistics: async (timeframe) => {
    try {
      set({ isLoading: true, error: null });
      const response = await bookingService.getUserStatistics(timeframe);
      set({ statistics: response.data.data, isLoading: false });
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Error fetching user statistics",
        isLoading: false,
      });
    }
  },
}));
