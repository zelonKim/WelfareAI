import { client } from "../client";

export const createChatMessage = async ({
  postId,
  message,
}: {
  postId: string;
  message: string;
}) => {
  const { data } = await client.post(`/community/${postId}/chats`, { message });
  return data;
};
