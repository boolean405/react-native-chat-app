import React from "react";
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/colors";
import { ThemedView } from "./ThemedView";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  user: {
    _id: string | number;
    username: string;
    name: string;
    profilePhoto?: string;
  };
  onPress?: () => void;
}

const SearchItem: React.FC<Props> = ({ user, onPress }) => {
  const colorScheme = useColorScheme();
  const color = Colors[colorScheme ?? "light"];
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        source={{
          uri: user.profilePhoto,
        }}
        style={[styles.profilePhoto]}
      />
      <ThemedView style={styles.textContainer}>
        <ThemedText type="defaultBold">{user.name}</ThemedText>
        {user.name && (
          <ThemedText type="smallItalic">
            {user.username && `@${user.username}`}
          </ThemedText>
        )}
      </ThemedView>
      {/* <TouchableOpacity style={styles.iconContainer}>
        <Ionicons name="chatbubble-outline" size={20} color={color.icon} />
      </TouchableOpacity> */}
    </TouchableOpacity>
  );
};

export default SearchItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: "center",
  },
  profilePhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  // iconContainer: {
  //   marginRight: 10,
  // },
});
