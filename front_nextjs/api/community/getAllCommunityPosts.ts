import { CommunityPost } from "@/types/community/CommunityPost";
import { client } from "../client";

export const getAllCommunityPosts = async (): Promise<CommunityPost[]> => {
  const res = await client.get(`/community`);
  return res.data;
};
