import api from "../api/axios";

/**
 * Signup
 * POST /auth/signup
 */
export const signup = async (formData) => {
  const response = await api.post("/auth/signup", formData);
  return response.data;
};

/**
 * Verify Email OTP
 * POST /auth/verify-email
 */
export const verifyEmail = async ({ email, otp }) => {
  const response = await api.post("/auth/verify-email", {
    email,
    otp,
  });

  return response.data;
};

/**
 * Resend OTP
 * POST /auth/resend-otp
 */
export const resendOtp = async (email) => {
  const response = await api.post("/auth/resend-otp", {
    email,
  });

  return response.data;
};

/**
 * Login
 * POST /auth/login
 */
export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

/**
 * Forgot Password
 * POST /auth/forgot-password
 */
export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", {
    email,
  });

  return response.data;
};

/**
 * Reset Password
 * POST /auth/reset-password
 */
export const resetPassword = async ({ token, password }) => {
  const response = await api.post("/auth/reset-password", {
    token,
    password,
  });

  return response.data;
};
