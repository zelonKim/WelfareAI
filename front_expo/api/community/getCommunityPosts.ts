import { CommunityPost, CommunityType } from "@/types/community/CommunityPost";
import { client } from "../client";

export const getCommunityPosts = async (
  type?: CommunityType,
): Promise<CommunityPost[]> => {
  const query = type && type !== "ALL" ? `?type=${type}` : "";
  const res = await client.get(`/community${query}`);
  return res.data;
};
