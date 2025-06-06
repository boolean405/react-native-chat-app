import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { clearUserData, getUserData } from "@/stores/auth-store";

export default function Chat() {
  const [user, setUser] = useState(Object);
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      const saveUser = await getUserData();
      setUser(saveUser);
    }
    loadUser();
  }, []);

  if (!user) {
    return;
  }

  const handleDeleteUser = async () => {
    await clearUserData();
    setUser(null);
    router.replace("/(auth)");
  };
  return (
    <ThemedView
      style={{
        flex: 1,
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ThemedText>{user?.email}</ThemedText>
      <ThemedText>{user?.password}</ThemedText>
      <ThemedText>{user?.accessToken}</ThemedText>
      <ThemedButton title="Delete User" onPress={handleDeleteUser} />
    </ThemedView>
  );
}
