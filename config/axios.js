import axios from "axios";

import { getAccessToken } from "@/storage/authStorage";

const BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL;
// const API_URL = `${BASE_URL}/api/user`;

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach access token to all requests
api.interceptors.request.use(async (config) => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default api;
