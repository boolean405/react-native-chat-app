// components/ProfileHeader.tsx
import React from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

interface Props {
  name: string;
  username: string;
  isOnline: boolean;
  tint: string;
  textColor: string;
  iconColor: string;
  onUsernameCopied?: (text: string) => void; 
  onPress?: () => void;
}

export const ProfileHeader: React.FC<Props> = ({
  name,
  username,
  isOnline,
  tint,
  textColor,
  iconColor,
  onUsernameCopied,
  onPress,
}) => {
  const copyUsername = async () => {
    await Clipboard.setStringAsync(username);
    ToastAndroid.show("Username copied!", ToastAndroid.SHORT);
    if (onUsernameCopied) {
      onUsernameCopied(username); // 🔥 Notify parent
    }
  };

  return (
    <TouchableOpacity style={styles.profileRow} activeOpacity={0.8} onPress={onPress}>
      <Image
        source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }}
        style={styles.profileImage}
      />
      <ThemedView style={styles.profileInfo}>
        <ThemedView style={styles.profileHeader}>
          <ThemedView style={{ flex: 1 }}>
            <ThemedText style={[styles.name, { color: textColor }]}>
              {name}
            </ThemedText>
            <ThemedView style={styles.usernameRow}>
              <ThemedText style={[styles.userName, { color: iconColor }]}>
                @{username}
              </ThemedText>
              <TouchableOpacity onPress={copyUsername}>
                <Ionicons
                  name="copy-outline"
                  size={18}
                  color={tint}
                  style={styles.copyIcon}
                />
              </TouchableOpacity>
            </ThemedView>
            <ThemedView style={styles.statusRow}>
              <ThemedView
                style={[
                  styles.statusDot,
                  { backgroundColor: isOnline ? "#4CAF50" : "#F44336" },
                ]}
              />
              <ThemedText
                style={[
                  styles.statusText,
                  { color: isOnline ? "#4CAF50" : "#F44336" },
                ]}
              >
                {isOnline ? "Online" : "Offline"}
              </ThemedText>
            </ThemedView>
          </ThemedView>
          <TouchableOpacity onPress={() => alert("Edit Profile")}>
            <Ionicons name="create-outline" size={22} color={tint} />
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginRight: 15,
  },
  profileInfo: { flex: 1 },
  profileHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 2,
  },
  usernameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  userName: {
    fontSize: 14,
    fontWeight: "500",
  },
  copyIcon: {
    marginLeft: 6,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
