import api from "../config/axios";
import { getAccessToken, saveUserData } from "../stores/authStore";

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

// Register verify
export async function registerVerify(email, code) {
  try {
    const response = await api.post("/api/user/register-verify", {
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

// Login
export async function login(email, password) {
  try {
    const response = await api.post("/api/user/login", {
      email,
      password,
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

// Upload photo
export async function uploadPhoto(profilePhoto, coverPhoto) {
  try {
    const formData = new FormData();

    const addFile = async (uri, fieldName, fileName) => {
      const fileExtension = uri.split(".").pop() || "jpg";
      const mimeType = `image/${fileExtension}`;
      const normalizedUri = uri.startsWith("file://") ? uri : `file://${uri}`;

      formData.append(fieldName, {
        uri: normalizedUri,
        name: `${fileName}.${fileExtension}`,
        type: mimeType,
      });
    };

    if (profilePhoto) await addFile(profilePhoto, "profilePhoto", "profile");
    if (coverPhoto) await addFile(coverPhoto, "coverPhoto", "cover");

    const response = await api.patch("/api/user/upload-photo", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        // Authorization: `Bearer ${await getAccessToken()}`,
      },
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

// Refresh token
export async function refresh() {
  try {
    const response = await api.post("/api/user/refresh");
    const data = response.data;
    // Save user data to localstorage
    if (data.status)
      await saveUserData(data.result.user, data.result.accessToken);

    return data.result.accessToken;
  } catch (error) {
    throw error.response?.data?.message;
  }
}

// edit profile
export async function editProfile() {
  try {
    const response = await api.patch("/api/user/edit-profile");
    const data = response.data;

    return data;
  } catch (error) {
    throw error.response?.data?.message;
  }
}
