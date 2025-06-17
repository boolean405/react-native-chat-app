import { Image } from "expo-image";
import { StyleSheet, TouchableOpacity } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

// My Story Item with + icon
export default function MyStoryItem({ color }: { color: any }) {
  return (
    <TouchableOpacity
      style={styles.storyItem}
      onPress={() => alert("Add your story!")}
    >
      <ThemedView
        style={[styles.storyAvatarWrapper, styles.myStoryAvatarWrapper]}
      >
        <Image
          source={{ uri: "https://randomuser.me/api/portraits/men/99.jpg" }} // Your avatar
          style={styles.storyAvatar}
        />
        <ThemedView
          style={[styles.plusIconWrapper, { backgroundColor: color.secondary }]}
        >
          <Ionicons name="add" size={24} color={color.main} />
        </ThemedView>
      </ThemedView>
      <ThemedText style={styles.storyName} numberOfLines={1}>
        My Story
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  storyItem: {
    width: 70,
    alignItems: "center",
    marginRight: 12,
  },
  storyAvatarWrapper: {
    borderRadius: 40,
    padding: 2,
  },
  storyAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ccc",
  },
  storyName: {
    marginTop: 4,
    fontSize: 12,
    maxWidth: 70,
    textAlign: "center",
  },

  myStoryAvatarWrapper: {
    borderWidth: 0,
    position: "relative",
  },
  plusIconWrapper: {
    position: "absolute",
    bottom: -2,
    right: -2,
    borderRadius: 11,
  },
});
