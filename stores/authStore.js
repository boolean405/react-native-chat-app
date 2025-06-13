import * as SecureStore from "expo-secure-store";

export async function saveUserData(user, accessToken) {
  await SecureStore.setItemAsync("user", JSON.stringify(user));
  await SecureStore.setItemAsync("accessToken", accessToken);
}

export async function getUserData() {
  const user = await SecureStore.getItemAsync("user");
  return user ? JSON.parse(user) : null;
}

// export async function saveAccessToken(accessToken) {
//   return await SecureStore.setItemAsync("accessToken", accessToken);
// }

export async function getAccessToken() {
  return await SecureStore.getItemAsync("accessToken");
}

export async function clearUserData() {
  await SecureStore.deleteItemAsync("user");
  await SecureStore.deleteItemAsync("accessToken");
}
