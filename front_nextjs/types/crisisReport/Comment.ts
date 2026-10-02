export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    nickname: string;
    profileImage?: string;
  };
}
