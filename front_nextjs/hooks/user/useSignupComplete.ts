import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { ApiErrorRes } from "@/types/common/ApiErrorRes";
import { updateAgreementAndNickname } from "@/api/auth/updateAgreementAndNickname";
import { UseSignupCompleteParams } from "@/types/auth/UseSignupCompleteParams";

export const useSignupComplete = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ nickname, marketingAgreed }: UseSignupCompleteParams) =>
      updateAgreementAndNickname(nickname, marketingAgreed),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["myInfo"] });
      router.replace("/");
    },
    onError: (error: AxiosError<ApiErrorRes>) => {
      const message = error.response?.data?.message;
      const displayMessage = Array.isArray(message) ? message[0] : message;
      alert(displayMessage || "처리 중 오류가 발생했습니다.");
    },
  });
};
