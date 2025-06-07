import React from "react";
import { StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";

export const LogoutButton: React.FC = () => {
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => console.log("Logged out"),
      },
    ]);
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handleLogout}
      activeOpacity={0.8}
    >
      <Ionicons name="log-out-outline" size={20} color="#fff" />
      <ThemedText style={styles.text}>Logout</ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    backgroundColor: "#d9534f",
  },
  text: {
    marginLeft: 8,
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
