import { loginApi } from "@/api/auth/loginApi";
import { setAccessToken } from "@/api/token";
import { LoginDto } from "@/types/auth/LoginDto";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (dto: LoginDto) => loginApi(dto),
    onSuccess: async (data) => {
      await setAccessToken(data.accessToken);
      Alert.alert("로그인 성공", `${data.user.nickname}님 환영해요.🦊`);
      router.replace("/(tabs)");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "로그인 중 오류가 발생했습니다.";
      Alert.alert("로그인 실패", errorMessage);
    },
  });

 
};
