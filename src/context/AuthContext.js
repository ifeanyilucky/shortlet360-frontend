import { createContext } from "react";

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  role: null,
  updateProfile: () => Promise.resolve(),
  changePassword: () => Promise.resolve(),
};

export const AuthContext = createContext({
  ...initialState,
  method: "jwt",
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  updateProfile: () => Promise.resolve(),
  changePassword: () => Promise.resolve(),
});
