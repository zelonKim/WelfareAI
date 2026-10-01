import { signupApi } from "@/api/auth/signupApi";
import { setAccessToken } from "@/api/token";
import { SignupDto } from "@/types/auth/SignupDto";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

export const useSignup = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (dto: SignupDto) => signupApi(dto),
    onSuccess: async (data) => {
      await setAccessToken(data.accessToken);
      Alert.alert("가입 완료", "WelfareAI에 오신것을 환영해요.🦊", [ 
        {
          text: "확인",
          onPress: () => router.replace("/(tabs)"),
        },
      ]);
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "회원가입 중 오류가 발생했습니다.";
      Alert.alert("가입 실패", errorMessage);
    },
  });
};
