import { create } from "zustand";
import { tenantService } from "../services/api";

const useTenantStore = create((set, get) => ({
  tenants: [],
  tenant: null,
  pagination: null,
  isLoading: false,
  error: null,

  // Get all tenants (for property owners)
  getTenants: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tenantService.getAllTenants(params);
      console.log("response", response);
      set({
        tenants: response.data,
        pagination: response.pagination,
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({
        error: error.message || "Failed to fetch tenants",
        isLoading: false,
      });
      throw error;
    }
  },

  // Get specific tenant
  getTenant: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tenantService.getTenant(id);
      set({
        tenant: response.data,
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({
        error: error.message || "Failed to fetch tenant",
        isLoading: false,
      });
      throw error;
    }
  },

  // Create new tenant
  createTenant: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tenantService.createTenant(data);
      set({ isLoading: false });
      return response;
    } catch (error) {
      set({
        error: error.message || "Failed to create tenant",
        isLoading: false,
      });
      throw error;
    }
  },

  // Update tenant status
  updateTenantStatus: async (id, status) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tenantService.updateTenantStatus(id, status);
      // Update the tenant in the list
      const { tenants } = get();
      const updatedTenants = tenants.map((tenant) =>
        tenant._id === id ? { ...tenant, ...status } : tenant
      );
      set({
        tenants: updatedTenants,
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({
        error: error.message || "Failed to update tenant status",
        isLoading: false,
      });
      throw error;
    }
  },

  // Add rent payment
  addRentPayment: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tenantService.addRentPayment(id, data);
      // Update the tenant in the list
      const { tenants } = get();
      const updatedTenants = tenants.map((tenant) =>
        tenant._id === id ? response.data : tenant
      );
      set({
        tenants: updatedTenants,
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({
        error: error.message || "Failed to add rent payment",
        isLoading: false,
      });
      throw error;
    }
  },

  // Add maintenance request
  addMaintenanceRequest: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tenantService.addMaintenanceRequest(id, data);
      // Update the tenant in the list
      const { tenants } = get();
      const updatedTenants = tenants.map((tenant) =>
        tenant._id === id ? response.data : tenant
      );
      set({
        tenants: updatedTenants,
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({
        error: error.message || "Failed to add maintenance request",
        isLoading: false,
      });
      throw error;
    }
  },

  // Update maintenance request
  updateMaintenanceRequest: async (id, requestId, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tenantService.updateMaintenanceRequest(
        id,
        requestId,
        data
      );
      // Update the tenant in the list
      const { tenants } = get();
      const updatedTenants = tenants.map((tenant) =>
        tenant._id === id ? response.data : tenant
      );
      set({
        tenants: updatedTenants,
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({
        error: error.message || "Failed to update maintenance request",
        isLoading: false,
      });
      throw error;
    }
  },

  // Get tenant statistics
  getTenantStatistics: async (timeframe) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tenantService.getTenantStatistics(timeframe);
      set({ isLoading: false });
      return response;
    } catch (error) {
      set({
        error: error.message || "Failed to fetch tenant statistics",
        isLoading: false,
      });
      throw error;
    }
  },

  // Get user's tenants
  getUserTenants: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tenantService.getUserTenants(params);

      set({
        tenants: response.data,
        pagination: response.pagination,
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({
        error: error.message || "Failed to fetch user tenants",
        isLoading: false,
      });
      throw error;
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Reset store
  reset: () => {
    set({
      tenants: [],
      tenant: null,
      pagination: null,
      isLoading: false,
      error: null,
    });
  },
}));

export default useTenantStore;
