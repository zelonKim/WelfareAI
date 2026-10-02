import { blockUser } from "@/api/block/blockUser";
import { ApiErrorRes } from "@/types/common/ApiErrorRes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useBlockUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: blockUser,
    onSuccess: (_, nickname) => {
      queryClient.invalidateQueries({ queryKey: ["blockedUsers"] });
      alert(`${nickname}님을 차단했습니다.`);
    },
    onError: (error: AxiosError<ApiErrorRes>) => {
      const msg = error?.response?.data?.message || "차단 실패했습니다.";
      alert(msg);
    },
  });
};
