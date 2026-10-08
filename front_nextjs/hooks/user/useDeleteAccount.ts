import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAccount } from "@/api/user/deleteAccount";
import { removeAccessToken } from "@/api/token";
import { useRouter } from "next/navigation";

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: async () => {
      alert("회원 탈퇴가 처리되었습니다.");
      queryClient.clear();
      await removeAccessToken();
      router.replace("/(auth)/login");
    },
    onError: () => {
      alert("회원 탈퇴 처리 중 오류가 발생했습니다.");
    },
  });
};
