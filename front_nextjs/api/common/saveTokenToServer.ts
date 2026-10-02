import { client } from "../client";

export const saveTokenToServer = async (token: string) => {
  try {
    await client.patch("/user/push-token", {
      pushToken: token,
    });
    console.log("Push Token 저장 성공:", token);
  } catch (error) {
    console.log("Push Token 저장 실패:", error);
  }
};
