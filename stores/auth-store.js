import * as SecureStore from "expo-secure-store";
import api from "@/api/axios";

// const BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL;
// const USER_API_URL = `${BASE_URL}/api/user`;

export async function saveUserData(user, accessToken) {
  await SecureStore.setItemAsync("user", JSON.stringify(user));
  await SecureStore.setItemAsync("accessToken", accessToken);
}

export async function getUserData() {
  const user = await SecureStore.getItemAsync("user");
  return user ? JSON.parse(user) : null;
}

export async function getAccessToken() {
  return await SecureStore.getItemAsync("accessToken");
}

export async function clearUserData() {
  await SecureStore.deleteItemAsync("user");
  await SecureStore.deleteItemAsync("accessToken");
}

// Start api
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
    throw error;
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
    throw error;
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
    throw error;
  }
}

// export async function register(name, username, email, password) {
//   try {
//     const response = await api.post(`${USER_API_URL}/register`, {
//       name,
//       username,
//       email,
//       password,
//     });
//     console.log(response);
//     console.log(response.data);
//     console.log(response.data.result);

//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// }

// // Setup axios instance with auth header automatically
// export async function axiosInstance() {
//   const token = await getAccessToken();

//   const instance = axios.create({
//     baseURL: API_URL,
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//     withCredentials: true, // important for refresh token cookie
//   });

//   // Response interceptor to handle 401 and refresh token
//   instance.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//       if (error.response?.status === 401) {
//         // Try refreshing token
//         const success = await refreshAccessToken();
//         if (success) {
//           error.config.headers.Authorization = `Bearer ${await getAccessToken()}`;
//           return instance(error.config); // retry original request
//         }
//       }
//       return Promise.reject(error);
//     }
//   );

//   return instance;
// }

// // Refresh access token using refresh token cookie
// async function refreshAccessToken() {
//   try {
//     const response = await axios.get(`${API_URL}/api/user/refresh`, {
//       withCredentials: true,
//     });
//     const { accessToken, user } = response.data;

//     await saveUserData(user, accessToken);
//     return true;
//   } catch (e) {
//     await clearUserData();
//     return false;
//   }
// }
