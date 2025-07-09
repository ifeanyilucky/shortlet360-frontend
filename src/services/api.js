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
  validateDiscountCode: async (code, amount) => {
    const response = await api.post("/auth/validate-discount-code", {
      code,
      amount,
    });
    return response.data;
  },
  completeRegistrationPayment: async (paymentData, discountCode = null) => {
    const requestData = {
      payment: paymentData,
    };

    if (discountCode) {
      requestData.discount_code = discountCode;
    }

    const response = await api.post(
      "/auth/complete-registration-payment",
      requestData
    );
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
  // Image upload methods
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

  // Video upload methods
  uploadVideo: async (formData) => {
    const response = await api.post("/upload/video/single", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 300000, // 5 minutes timeout for video uploads
    });
    return response.data;
  },
  uploadVideos: async (formData) => {
    const response = await api.post("/upload/video/multiple", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 600000, // 10 minutes timeout for multiple video uploads
    });
    return response.data;
  },

  // Mixed media upload methods
  uploadMedia: async (formData) => {
    const response = await api.post("/upload/media/multiple", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 600000, // 10 minutes timeout for mixed media uploads
    });
    return response.data;
  },

  // Utility method to create FormData for single file
  createSingleFileFormData: (file, fieldName = "file") => {
    const formData = new FormData();
    formData.append(fieldName, file);
    return formData;
  },

  // Utility method to create FormData for multiple files
  createMultipleFilesFormData: (files, fieldName = "files") => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append(fieldName, file);
    });
    return formData;
  },

  // Helper method to validate file types
  validateFileType: (file, allowedTypes) => {
    return allowedTypes.some((type) => file.type.startsWith(type));
  },

  // Helper method to validate file size
  validateFileSize: (file, maxSizeInMB) => {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return file.size <= maxSizeInBytes;
  },

  // Predefined validation methods
  isValidImage: (file) => {
    return (
      uploadService.validateFileType(file, ["image/"]) &&
      uploadService.validateFileSize(file, 5)
    ); // 5MB limit for images
  },

  isValidVideo: (file) => {
    return (
      uploadService.validateFileType(file, ["video/"]) &&
      uploadService.validateFileSize(file, 100)
    ); // 100MB limit for videos
  },

  isValidMedia: (file) => {
    return (
      uploadService.validateFileType(file, ["image/", "video/"]) &&
      uploadService.validateFileSize(file, 100)
    ); // 100MB limit for mixed media
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
  submitInspectionRequest: async (data) => {
    const response = await api.post("/forms/inspection-request", data);
    return response.data;
  },
  submitPropertyManagementForm: async (data) => {
    const response = await api.post("/forms/property-management", data);
    return response.data;
  },
  submitRNPLWaitlistForm: async (data) => {
    const response = await api.post("/forms/rnpl-waitlist", data);
    return response.data;
  },
};

export const referralService = {
  sendReferralInvitation: async (data) => {
    const response = await api.post("/referral/send-invitation", data);
    return response.data;
  },
  getReferralStats: async () => {
    const response = await api.get("/referral/stats");
    return response.data;
  },
  // Admin endpoints
  getAllReferrals: async (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value);
      }
    });
    const response = await api.get(
      `/referral/admin/all?${queryParams.toString()}`
    );
    return response.data;
  },
  getReferralById: async (id) => {
    const response = await api.get(`/referral/admin/${id}`);
    return response.data;
  },
  getReferralAnalytics: async () => {
    const response = await api.get("/referral/admin/analytics");
    return response.data;
  },
};

export const blogService = {
  getCategories: async () => {
    const response = await api.get("/blog/categories");
    return response.data;
  },
  createBlog: async (data) => {
    const response = await api.post("/blog", data);
    return response.data;
  },
  getAllBlogs: async (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value);
      }
    });
    const response = await api.get(`/blog?${queryParams.toString()}`);
    return response.data;
  },
  getBlog: async (id) => {
    const response = await api.get(`/blog/${id}`);
    return response.data;
  },
  updateBlog: async (id, data) => {
    const response = await api.put(`/blog/${id}`, data);
    return response.data;
  },
  getTags: async () => {
    const response = await api.get("/blog/tags");
    return response.data;
  },
  getStats: async () => {
    const response = await api.get("/blog/stats");
    return response.data;
  },
  deleteBlog: async (id) => {
    const response = await api.delete(`/blog/${id}`);
    return response.data;
  },
  getBlogBySlug: async (slug) => {
    const response = await api.get(`/blog/slug/${slug}`);
    return response.data;
  },
};

export const adminFormService = {
  getAllFormSubmissions: async (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value);
      }
    });
    const response = await api.get(`/admin/forms?${queryParams.toString()}`);
    return response.data;
  },
  getFormSubmissionStats: async () => {
    const response = await api.get("/admin/forms/stats");
    return response.data;
  },
  getFormSubmissionById: async (id) => {
    const response = await api.get(`/admin/forms/${id}`);
    return response.data;
  },
  updateFormSubmissionStatus: async (id, data) => {
    const response = await api.put(`/admin/forms/${id}`, data);
    return response.data;
  },
};

export const newsletterService = {
  subscribe: async (data) => {
    const response = await api.post("/newsletter/subscribe", data);
    return response.data;
  },
  unsubscribe: async (token) => {
    const response = await api.get(`/newsletter/unsubscribe?token=${token}`);
    return response.data;
  },
  getAllSubscribers: async (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value);
      }
    });
    const response = await api.get(
      `/newsletter/subscribers?${queryParams.toString()}`
    );
    return response.data;
  },
  getStats: async () => {
    const response = await api.get("/newsletter/stats");
    return response.data;
  },
  sendNewsletter: async (data) => {
    const response = await api.post("/newsletter/send", data);
    return response.data;
  },
  exportSubscribers: async (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value);
      }
    });
    const response = await api.get(
      `/newsletter/subscribers/export?${queryParams.toString()}`,
      {
        responseType: "blob",
      }
    );
    return response.data;
  },
};
