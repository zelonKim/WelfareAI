import { client } from "../client";

export const leaveCommunity = async (postId: string): Promise<void> => {
  const response = await client.delete(`/community/${postId}/leave`);
  return response.data;
};
