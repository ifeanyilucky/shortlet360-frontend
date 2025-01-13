import { create } from "zustand";
import { propertyService, bookingService } from "../services/api";

export const propertyStore = create((set) => ({
  properties: [],
  pagination: null,
  property: null,
  isLoading: false,
  error: null,
  bookings: [],
  getProperties: async (params = {}) => {
    try {
      set({ isLoading: true });
      const response = await propertyService.getAllProperties(params);
      set({
        properties: response.data,
        pagination: response.pagination,
        error: null,
      });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  addProperty: async (data) => {
    set({ isLoading: true });
    const response = await propertyService.addProperty(data);
    set((state) => ({
      properties: {
        ...state.properties,
        data: [...state.properties, response.data],
      },
      isLoading: false,
    }));
    return response;
  },

  getProperty: async (id) => {
    set((state) => ({ ...state, isLoading: true }));
    const response = await propertyService.getProperty(id);
    return set((state) => ({
      ...state,
      property: response.data,
      isLoading: false,
    }));
  },

  getBooking: async (id) => {
    const response = await bookingService.getBooking(id);
    return set((state) => ({
      ...state,
      booking: response.data,
      isLoading: false,
    }));
  },
  getAllBookings: async (params = {}) => {
    const response = await bookingService.getAllBookings(params);
    return set((state) => ({
      ...state,
      bookings: response.data,
      isLoading: false,
    }));
  },
}));
