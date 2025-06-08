export type User = {
  id: string;
  name: string;
  username: string;
  profileImage: string;
  bio: string;
  followers: number;
  following: number;
  coverPhoto: string;
  posts: Post[];
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
