import { CommunityDetail } from "@/types/community/CommunityDetail";
import { client } from "../client";

export const getCommunityDetail = async (id: string): Promise<CommunityDetail> => {
  const res = await client.get(`/community/${id}`);
  return res.data;
};
