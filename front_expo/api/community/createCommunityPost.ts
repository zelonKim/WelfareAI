import { CreateCommunityPayload } from "@/types/community/CreateCommunityPayload";
import { client } from "../client";

export const createCommunityPost = async (payload: CreateCommunityPayload) => {
  const res = await client.post("/community", payload);
  return res.data;
};
