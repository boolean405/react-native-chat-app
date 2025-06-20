export type User = {
  _id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  profilePhoto: string;
  coverPhoto: string;
  bio: string;
  followers: number;
  following: number;
  posts: Post[];
};

export type Post = {
  _id: string;
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
  _id: string;
  name: string;
  isGroupChat: boolean;
  users: User[];
  latestMessage: string;
  groupAdmins: User[];
  photo: string;
  unreadCount: number;
  deletedInfo: {
    user: User;
    deletedAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
};

export type Story = {
  _id: string;
  name: string;
  storyUri: string;
  hasStory: boolean;
  user?: User;
};

export type BottomSheetOption = {
  _id: string;
  name: string;
  icon: string;
};

export type MessageStatus = "sent" | "delivered" | "seen";

export type Message = {
  _id: string;
  content: string;
  sender: "me" | "other";
  time: string;
  status?: MessageStatus; // Only needed for messages sent by "me"
};
