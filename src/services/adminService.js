import api from "../utils/axios";
import { config } from "../config";

const adminService = {
  // Dashboard
  getDashboardStats: () => {
    return api.get(`/admin/dashboard`);
  },

  // User Management
  getAllUsers: (params) => {
    return api.get(`/admin/users`, { params });
  },

  getUserById: (id) => {
    return api.get(`/admin/users/${id}`);
  },

  updateUser: (id, data) => {
    return api.patch(`/admin/users/${id}`, data);
  },

  deleteUser: (id) => {
    return api.delete(`/admin/users/${id}`);
  },

  verifyUser: (id) => {
    return api.patch(`/admin/users/${id}/verify`);
  },

  activateUser: (id) => {
    return api.patch(`/admin/users/${id}/activate`);
  },

  // Property Management
  getAllProperties: (params) => {
    return api.get(`/admin/properties`, { params });
  },

  getPropertyById: (id) => {
    return api.get(`/admin/properties/${id}`);
  },

  updateProperty: (id, data) => {
    return api.patch(`/admin/properties/${id}`, data);
  },

  deleteProperty: (id) => {
    return api.delete(`/admin/properties/${id}`);
  },

  activateProperty: (id, isActive) => {
    return api.patch(`/admin/properties/${id}/activate`, {
      is_active: isActive,
    });
  },

  updatePublicationStatus: (id, status) => {
    return api.patch(`/property/${id}/publication-status`, {
      publication_status: status,
    });
  },

  // Booking Management
  getAllBookings: (params) => {
    return api.get(`/admin/bookings`, { params });
  },

  getBookingById: (id) => {
    return api.get(`/admin/bookings/${id}`);
  },

  updateBookingStatus: (id, status) => {
    return api.patch(`/admin/bookings/${id}/status`, {
      booking_status: status,
    });
  },

  // KYC Verification Management
  getPendingKycVerifications: (params) => {
    return api.get(`/admin/kyc/pending`, { params });
  },

  updateTier1Verification: (userId, status) => {
    return api.patch(`/admin/kyc/${userId}/tier1`, { status });
  },

  updateTier2Verification: (userId, data) => {
    return api.patch(`/admin/kyc/${userId}/tier2`, data);
  },

  updateTier3Verification: (userId, data) => {
    return api.patch(`/admin/kyc/${userId}/tier3`, data);
  },
};

export default adminService;
