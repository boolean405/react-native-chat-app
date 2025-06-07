import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { Post, User } from "@/types";
import { useVideoPlayer, VideoView } from "expo-video";

type Props = {
  post: Post;
  colorScheme: "light" | "dark";
  onLove: (id: string) => void;
  onComment: (id: string) => void;
  onShare: (id: string) => void;
  onUserPress: (user: Omit<User, "posts">) => void;
};

const PostCard: React.FC<Props> = ({
  post,
  colorScheme,
  onLove,
  onComment,
  onShare,
  onUserPress,
}) => {
  const colors = Colors[colorScheme];
  const player =
    post.type === "video" && post.videoUrl
      ? useVideoPlayer(post.videoUrl)
      : undefined;

  return (
    <View style={[styles.postCard, { backgroundColor: colors.secondary }]}>
      <View style={styles.postUserRow}>
        <TouchableOpacity onPress={() => onUserPress(post.user)}>
          <Image
            source={{ uri: post.user.avatar }}
            style={styles.postUserAvatar}
          />
        </TouchableOpacity>
        <View style={{ marginLeft: 8 }}>
          <Text style={[styles.postUserName, { color: colors.text }]}>
            {post.user.name}
          </Text>
          <Text style={[styles.postDate, { color: colors.icon }]}>
            {new Date(post.createdAt).toLocaleString()}
          </Text>
        </View>
      </View>
      <Text style={[styles.postContent, { color: colors.text }]}>
        {post.content}
      </Text>
      {post.type === "photo" && post.imageUrl && (
        <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
      )}
      {post.type === "video" && player && (
        <VideoView
          player={player}
          style={styles.postImage}
          allowsFullscreen
          allowsPictureInPicture
        />
      )}
      <View style={styles.postActionsRow}>
        <TouchableOpacity
          onPress={() => onLove(post.id)}
          style={styles.actionButton}
        >
          <Text
            style={[
              styles.actionIcon,
              { color: post.loved ? "#E91E63" : colors.icon },
            ]}
          >
            ♥
          </Text>
          <Text style={[styles.actionText, { color: colors.icon }]}>
            {post.loveCount ?? 0}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onComment(post.id)}
          style={styles.actionButton}
        >
          <Text style={[styles.actionIcon, { color: colors.icon }]}>💬</Text>
          <Text style={[styles.actionText, { color: colors.icon }]}>
            {post.commentCount ?? 0}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onShare(post.id)}
          style={styles.actionButton}
        >
          <Text style={[styles.actionIcon, { color: colors.icon }]}>🔗</Text>
          <Text style={[styles.actionText, { color: colors.icon }]}>
            {post.shareCount ?? 0}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  postCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  postUserRow: { flexDirection: "row", alignItems: "center" },
  postUserAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#eee",
  },
  postUserName: { fontWeight: "bold", fontSize: 15 },
  postDate: { fontSize: 12, marginTop: 4 },
  postContent: { fontSize: 16, marginVertical: 8 },
  postImage: { width: "100%", height: 200, borderRadius: 10 },
  postActionsRow: { flexDirection: "row", marginTop: 8 },
  actionButton: { flexDirection: "row", alignItems: "center", marginRight: 24 },
  actionIcon: { fontSize: 20, marginRight: 4 },
  actionText: { fontSize: 15 },
});

export default PostCard;
