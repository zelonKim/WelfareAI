import { socialLoginApi } from "@/api/auth/socialLoginApi";
import { setAccessToken } from "@/api/token";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { Alert } from "react-native";

export const useSocialLogin = () => {
  return useMutation({
    mutationFn: socialLoginApi,
    onSuccess: async (data) => {
      if (data.accessToken) {
        await setAccessToken(data.accessToken);
      }
      if (data.isNewUser) {
        // 신규 가입자라면 약관 동의 및 추가 정보 입력 페이지로 이동
        router.replace("/agreement");
      } else {
        // 기존 유저는 바로 메인으로
        router.replace("/(tabs)");
      }
    },
    onError: (error: any) => {
      console.log("=== 백엔드 소셜 로그인 에러 상세 ===", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      const errorMessage =
        error.response?.data?.message || "소셜 로그인 중 오류가 발생했습니다.";
      Alert.alert("오류", errorMessage);
    },
  });
};
