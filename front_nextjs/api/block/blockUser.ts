import { client } from "../client";

export const blockUser = async (blockedUserName: string) => {
  const res = await client.post("/block", { blockedUserName });
  return res.data;
};