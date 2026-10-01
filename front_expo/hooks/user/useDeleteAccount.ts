import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { deleteAccount } from "@/api/user/deleteAccount";
import { removeAccessToken } from "@/api/token";

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: async () => {
      Alert.alert("완료", "회원 탈퇴가 처리되었습니다.");
      queryClient.clear();
      await removeAccessToken();
      router.replace("/(auth)/login");
    },
    onError: () => {
      Alert.alert("오류", "회원 탈퇴 처리 중 오류가 발생했습니다.");
    },
  });
};