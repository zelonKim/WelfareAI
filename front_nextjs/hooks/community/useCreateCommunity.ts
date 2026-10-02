import { createCommunityPost } from "@/api/community/createCommunityPost";
import { ApiErrorRes } from "@/types/common/ApiErrorRes";
import { CreateCommunityPayload } from "@/types/community/CreateCommunityPayload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useCreateCommunity = (onSuccessCallback: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCommunityPayload) =>
      createCommunityPost(payload),
    onSuccess: () => {
      alert("모임이 성공적으로 생성되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["communityPosts"] });
      onSuccessCallback();
    },
    onError: (error: AxiosError<ApiErrorRes>) => {
      alert(error?.response?.data?.message || "생성에 실패했습니다.");
    },
  });
};
