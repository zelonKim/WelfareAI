import { loginApi } from "@/api/auth/loginApi";
import { setAccessToken } from "@/api/token";
import { LoginDto } from "@/types/auth/LoginDto";
import { ApiErrorRes } from "@/types/common/ApiErrorRes";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (dto: LoginDto) => loginApi(dto),
    onSuccess: async (data) => {
      await setAccessToken(data.accessToken);
      alert(`${data.user.nickname}님 환영해요.🦊`);
      router.replace("/");
    },
    onError: (error: AxiosError<ApiErrorRes>) => {
      const errorMessage =
        error.response?.data?.message || "로그인 중 오류가 발생했습니다.";
      alert(errorMessage);
    },
  });
};
