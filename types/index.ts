export type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  profilePhoto: string;
  coverPhoto: string;
  bio: string;
  followers: number;
  following: number;
  posts?: Post[];
};

export type Post = {
  id: string;
  type: "text" | "photo" | "video";
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  createdAt: string;
  loved?: boolean;
  loveCount?: number;
  commentCount?: number;
  shareCount?: number;
  user: Omit<User, "posts">;
};

export type Chat = {
  id: string;
  type: "user" | "group";
  name: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  avatarUri?: string;
};

export type Story = {
  id: string;
  name: string;
  avatarUri: string;
  hasStory: boolean;
};

export type BottomSheetOption = {
  name: string;
  icon: string;
};
