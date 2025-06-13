import axios from "axios";
import jwtDecode from "jwt-decode";

import { getAccessToken, saveAccessToken } from "@/stores/authStore";

const BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL;
// const API_URL = `${BASE_URL}/api/user`;

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// // Automatically attach access token to all requests
// api.interceptors.request.use(async (config) => {
//   const accessToken = await getAccessToken();
//   if (accessToken) {
//     config.headers.Authorization = `Bearer ${accessToken}`;
//   }
//   return config;
// });

// Utility to get access token (customize this)

// Decode and check expiry
function isTokenExpired(token) {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (e) {
    return true; // Invalid token = treat as expired
  }
}

// Function to refresh token
async function refreshToken() {
  try {
    const response = await axios.post("https://your-api.com/auth/refresh", {
      refreshToken: localStorage.getItem("refreshToken"),
    });

    const newAccessToken = response.data.accessToken;
    setAccessToken(newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error("Refresh token failed", error);
    // Optionally log out the user here
    throw error;
  }
}

// Request interceptor
api.interceptors.request.use(async (config) => {
  let token = getAccessToken();

  if (!token || isTokenExpired(token)) {
    try {
      token = await refreshToken(); // Refresh and update
    } catch (error) {
      // Token refresh failed – could handle logout here
      return config; // Or return Promise.reject(error)
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
