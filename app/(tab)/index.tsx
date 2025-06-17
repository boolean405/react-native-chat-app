import React, { useRef, useState } from "react";
import { FlatList, StyleSheet, useColorScheme, TextInput } from "react-native";

import { BottomSheetOption, Chat, Story } from "@/types";
import { Colors } from "@/constants/colors";
import ChatItem from "@/components/ChatItem";
import { Ionicons } from "@expo/vector-icons";
import StoryItem from "@/components/StoryItem";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import MyStoryItem from "@/components/MyStoryItem";
import { useRouter } from "expo-router";
import BottomSheetAction from "@/components/BottomSheetActions";

const chats: Chat[] = [
  {
    id: "1",
    type: "user",
    name: "John Doe",
    lastMessage: "Hey, how are you?",
    time: "2:00 PM",
    unreadCount: 2,
    avatarUri: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: "2",
    type: "group",
    name: "Family Group",
    lastMessage: "Mom: Dinner is ready!",
    time: "1:45 PM",
    unreadCount: 0,
    avatarUri: "https://cdn-icons-png.flaticon.com/512/1946/1946429.png",
  },
  {
    id: "3",
    type: "user",
    name: "Sarah Lane",
    lastMessage: "See you tomorrow.",
    time: "1:30 PM",
    unreadCount: 1,
    avatarUri: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: "4",
    type: "user",
    name: "John Doe",
    lastMessage: "Hey, how are you?",
    time: "2:00 PM",
    unreadCount: 2,
    avatarUri: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: "5",
    type: "group",
    name: "Family Group",
    lastMessage: "Mom: Dinner is ready!",
    time: "1:45 PM",
    unreadCount: 0,
    avatarUri: "https://cdn-icons-png.flaticon.com/512/1946/1946429.png",
  },
  {
    id: "6",
    type: "user",
    name: "Sarah Lane",
    lastMessage: "See you tomorrow.",
    time: "1:30 PM",
    unreadCount: 1,
    avatarUri: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: "7",
    type: "user",
    name: "John Doe",
    lastMessage: "Hey, how are you?",
    time: "2:00 PM",
    unreadCount: 2,
    avatarUri: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: "8",
    type: "group",
    name: "Family Group",
    lastMessage: "Mom: Dinner is ready!",
    time: "1:45 PM",
    unreadCount: 0,
    avatarUri: "https://cdn-icons-png.flaticon.com/512/1946/1946429.png",
  },
  {
    id: "9",
    type: "user",
    name: "Sarah Lane",
    lastMessage: "See you tomorrow.",
    time: "1:30 PM",
    unreadCount: 1,
    avatarUri: "https://randomuser.me/api/portraits/women/2.jpg",
  },
];

// Stories list
const stories: Story[] = [
  {
    id: "s2",
    name: "Family Group",
    avatarUri: "https://cdn-icons-png.flaticon.com/512/1946/1946429.png",
    hasStory: false,
  },
  {
    id: "s3",
    name: "Sarah Lane",
    avatarUri: "https://randomuser.me/api/portraits/women/2.jpg",
    hasStory: true,
  },
  {
    id: "s4",
    name: "Mike Ross",
    avatarUri: "https://randomuser.me/api/portraits/men/3.jpg",
    hasStory: false,
  },
  {
    id: "s5",
    name: "Mike Ross",
    avatarUri: "https://randomuser.me/api/portraits/men/3.jpg",
    hasStory: false,
  },
  {
    id: "s6",
    name: "Mike Ross",
    avatarUri: "https://randomuser.me/api/portraits/men/3.jpg",
    hasStory: false,
  },
];

const bottomSheetOptions: BottomSheetOption[] = [
  { name: "Delete", icon: "trash-outline" },
  { name: "Archive", icon: "archive-outline" },
  { name: "Mute", icon: "volume-mute-outline" },
  { name: "Create group chat with", icon: "people-outline" },
  { name: "Leave group", icon: "exit-outline" },
  { name: "Cancel", icon: "close-outline" },
];

// Main Component
export default function ChatHomeScreen() {
  const colorScheme = useColorScheme();
  const color = Colors[colorScheme ?? "light"];
  const router = useRouter();

  const [isSheetVisible, setSheetVisible] = useState(false);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  const handleLongPress = (chat: Chat) => {
    setSelectedChat(chat);
    setSheetVisible(true);
  };

  const handleOptionSelect = (index: number) => {
    const isUser = selectedChat?.type === "user";
    const options = [
      "Delete",
      "Archive",
      ...(isUser ? [`Create Group Chat with ${selectedChat.name}`] : []),
      "Mute",
      "Cancel",
    ];

    const selectedOption = options[index];

    if (selectedOption === "Cancel") return;

    console.log(`${selectedOption}`, selectedChat?.name);
    setSheetVisible(false);
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText type="title">K Khay</ThemedText>
      </ThemedView>

      {/* Chats */}
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatItem
            chat={item}
            color={color}
            onPress={() => console.log(item.id)}
            onProfilePress={() => console.log(item.name)}
            onLongPress={() => handleLongPress(item)}
          />
        )}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => (
          <ThemedView
            style={[styles.separator, { backgroundColor: color.secondary }]}
          />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListHeaderComponent={
          <>
            {/* Search */}
            <ThemedView
              style={[
                styles.inputContainer,
                {
                  borderColor: color.borderColor,
                  backgroundColor: color.secondary,
                },
              ]}
            >
              <Ionicons
                name="search-outline"
                size={24}
                style={[{ color: color.icon, paddingHorizontal: 20 }]}
              />
              <TextInput
                style={[styles.textInput, { color: color.primary }]}
                placeholder="Search"
                textContentType="name"
                autoComplete="name"
                placeholderTextColor="gray"
                autoCapitalize="none"
              />
            </ThemedView>

            {/* Stories */}
            <FlatList
              data={stories}
              horizontal
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <StoryItem
                  story={item}
                  color={color}
                  onPress={() => console.log(item.name)}
                />
              )}
              showsHorizontalScrollIndicator={false}
              style={[
                styles.storyList,
                { borderBottomColor: color.borderColor },
              ]}
              contentContainerStyle={{ paddingHorizontal: 12 }}
              ListHeaderComponent={<MyStoryItem color={color} />}
            />
          </>
        }
      />
      {/* Custom Sheet */}
      <BottomSheetAction
        color={color}
        visible={isSheetVisible}
        title={selectedChat?.name}
        options={bottomSheetOptions.flatMap(({ name, icon }) => {
          if (name === "Create group chat with") {
            return selectedChat?.type === "user"
              ? [{ name: `${name} ${selectedChat.name}`, icon }]
              : [];
          }
          if (name === "Leave group") {
            return selectedChat?.type === "group" ? [{ name, icon }] : [];
          }
          return [{ name, icon }];
        })}
        onSelect={handleOptionSelect}
        onCancel={() => setSheetVisible(false)}
      />
    </ThemedView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 10,
  },

  separator: {
    height: 1,
    marginLeft: 78,
  },

  // Stories
  storyList: {
    maxHeight: 110,
    // borderBottomColor: "#eee",
    // borderBottomWidth: 1,
    paddingVertical: 10,
  },
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

  // My Story (+ icon)
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
  inputContainer: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 25,
    borderWidth: 1,
    // width: "90%",
    // paddingHorizontal: 10,
    marginVertical: 10,
    marginHorizontal: 20,
    height: 40,
  },
  textInput: {
    flex: 1,
    height: "100%",
    paddingTop: 0,
    paddingBottom: 0,
  },
});
