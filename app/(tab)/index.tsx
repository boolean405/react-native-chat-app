import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  useColorScheme,
  TextInput,
  Alert,
  ToastAndroid,
} from "react-native";

import { BottomSheetOption, Chat, Story, User } from "@/types";
import { Colors } from "@/constants/colors";
import ChatItem from "@/components/ChatItem";
import { Ionicons } from "@expo/vector-icons";
import StoryItem from "@/components/StoryItem";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import MyStoryItem from "@/components/MyStoryItem";
import { useFocusEffect, useRouter } from "expo-router";
import BottomSheetAction from "@/components/BottomSheetActions";
import { createGroup, deleteChat, getAllChats, leaveGroup } from "@/api/chat";
import { searchUser } from "@/api/user";
import { TouchableOpacity } from "react-native";
import { getUserData } from "@/storage/authStorage";
import { APP_NAME } from "@/constants";

// Chats list

// const chats: Chat[] = [
//   {
//     _id: "1",
//     isGroupChat: false,
//     name: "John Doe",
//     latestMessage: "Hey, how are you?",
//     unreadCount: 2,
//     photo: "https://randomuser.me/api/portraits/men/1.jpg",
//     users: [],
//     groupAdmins: [],
//     deletedInfo: [],
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   },
// ];

// Stories list
const stories: Story[] = [
  {
    _id: "s2",
    name: "Family Group",
    storyUri: "https://cdn-icons-png.flaticon.com/512/1946/1946429.png",
    hasStory: false,
  },
  {
    _id: "s3",
    name: "Sarah Lane",
    storyUri: "https://randomuser.me/api/portraits/women/2.jpg",
    hasStory: true,
  },
  {
    _id: "s4",
    name: "Mike Ross",
    storyUri: "https://randomuser.me/api/portraits/men/3.jpg",
    hasStory: false,
  },
  {
    _id: "s5",
    name: "Mike Ross",
    storyUri: "https://randomuser.me/api/portraits/men/3.jpg",
    hasStory: false,
  },
  {
    _id: "s6",
    name: "Mike Ross",
    storyUri: "https://randomuser.me/api/portraits/men/3.jpg",
    hasStory: false,
  },
];

const bottomSheetOptions: BottomSheetOption[] = [
  { _id: "1", name: "Archive", icon: "archive-outline" },
  { _id: "2", name: "Mute", icon: "volume-mute-outline" },
  { _id: "3", name: "Create group chat with", icon: "people-outline" },
  { _id: "4", name: "Leave group", icon: "exit-outline" },
  { _id: "5", name: "Delete", icon: "trash-outline" },
];

// Main Component
export default function ChatHomeScreen() {
  const colorScheme = useColorScheme();
  const color = Colors[colorScheme ?? "light"];
  const router = useRouter();

  const [isSheetVisible, setSheetVisible] = useState(false);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [user, setUser] = useState<User | null>(null);
  // const [searchText, setSearchText] = useState("");
  // const [searchResults, setSearchResults] = useState([]);
  // const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchChatsData();
  }, []);

  // Reload data
  useFocusEffect(
    useCallback(() => {
      const loadChats = async () => {
        await fetchChatsData();
        await fetchUserData();
      };
      loadChats();
    }, [])
  );

  // Fetch user data from SecureStore
  async function fetchUserData() {
    setUser(await getUserData());
  }

  // Refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchChatsData();

      // Delay to show spinner longer
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Fetch chats data from SecureStore
  async function fetchChatsData() {
    try {
      const data = await getAllChats();
      setChats(data.result);
    } catch (error) {
      console.error("Failed to fetch chats:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Long press for showing models
  const handleLongPress = (chat: Chat) => {
    setSelectedChat(chat);
    setSheetVisible(true);
  };

  const handleOptionSelect = async (index: number) => {
    const isUser = selectedChat && selectedChat.isGroupChat === false;
    const options = [
      "Archive",
      "Mute",
      ...(isUser
        ? [`Create Group Chat with ${selectedChat.name}`]
        : ["Leave group"]),
      "Delete",
    ];

    const selectedOption = options[index];

    try {
      if (selectedOption === "Delete") {
        Alert.alert(
          "Delete Chat",
          "Are you sure you want to delete this chat?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Delete",
              style: "destructive",
              onPress: async () => {
                setIsLoading(true);
                setSheetVisible(false);
                try {
                  const data = await deleteChat(selectedChat?._id);
                  if (data.status) {
                    ToastAndroid.show(data.message, ToastAndroid.SHORT);
                  }
                  await fetchChatsData();
                } catch (err: any) {
                  ToastAndroid.show(err.message, ToastAndroid.SHORT);
                } finally {
                  setIsLoading(false);
                  setSheetVisible(false);
                }
              },
            },
          ]
        );
      } else if (
        selectedOption === `Create Group Chat with ${selectedChat?.name}`
      ) {
        setIsLoading(true);
        setSheetVisible(false);
        try {
          const userIds = selectedChat?.users?.map((user) => user._id) ?? [];
          const data = await createGroup(selectedChat?.name, userIds);
          if (data.status) {
            ToastAndroid.show(data.message, ToastAndroid.SHORT);
          }
          await fetchChatsData();
        } catch (err: any) {
          ToastAndroid.show(err.message, ToastAndroid.SHORT);
        } finally {
          setIsLoading(false);
          setSheetVisible(false);
        }
      } else if (selectedOption === "Leave group") {
        Alert.alert(
          "Leave Group",
          "Are you sure you want to leave from this group?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Leave",
              style: "destructive",
              onPress: async () => {
                setIsLoading(true);
                setSheetVisible(false);
                try {
                  const data = await leaveGroup(selectedChat?._id);
                  if (data.status) {
                    ToastAndroid.show(data.message, ToastAndroid.SHORT);
                  }
                  await fetchChatsData();
                } catch (err: any) {
                  ToastAndroid.show(err.message, ToastAndroid.SHORT);
                } finally {
                  setIsLoading(false);
                  setSheetVisible(false);
                }
              },
            },
          ]
        );
      }
    } catch (error: any) {
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
      console.log(error.message);
      setIsLoading(false);
      setSheetVisible(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText type="title">{APP_NAME}</ThemedText>
      </ThemedView>

      {/* Chats */}
      <FlatList
        data={chats}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          return (
            <ChatItem
              chat={item}
              onPress={() =>
                router.push({
                  pathname: "/(chat)",
                  params: {
                    chatId: item._id,
                    chatName: item.name,
                  },
                })
              }
              onProfilePress={() => console.log(item.name)}
              onLongPress={() => handleLongPress(item)}
            />
          );
        }}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
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
            <TouchableOpacity
              onPress={() => router.push("/(chat)/search")}
              // activeOpacity={0.9}
            >
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
                  style={{ color: color.icon, paddingHorizontal: 20 }}
                />
                <TextInput
                  style={[styles.textInput, { color: color.primary }]}
                  placeholder="Search"
                  placeholderTextColor="gray"
                  editable={false}
                  pointerEvents="none"
                />
              </ThemedView>
            </TouchableOpacity>

            {/* Stories */}
            <FlatList
              data={stories}
              horizontal
              keyExtractor={(item) => item._id}
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
              ListHeaderComponent={user && <MyStoryItem user={user} />}
            />
          </>
        }
      />
      {/* Custom Sheet */}
      <BottomSheetAction
        color={color}
        visible={isSheetVisible}
        title={selectedChat?.name}
        options={bottomSheetOptions.flatMap(({ _id, name, icon }) => {
          if (_id === "3") {
            return selectedChat?.isGroupChat === false
              ? [{ _id, name: `${name} ${selectedChat.name}`, icon }]
              : [];
          }
          if (_id === "4") {
            return selectedChat?.isGroupChat ? [{ _id, name, icon }] : [];
          }
          return [{ _id, name, icon }];
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
    // borderWidth: 0.2,
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
