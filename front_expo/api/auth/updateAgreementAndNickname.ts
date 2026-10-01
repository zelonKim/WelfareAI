import { client } from "../client";

export const updateAgreementAndNickname = async (
  nickname: string,
  marketingAgreed: boolean,
) => {
  const { data } = await client.patch("/user/profile", {
    nickname,
    termsAgreedAt: new Date().toISOString(),
    privacyAgreedAt: new Date().toISOString(),
    marketingAgreedAt: marketingAgreed ? new Date().toISOString() : undefined,
  });
  return data;
};
