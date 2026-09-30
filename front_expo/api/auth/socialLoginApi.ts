import { SocialLoginData } from "@/types/auth/SocialLoginData";
import { client } from "../client";

export const socialLoginApi = async ({ idToken, provider }: SocialLoginData) => {
  const { data } = await client.post("/auth/social-login", {
    token: idToken,
    provider: provider,
  });
  return data;
};
