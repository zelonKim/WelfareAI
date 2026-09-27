export interface ChatMessage {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  user?: {
    id: string;
    nickname: string;
    profileImage?: string;
  };
}
