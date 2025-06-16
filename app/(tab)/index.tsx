import { Alert } from "react-native";
import React, { useState } from "react";
import { ThemedButton } from "@/components/ThemedButton";
import { getAccessToken } from "@/storage/authStorage";
import { ThemedText } from "@/components/ThemedText";
import { refresh } from "@/api/user";
import { ThemedView } from "@/components/ThemedView";

export default function Chat() {
  const [localToken, setLocalToken] = useState<string | null>("");
  const [refreshToken, setRefreshToken] = useState<string | null>("");

  const handleRefresh = async () => {
    try {
      const newToken = await refresh();
      setRefreshToken(newToken);
    } catch (error: any) {
      Alert.alert("Error", error);
    }
  };

  const handleGetLocalStoredToken = async () => {
    try {
      const token = await getAccessToken();
      setLocalToken(token);
    } catch (error: any) {
      Alert.alert("Error", error);
    }
  };
  const handleEditProfile = async () => {
    try {
      // const data = await editProfile();
      // console.log(data);
    } catch (error: any) {
      Alert.alert("Error", error);
    }
  };

  return (
    <ThemedView style={{ flex: 1, justifyContent: "center" }}>
      <ThemedButton
        style={{ alignSelf: "center", padding: 10 }}
        title="Get localstored token"
        isLoading={false}
        onPress={handleGetLocalStoredToken}
      />
      <ThemedButton
        style={{ alignSelf: "center", marginTop: 40, padding: 10 }}
        title="Refresh"
        isLoading={false}
        onPress={handleRefresh}
      />
      <ThemedButton
        style={{ alignSelf: "center", marginTop: 40, padding: 10 }}
        title="Edit Profile"
        isLoading={false}
        onPress={handleEditProfile}
      />
      <ThemedText style={{ alignSelf: "center", marginTop: 40 }}>
        Local token is .... {localToken}
      </ThemedText>
      <ThemedText style={{ alignSelf: "center", marginTop: 40 }}>
        Refreshed token is .... {refreshToken}
      </ThemedText>
    </ThemedView>
  );
}
