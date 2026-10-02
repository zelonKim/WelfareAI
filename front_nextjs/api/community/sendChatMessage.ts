import { client } from "../client";

export const sendChatMessage = async ({
  postId,
  content,
}: {
  postId: string;
  content: string;
}) => {
  const res = await client.post(`/community/${postId}/chats`, { content });
  return res.data;
};
