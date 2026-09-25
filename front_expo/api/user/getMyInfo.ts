import { UserProfile } from "@/types/user/UserProfile";
import { client } from "../client";

export const getMyInfo = async (): Promise<UserProfile> => {
  const { data } = await client.get<UserProfile>("/user/me");
  return data;
};
