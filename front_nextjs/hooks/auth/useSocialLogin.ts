import { socialLoginApi } from "@/api/auth/socialLoginApi";
import { setAccessToken } from "@/api/token";
import { ApiErrorRes } from "@/types/common/ApiErrorRes";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export const useSocialLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: socialLoginApi,
    onSuccess: async (data) => {
      if (data.accessToken) {
        await setAccessToken(data.accessToken);
        window.dispatchEvent(new Event("auth-state-change"));
      }
      if (data.isNewUser) {
        router.replace("/agreement"); // 신규 가입자일 경우, 약관 동의 페이지로 이동
      } else {
        router.replace("/"); // 기존 유저일 경우, 바로 메인 페이지로 이동
      }
    },
    onError: (error: AxiosError<ApiErrorRes>) => {
      console.log("=== 소셜 로그인 에러 상세 ===", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      const errorMessage = error.response?.data?.message || "소셜 로그인 중 오류가 발생했습니다.";
      alert(errorMessage);
    },
  });
};
