import { client } from "../client";

export const deleteAccount = async () => {
  const res = await client.delete("/user/account");
  return res.data;
};