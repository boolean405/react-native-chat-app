import React from "react";
import { Image } from "expo-image";
import { StyleSheet, TouchableOpacity } from "react-native";

import { Story } from "@/types";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

export default function StoryItem({
  story,
  color,
  onPress,
}: {
  story: Story;
  color: any;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.storyItem} onPress={onPress}>
      <ThemedView
        style={[
          styles.storyAvatarWrapper,
          story.hasStory && styles.storyAvatarBorder,
          { borderColor: color.main },
        ]}
      >
        <Image source={{ uri: story.storyUri }} style={styles.storyAvatar} />
      </ThemedView>
      <ThemedText style={styles.storyName} numberOfLines={1}>
        {story.name}
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
  storyAvatarBorder: {
    borderWidth: 2,
    // borderColor: "#25D366",
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
});
