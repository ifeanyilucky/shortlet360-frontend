import { useEffect, useReducer } from "react";
import PropTypes from "prop-types";
// utils
import { useNavigate } from "react-router-dom";
import { isValidToken, setSession } from "../utils/jwt";
import API, {
  register as registerApi,
  signin,
  forgotPassword,
  resetPassword,
  account,
} from "../utils/axios";

import { AuthContext } from "./AuthContext";
import { authService } from "../services/api";
// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  role: null,
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user, role } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
      role,
    };
  },
  LOGIN: (state, action) => {
    const { user, role } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
      role,
    };
  },
  UPDATE: (state, action) => {
    const { user, role } = action.payload;
    return {
      ...state,
      isAuthenticated: true,
      user,
      role,
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
  REGISTER: (state, action) => {
    const { user, role } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
      role,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem("accessToken");

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);
          const { data } = await account();
          const { user } = data;
          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: true,
              user,
              role: user.role,
            },
          });
        } else {
          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: false,
              user: null,
              role: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: "INITIALIZE",
          payload: {
            isAuthenticated: false,
            user: null,
            role: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const login = async (payload) => {
    const { data } = await signin(payload);

    const { token, user, requiresPayment } = data;

    setSession(token);
    dispatch({
      type: "LOGIN",
      payload: {
        user: { ...user, requiresPayment },
        role: user.role,
      },
    });

    // If user requires payment, redirect to payment page
    if (requiresPayment) {
      navigate("/auth/registration-payment");
    } else {
      // Redirect to appropriate dashboard based on role
      if (user.role === "owner") {
        navigate("/owner/dashboard");
      } else if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    }

    // Return the response data so the login page can access it
    return data;
  };

  const register = async (payload) => {
    const response = await registerApi(payload);
    const { token, user, requiresPayment } = response.data;

    window.localStorage.setItem("accessToken", token);
    dispatch({
      type: "REGISTER",
      payload: {
        user: { ...user, requiresPayment },
        role: user.role,
      },
    });

    // If user requires payment, redirect to payment page
    if (requiresPayment) {
      navigate("/auth/registration-payment");
    } else {
      // Redirect to appropriate dashboard based on role
      if (user.role === "owner") {
        navigate("/owner/dashboard");
      } else if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    }

    return response;
  };

  const logout = async () => {
    setSession(null);
    dispatch({ type: "LOGOUT" });
  };

  const forgotPassword = async (payload) => {
    await authService.forgotPassword(payload);
  };

  const resetPassword = async (payload, token) => {
    await authService.resetPassword(token, payload);
  };

  const changePassword = async (payload) => {
    await authService.changePassword(payload);
  };
  const updateProfile = async (payload) => {
    const { user } = await authService.editProfile(payload);

    dispatch({
      type: "UPDATE",
      payload: {
        user,
        role: user.role,
      },
    });
    return user;
  };

  // Function to update user after registration payment
  const setUser = (updatedUser) => {
    dispatch({
      type: "UPDATE",
      payload: {
        user: updatedUser,
        role: updatedUser.role,
      },
    });
  };

  // Register admin user
  const registerAdmin = async (payload) => {
    // Check if admin code is valid (you can implement this check in your backend)
    const adminCode = payload.adminCode;
    // delete payload.adminCode; // Remove adminCode from payload before sending to API
    delete payload.confirmPassword; // Remove confirmPassword from payload

    // Call the admin registration API endpoint
    const response = await API.post("/auth/admin/register", {
      ...payload,
      adminCode,
    });

    return response;
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: "jwt",
        login,
        logout,
        register,
        registerAdmin,
        resetPassword,
        forgotPassword,
        updateProfile,
        changePassword,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
