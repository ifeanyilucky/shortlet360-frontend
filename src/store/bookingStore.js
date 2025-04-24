import { create } from "zustand";
import { bookingService } from "../services/api";
import { toast } from "react-hot-toast";
import axiosInstance from "@utils/axios";

export const bookingStore = create((set) => ({
  bookings: [],
  booking: null,
  pagination: null,
  isLoading: false,
  error: null,

  getBookings: async (params = {}) => {
    try {
      set({ isLoading: true });
      const response = await bookingService.getAllBookings(params);
      set({
        bookings: response.data.data,
        pagination: response.data.pagination,
        error: null,
      });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  getBooking: async (id) => {
    try {
      set({ isLoading: true });
      const response = await bookingService.getBooking(id);
      set({ booking: response.data, error: null });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateBookingStatus: async (id, status) => {
    try {
      set({ isLoading: true });
      const response = await bookingService.updateBookingStatus(id, status);
      set((state) => ({
        bookings: state.bookings.map((booking) =>
          booking._id === id ? response.data : booking
        ),
        error: null,
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  getUserBookings: async () => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.get("/bookings/user");
      set({ bookings: response.data.data });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch bookings",
      });
      toast.error(error.response?.data?.message || "Failed to fetch bookings");
    } finally {
      set({ isLoading: false });
    }
  },

  cancelBooking: async (bookingId) => {
    try {
      set({ isLoading: true });
      await axiosInstance.patch(`/bookings/${bookingId}/status`, {
        booking_status: "cancelled",
      });
      toast.success("Booking cancelled successfully");
      // Refresh bookings list
      const response = await axiosInstance.get("/bookings/user");
      set({ bookings: response.data.data });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to cancel booking",
      });
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    } finally {
      set({ isLoading: false });
    }
  },
}));
