import api from "../utils/axios";

// Auth services
export const authService = {
  register: async (data) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },
  editProfile: async (data) => {
    const response = await api.patch("/auth/profile", data);
    return response.data;
  },
  changePassword: async (data) => {
    const response = await api.patch("/auth/change-password", data);
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  verifyEmail: async (token) => {
    const response = await api.get(`/auth/verify-email/${token}`);
    return response.data;
  },

  resetPassword: async (token, data) => {
    const response = await api.post(`/auth/reset-password/${token}`, data);
    return response.data;
  },
  forgotPassword: async (data) => {
    const response = await api.post("/auth/forgot-password", data);
    return response.data;
  },
  completeRegistrationPayment: async (paymentData) => {
    const response = await api.post("/auth/complete-registration-payment", {
      payment: paymentData,
    });
    return response.data;
  },
};

export const propertyService = {
  addProperty: async (data) => {
    const response = await api.post("/property", data);
    return response.data;
  },
  getAllProperties: async (params = {}) => {
    console.log("params", params);
    try {
      // Convert params object to URL query string
      const queryParams = new URLSearchParams();

      // Handle all params including filter params
      Object.entries(params).forEach(([key, value]) => {
        // Skip null, undefined, empty strings, and "All Types"
        if (
          value !== undefined &&
          value !== null &&
          value !== "" &&
          value !== "All Types"
        ) {
          queryParams.append(key, value);
        }
      });

      const response = await api.get(`/property?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching properties:", error);
      throw error;
    }
  },
  getProperty: async (id) => {
    const response = await api.get(`/property/${id}`);
    return response.data;
  },
  updateProperty: async (id, data) => {
    const response = await api.put(`/property/${id}`, data);
    return response.data;
  },
  checkAvailability: async (id) => {
    const response = await api.post(`/property/${id}/check-availability`);
    return response.data;
  },
  getOwnerStatistics: async () => {
    const response = await api.get("/property/statistics");
    return response.data;
  },
  getRecentActivity: async () => {
    const response = await api.get("/property/recent-activity");
    return response.data;
  },
  getPropertyReviews: async (id) => {
    const response = await api.get(`/property/${id}/reviews`);
    return response.data;
  },
};

export const bookingService = {
  createBooking: async (data) => {
    const response = await api.post("/booking", data);
    return response.data;
  },
  getUserBookings: async () => {
    return await api.get("/bookings/user");
  },
  updateBookingStatus: async (id, status) => {
    return await api.patch(`/booking/${id}/status`, {
      booking_status: status,
    });
  },
  getPropertyAvailability: async (propertyId) => {
    return await api.get(`/booking/availability/${propertyId}`);
  },
  getAllBookings: async (params = {}) => {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value);
      }
    });

    return await api.get(`/booking?${queryParams.toString()}`);
  },
  getBooking: async (id) => {
    return (await api.get(`/booking/${id}`)).data;
  },
  getUserStatistics: (timeframe) => {
    return api.get(
      `/booking/user/statistics${timeframe ? `?timeframe=${timeframe}` : ""}`
    );
  },
  updatePropertyUnavailableDates: async (propertyId, data) => {
    return await api.put(`/property/${propertyId}/unavailable-dates`, data);
  },
};

export const uploadService = {
  uploadImages: async (formData) => {
    const response = await api.post("/upload/multiple", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  uploadImage: async (data) => {
    const response = await api.post("/upload/single", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

export const formService = {
  submitHomeServiceForm: async (data) => {
    const response = await api.post("/forms/home-service", data);
    return response.data;
  },
  submitBecomeArtisanForm: async (data) => {
    const response = await api.post("/forms/become-artisan", data);
    return response.data;
  },
  submitContactForm: async (data) => {
    const response = await api.post("/forms/contact", data);
    return response.data;
  },
  submitDisputeResolutionForm: async (data) => {
    const response = await api.post("/forms/dispute-resolution", data);
    return response.data;
  },
};
