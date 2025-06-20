import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/colors";
import MessageItem from "@/components/MessageItem";
import { Message } from "@/types";

const initialMessages: Message[] = [
  { _id: "1", content: "Hello!", sender: "other", time: "2:00 PM" },
  { _id: "2", content: "Hi, how are you?", sender: "other", time: "2:01 PM" },
  {
    _id: "3",
    content:
      "I'm good, thanks! lorem lorem lorem lorem lorem lorem ipsum .hello world, lo fi , hi , details, my book,",
    sender: "other",
    time: "2:02 PM",
  },
  { _id: "4", content: "Bye!", sender: "me", time: "2:02 PM" },
  { _id: "5", content: "Hello!", sender: "me", time: "2:00 PM" },
  { _id: "6", content: "Hi, how are you?", sender: "me", time: "2:01 PM" },
  {
    _id: "7",
    content:
      "I'm good, thanks! lorem lorem lorem lorem lorem lorem ipsum .hello world, lo fi , hi , details, my book,",
    sender: "other",
    time: "2:02 PM",
  },
  { _id: "8", content: "Bye!", sender: "other", time: "2:02 PM" },
  { _id: "9", content: "Hi, how are you?", sender: "other", time: "2:01 PM" },
  {
    _id: "10",
    content:
      "I'm good, thanks! lorem lorem lorem lorem lorem lorem ipsum .hello world, lo fi , hi , details, my book,",
    sender: "other",
    time: "2:02 PM",
  },
  { _id: "11", content: "Bye!", sender: "other", time: "2:02 PM" },
  { _id: "12", content: "Hello!", sender: "me", time: "2:00 PM" },
  { _id: "13", content: "Hi, how are you?", sender: "me", time: "2:01 PM" },
  {
    _id: "14",
    content:
      "I'm good, thanks! lorem lorem lorem lorem lorem lorem ipsum .hello world, lo fi , hi , details, my book,",
    sender: "me",
    time: "2:02 PM",
  },
  { _id: "15", content: "Bye!", sender: "other", time: "2:02 PM" },
];

export default function Messages() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);

  const colorScheme = useColorScheme();
  const color = Colors[colorScheme ?? "light"];

  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const { chatId, chatName } = useLocalSearchParams();
  console.log(chatId, chatName);

  // Show latest message
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: false });
    }, 100);
  }, []);

  // Show typing
  useEffect(() => {
    setIsTyping(newMessage.length > 0);
  }, [newMessage]);

  // Message status
  useEffect(() => {
    if (messages.length === 0) return;
    const last = messages[messages.length - 1];
    if (last.sender === "me" && last.status === "sent") {
      // Simulate "delivered" after 1 sec
      setTimeout(() => {
        setMessages((msgs) =>
          msgs.map((msg) =>
            msg._id === last._id ? { ...msg, status: "delivered" } : msg
          )
        );
      }, 1000);

      // Simulate "seen" after 3 sec
      setTimeout(() => {
        setMessages((msgs) =>
          msgs.map((msg) =>
            msg._id === last._id ? { ...msg, status: "seen" } : msg
          )
        );
      }, 3000);
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const createdMessage: Message = {
      _id: Date.now().toString(),
      content: newMessage.trim(),
      sender: "me",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "sent",
    };

    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, createdMessage];
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100); // give it a tick to render the new message
      return updatedMessages;
    });

    setNewMessage("");
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: color.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      {/* Header */}
      <ThemedView
        style={[styles.header, { borderBottomColor: color.borderColor }]}
      >
        <TouchableOpacity onPress={() => console.log("back")}>
          <Ionicons name="chevron-back-outline" size={24} color={color.icon} />
        </TouchableOpacity>
        <ThemedText type="subtitle" style={styles.headerTitle}>
          {chatName && chatName}
        </ThemedText>
        <ThemedView style={styles.headerIcons}>
          <TouchableOpacity onPress={() => console.log("Voice call")}>
            <Ionicons
              name="call-outline"
              size={22}
              style={styles.icon}
              color={color.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log("Video call")}>
            <Ionicons
              name="videocam-outline"
              size={22}
              style={styles.icon}
              color={color.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log("More")}>
            <Ionicons
              name="ellipsis-vertical-outline"
              size={22}
              style={styles.icon}
              color={color.icon}
            />
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={
          isTyping
            ? [
                ...messages,
                {
                  _id: "typing",
                  content: "Typing...",
                  sender: "other",
                  time: "",
                },
              ]
            : messages
        }
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <MessageItem
            item={item}
            index={index}
            messages={
              isTyping
                ? [
                    ...messages,
                    {
                      _id: "typing",
                      content: "Typing...",
                      sender: "other",
                      time: "",
                    },
                  ]
                : messages
            }
            color={color}
            isTypingItem={item._id === "typing"}
            user= {item.sender}
          />
        )}
        style={styles.chatList}
        contentContainerStyle={{ padding: 10 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Input Area */}
      <ThemedView style={[styles.inputContainer]}>
        <ThemedView
          style={[
            styles.inputTextContainer,
            { backgroundColor: color.secondary },
          ]}
        >
          <TouchableOpacity style={styles.imageButton}>
            <Ionicons name="happy-outline" size={22} color={color.icon} />
          </TouchableOpacity>
          <TextInput
            value={newMessage}
            onChangeText={setNewMessage}
            style={[styles.textInput, { color: color.text }]}
            placeholder="Type a message"
            placeholderTextColor="gray"
            multiline
          />
          <TouchableOpacity
            onPress={() => console.log("image")}
            style={styles.imageButton}
          >
            <Ionicons name="image-outline" size={22} color={color.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.imageButton}>
            <Ionicons name="camera-outline" size={22} color={color.icon} />
          </TouchableOpacity>
        </ThemedView>
        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: color.main }]}
          onPress={handleSendMessage}
        >
          <Ionicons name="send-outline" size={20} color={color.icon} />
        </TouchableOpacity>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: 20 },
  header: {
    padding: 15,
    // paddingRight: 20,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.2,
  },
  headerTitle: { flex: 1, marginLeft: 10 },
  headerIcons: { flexDirection: "row" },
  icon: { marginLeft: 15 },

  chatList: { flex: 1 },

  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    // paddingVertical: 15,
    // marginVertical: 10,
  },
  inputTextContainer: {
    height: 40,
    width: "80%",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  textInput: {
    flex: 1,
    paddingBottom: 0,
    paddingTop: 0,
    height: "100%",
  },
  sendButton: {
    backgroundColor: "#128c7e",
    padding: 10,
    borderRadius: 20,
  },
  imageButton: {
    paddingHorizontal: 5,
  },
  typingIndicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
  },

  otherAvatarBubble: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#ccc", // Or avatar placeholder color
    marginRight: 8,
  },

  typingText: {
    fontStyle: "italic",
    fontSize: 14,
  },
});
