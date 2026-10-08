import { signupApi } from "@/api/auth/signupApi";
import { setAccessToken } from "@/api/token";
import { SignupDto } from "@/types/auth/SignupDto";
import { ApiErrorRes } from "@/types/common/ApiErrorRes";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export const useSignup = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (dto: SignupDto) => signupApi(dto),
    onSuccess: async (data) => {
      await setAccessToken(data.accessToken);
      router.replace("/");
    },
    onError: (error: AxiosError<ApiErrorRes>) => {
      const errorMessage =
        error.response?.data?.message || "회원가입 중 오류가 발생했습니다.";
      alert(errorMessage);
    },
  });
};
