import { CommunityPost } from "@/types/community/CommunityPost";
import { client } from "../client";

export const getMyCommunityPosts = async (): Promise<CommunityPost[]> => {
  const res = await client.get(`/community/my`);
  return res.data;
};
