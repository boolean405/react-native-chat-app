import React from "react";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Message, User } from "@/types";
import { Ionicons } from "@expo/vector-icons";

function MessageItem({
  item,
  index,
  messages,
  color,
  isTypingItem = false,
  user,
}: {
  item: Message;
  index: number;
  messages: Message[];
  color: any;
  isTypingItem?: boolean;
  user: User;
}) {
  const isLastOtherBeforeMe =
    item.sender === "other" &&
    (index === messages.length - 1 || messages[index + 1].sender === "me");

  return (
    <ThemedView
      style={[
        {
          flexDirection: item.sender === "me" ? "row-reverse" : "row",
          alignItems: "flex-end",
          marginBottom: 5,
        },
      ]}
    >
      {item.sender === "other" && (
        <ThemedView style={styles.avatarContainer}>
          {isLastOtherBeforeMe ? (
            <Image
              source={{
                uri: user.profilePhoto,
              }}
              style={styles.avatar}
            />
          ) : (
            <ThemedView style={styles.avatarPlaceholder} />
          )}
        </ThemedView>
      )}

      <ThemedView
        style={[
          styles.messageContainer,
          item.sender === "me"
            ? [
                styles.myMessage,
                { backgroundColor: "rgba(231, 73, 160, 0.47)" },
              ]
            : [styles.otherMessage, { backgroundColor: color.secondary }],
          isTypingItem && styles.typingMessageContainer,
        ]}
      >
        <ThemedText style={isTypingItem ? styles.typingText : undefined}>
          {isTypingItem ? "Typing..." : item.content}
        </ThemedText>

        {!isTypingItem && (
          <View style={styles.timeStatusContainer}>
            <ThemedText type="small" style={styles.timeText}>
              {item.time}
            </ThemedText>
            {item.sender === "me" && (
              <Ionicons
                name={
                  item.status === "seen"
                    ? "checkmark-done"
                    : item.status === "delivered"
                    ? "checkmark-done-outline"
                    : "checkmark-outline"
                }
                size={14}
                color={item.status === "seen" ? "#34B7F1" : "#888"}
                style={{ marginLeft: 5 }}
              />
            )}
          </View>
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    maxWidth: "75%",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  myMessage: {
    alignSelf: "flex-end",
  },
  otherMessage: {
    alignSelf: "flex-start",
  },
  timeText: {
    color: "#888",
    alignSelf: "flex-end",
    marginTop: 4,
  },
  avatarContainer: {
    marginRight: 8,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  avatarPlaceholder: {
    width: 28,
    height: 28,
  },
  typingMessageContainer: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginVertical: 0,
  },
  typingText: {
    fontStyle: "italic",
    fontSize: 13,
    color: "#888",
  },
  timeStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    alignSelf: "flex-end",
  },
});

// Wrap with React.memo and add a custom prop comparison
export default React.memo(MessageItem, (prevProps, nextProps) => {
  return (
    prevProps.item === nextProps.item &&
    prevProps.isTypingItem === nextProps.isTypingItem
  );
});
