import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "@utils/axios";

export const favoriteStore = create((set) => ({
  favorites: [],
  isLoading: false,
  error: null,

  getFavorites: async () => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.get("/favorites");
      set({ favorites: response.data.favorites });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch favorites",
      });
      // toast.error(error.response?.data?.message || "Failed to fetch favorites");
    } finally {
      set({ isLoading: false });
    }
  },

  addToFavorites: async (propertyId) => {
    try {
      set({ isLoading: true });
      await axiosInstance.post("/favorites", { propertyId });
      toast.success("Added to favorites");
      // Refresh favorites list
      const response = await axiosInstance.get("/favorites");
      set({ favorites: response.data.favorites });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to add to favorites",
      });
      toast.error(
        error.response?.data?.message || "Failed to add to favorites"
      );
    } finally {
      set({ isLoading: false });
    }
  },

  removeFromFavorites: async (propertyId) => {
    try {
      set({ isLoading: true });
      await axiosInstance.delete(`/favorites/${propertyId}`);
      toast.success("Removed from favorites");
      // Refresh favorites list
      const response = await axiosInstance.get("/favorites");
      set({ favorites: response.data.favorites });
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Failed to remove from favorites",
      });
      toast.error(
        error.response?.data?.message || "Failed to remove from favorites"
      );
    } finally {
      set({ isLoading: false });
    }
  },
}));
