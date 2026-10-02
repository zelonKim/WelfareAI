import { createComment } from "@/api/crisisReport/createComment";
import { ApiErrorRes } from "@/types/common/ApiErrorRes";
import { UseCreateCrisisCommentOptions } from "@/types/crisisReport/UseCreateCrisisCommentOptions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useCreateCrisisComment = ({
  reportId,
  onSuccessCallback,
}: UseCreateCrisisCommentOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => createComment({ reportId, content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crisisReport", reportId] });

      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error: AxiosError<ApiErrorRes>) => {
      const message =
        error.response?.data?.message || "댓글 등록에 실패했습니다.";
      alert(message);
    },
  });
};
