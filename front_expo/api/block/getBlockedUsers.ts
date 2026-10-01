import { BlockedItem } from "@/types/block/BlockedItem";
import { client } from "../client";

export const getBlockedUsers = async (): Promise<BlockedItem[]> => {
  const res = await client.get("/block");
  return res.data;
};