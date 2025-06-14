import { ListSection } from "@/components/ListSection";
import { LogoutButton } from "@/components/LogoutButton";
import { ProfileHeader } from "@/components/ProfileHeader";
import { ThemedView } from "@/components/ThemedView";
import { WalletTab } from "@/components/WalletTab";
import { Colors } from "@/constants/colors";
import { getUserData } from "@/storage/authStorage";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  useColorScheme,
} from "react-native";

const screenWidth = Dimensions.get("window").width;
const CONTAINER_WIDTH = screenWidth * 0.8;

const SETTINGS: {
  id: string;
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
}[] = [
  { id: "1", label: "Settings", iconName: "settings-outline" },
  { id: "3", label: "Help & Support", iconName: "help-circle-outline" },
];

const MENUS: {
  id: string;
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
}[] = [
  { id: "1", label: "Friends", iconName: "people-outline" },
  { id: "2", label: "Groups", iconName: "people-circle-outline" },
  { id: "5", label: "Events", iconName: "calendar-outline" },
  { id: "6", label: "Memories", iconName: "time-outline" },
];

export default function Menu() {
  const [copiedText, setCopiedText] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState<any>(null);

  const colorScheme = useColorScheme();
  const colors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const router = useRouter();

  const walletBalance = 250.75;
  const isOnline = true;

  // real data
  useEffect(() => {
    fetchUserData();
  }, []);

  // Fetch user data from SecureStore when component mounts
  async function fetchUserData() {
    setUser(await getUserData());
  }

  const handleUsernameCopied = (username: string) => {
    setCopiedText(username);
    ToastAndroid.show("Username copied!", ToastAndroid.SHORT);
    console.log("Copied Username:", username);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // need to call api
    await fetchUserData();
    setRefreshing(false);
    ToastAndroid.show("Refreshed!", ToastAndroid.SHORT);
  };

  return (
    <ScrollView
      style={[styles.outerContainer, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 40 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.tint}
          colors={[colors.background]}
          progressBackgroundColor={colors.tint}
        />
      }
    >
      <ThemedView style={styles.container}>
        <ProfileHeader
          name={user?.name}
          username={user?.username}
          isOnline={isOnline}
          tint={colors.tint}
          textColor={colors.text}
          iconColor={colors.icon}
          secondary={colors.secondary}
          onUsernameCopied={handleUsernameCopied}
          profilePhoto={user?.profilePhoto}
          onPress={() => router.push("/(menu)/profile")}
        />

        <WalletTab
          balance={walletBalance}
          tint={colors.tint}
          backgroundColor={colors.secondary}
        />

        <ListSection
          title="Services"
          data={MENUS}
          tintColor={colors.tint}
          textColor={colors.text}
          separatorColor={colorScheme === "dark" ? "#444" : "#e0e0e0"}
          onItemPress={(item) => {
            console.log(item.label);
          }}
        />

        <ListSection
          title="Settings"
          data={SETTINGS}
          tintColor={colors.icon}
          textColor={colors.text}
          separatorColor={colorScheme === "dark" ? "#444" : "#e0e0e0"}
          onItemPress={(item) => {
            console.log(item.label);
          }}
        />

        <LogoutButton />
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  container: {
    width: CONTAINER_WIDTH,
    alignSelf: "center",
    paddingTop: 50,
  },
});
