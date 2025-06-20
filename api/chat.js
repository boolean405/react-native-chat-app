import api from "@/config/axios";
import { jwtDecode } from "jwt-decode";

import {
  getAccessToken,
  getUserData,
  saveUserData,
} from "../storage/authStorage";
import { refresh } from "@/api/user";

export async function getAllChats() {
  try {
    await refresh();
    const response = await api.get("/api/chat");
    const data = response.data;
    return data;
  } catch (error) {
    const message = error.response?.data?.message || "Something went wrong";
    const customError = new Error(message);
    customError.status = error.response?.status;
    throw customError;
  }
}

// Delete chat
export async function deleteChat(chatId) {
  try {
    await refresh();
    const response = await api.patch("/api/chat/delete-chat", {
      chatId,
    });
    const data = response.data;
    return data;
  } catch (error) {
    const message = error.response?.data?.message || "Something went wrong";
    const customError = new Error(message);
    customError.status = error.response?.status;
    throw customError;
  }
}

// Create group chat
export async function createGroup(name, userIds) {
  try {
    await refresh();
    const response = await api.post("/api/chat/create-group", {
      name,
      userIds,
    });

    const data = response.data;
    return data;
  } catch (error) {
    const message = error.response?.data?.message || "Something went wrong";
    const customError = new Error(message);
    customError.status = error.response?.status;
    throw customError;
  }
}
// Leave group
export async function leaveGroup(groupId) {
  try {
    await refresh();
    const response = await api.patch("/api/chat/leave-group", {
      groupId,
    });
    const data = response.data;
    return data;
  } catch (error) {
    const message = error.response?.data?.message || "Something went wrong";
    const customError = new Error(message);
    customError.status = error.response?.status;
    throw customError;
  }
}

// Create or open chat
export async function createOrOpen(receiverId) {
  try {
    await refresh();
    const response = await api.post("/api/chat", {
      receiverId,
    });
    const data = response.data;
    return data;
  } catch (error) {
    const message = error.response?.data?.message || "Something went wrong";
    const customError = new Error(message);
    customError.status = error.response?.status;
    throw customError;
  }
}
