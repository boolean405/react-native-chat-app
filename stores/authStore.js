import api from "@/config/axios";
import * as SecureStore from "expo-secure-store";

export async function saveUserData(user, accessToken) {
  await SecureStore.setItemAsync("user", JSON.stringify(user));
  await SecureStore.setItemAsync("accessToken", accessToken);
}

export async function getUserData() {
  const user = await SecureStore.getItemAsync("user");
  return user ? JSON.parse(user) : null;
}

export async function saveAccessToken(accessToken) {
  return await SecureStore.setItemAsync("accessToken", accessToken);
}

export async function getAccessToken() {
  return await SecureStore.getItemAsync("accessToken");
}

export async function clearUserData() {
  await SecureStore.deleteItemAsync("user");
  await SecureStore.deleteItemAsync("accessToken");
}

// export async function getAccessToken() {
//   let accessToken = await SecureStore.getItemAsync("accessToken");
//   if (!accessToken) return null;

//   try {
//     // Check if token is expired
//     const decoded = JSON.parse(atob(accessToken.split(".")[1]));
//     const isExpired = Date.now() >= decoded.exp * 1000;
//     if (!isExpired) {
//       console.log("Token is not expired, old token", accessToken);
//       return accessToken;
//     }else{
//       console.log("Token is expired,");

//     }
//   } catch (e) {}

// // Refresh token
// const BASE_URL = process.env.EXPO_PUBLIC_SERVER_URL;
// const response = await api.post(`${BASE_URL}/api/user/refresh`);
// const data = response.data;
// await SecureStore.setItemAsync("accessToken", data.result.accessToken);
// console.log("Token is expired, new token", data.result.accessToken);

// return data.result.accessToken;
//   return accessToken;
// }
