import { client } from "../client";

export const deleteCommunityPost = async (id: string) => {
  const res = await client.delete(`/community/${id}`);
  return res.data;
};
