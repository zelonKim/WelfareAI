import { ChatMessage } from "@/types/community/ChatMessage";
import { client } from "../client";

export const getChatMessages = async (
  postId: string,
): Promise<ChatMessage[]> => {
  const res = await client.get(`/community/${postId}/chats`);
  return res.data;
};
