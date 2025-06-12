import api from "../config/axios";
import { saveUserData } from "../stores/authStore";

// const BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL;
// const USER_API_URL = `${BASE_URL}/api/user`;

// Check user exist or not
export async function existEmail(email) {
  try {
    const response = await api.get("/api/user/exist-email", {
      params: {
        email,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message;
  }
}

// Check username exist or not
export async function existUsername(username) {
  try {
    const response = await api.get("/api/user/exist-username", {
      params: {
        username,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message;
  }
}

// Register
export async function register(name, username, email, password) {
  try {
    const response = await api.post("/api/user/register", {
      name,
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message;
  }
}

// Verify email
export async function registerVerify(email, code) {
  try {
    const response = await api.post("/api/user/verify", {
      email,
      code,
    });
    const data = response.data;
    // Save user data to localstorage
    if (data.status)
      await saveUserData(data.result.user, data.result.accessToken);

    return data;
  } catch (error) {
    throw error.response?.data?.message;
  }
}

// Forgot password
export async function forgotPassword(email) {
  try {
    const response = await api.post("/api/user/forgot-password", {
      email,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message;
  }
}

// Forgot password verify
export async function forgotPasswordVerify(email, code) {
  try {
    const response = await api.post("/api/user/forgot-password-verify", {
      email,
      code,
    });

    return response.data;
  } catch (error) {
    throw error.response?.data?.message;
  }
}

// Reset password
export async function resetPassword(email, password) {
  try {
    const response = await api.patch("/api/user/reset-password", {
      email,
      newPassword: password,
    });
    const data = response.data;
    // Save user data to localstorage
    if (data.status)
      await saveUserData(data.result.user, data.result.accessToken);

    return data;
  } catch (error) {
    throw error.response?.data?.message;
  }
}
