import { client } from "../client";

export const unblockUser = async (blockedId: string) => {
  const res = await client.delete(`/block/${blockedId}`);
  return res.data;
};
