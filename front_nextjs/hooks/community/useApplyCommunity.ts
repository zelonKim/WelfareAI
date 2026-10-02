import { applyCommunity } from "@/api/community/applyCommunity";
import { ApiErrorRes } from "@/types/common/ApiErrorRes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useApplyCommunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => applyCommunity(id),
    onSuccess: (_, id) => {
      alert("참여 신청이 완료되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["communityPosts"] });
      queryClient.invalidateQueries({ queryKey: ["communityDetail", id] });
    },
    onError: (error: AxiosError<ApiErrorRes>) => {
      const errorMessage =
        error?.response?.data?.message || "참여 신청 중 오류가 발생했습니다.";
      alert(errorMessage);
    },
  });
};
