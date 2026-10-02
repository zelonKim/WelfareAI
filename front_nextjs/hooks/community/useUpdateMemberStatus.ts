import { updateMemberStatus } from "@/api/community/updateMemberStatus";
import { ApiErrorRes } from "@/types/common/ApiErrorRes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useUpdateMemberStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMemberStatus,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["communityDetail", variables.postId],
      });
      queryClient.invalidateQueries({ queryKey: ["community"] });
    },
    onError: (error: AxiosError<ApiErrorRes>) => {
      const message =
        error?.response?.data?.message || "상태 변경에 실패했습니다.";
      alert(message);
    },
  });
};
