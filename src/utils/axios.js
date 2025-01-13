import axios from "axios";
import { config } from "../config";

const API = axios.create({ baseURL: config.api });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("accessToken")) {
    req.headers.Authorization = `Bearer ${localStorage.getItem("accessToken")}`;
  }
  return req;
});

//  AUTH
export const signin = (values) => API.post("/auth/login", values);
export const register = (values) => API.post("/auth/register", values);
export const forgotPassword = (values) =>
  API.post("/auth/forgot-password", values);
export const resetPassword = (values, token) =>
  API.put(`/auth/reset-password/${token}`, values);
export const account = () => API.get(`/auth/profile`);
export const updateProfile = (values) =>
  API.patch(`/auth/profile/edit`, { ...values });
export const changePassword = (values) =>
  API.patch("/auth/account/change-password", values);

export default API;
