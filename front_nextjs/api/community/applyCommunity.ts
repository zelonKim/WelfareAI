import { client } from "../client";

export const applyCommunity = async (postId: string) => {
  const { data } = await client.post(`/community/${postId}/apply`);
  return data;
};
