import { client } from "../client";

export const deleteChatMessage = async ({
  postId,
  messageId,
}: {
  postId: string;
  messageId: string;
}) => {
  const { data } = await client.delete(
    `/community/${postId}/chats/${messageId}`,
  );
  return data;
};
