import { ChatUser } from "./ChatUser";

export interface ChatMessage {
  id: string;
  message: string;
  createdAt: string;
  userId: string;
  user: ChatUser
}