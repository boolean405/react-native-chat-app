import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL;
// const API_URL = `${BASE_URL}/api/user`;

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
