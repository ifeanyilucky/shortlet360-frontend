import { create } from "zustand";
import { bookingService } from "../services/api";

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
}));
