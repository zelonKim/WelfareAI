import { deleteComment } from "@/api/crisisReport/deleteComment";
import { ApiErrorRes } from "@/types/common/ApiErrorRes";
import { UseDeleteCrisisCommentOptions } from "@/types/crisisReport/UseDeleteCrisisCommentOptions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useDeleteCrisisComment = ({
  reportId,
}: UseDeleteCrisisCommentOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crisisReport", reportId] });
      alert("댓글이 삭제되었습니다.");
    },
    onError: (error: AxiosError<ApiErrorRes>) => {
      const message = error?.response?.data?.message || "댓글 삭제 실패";
      alert(message);
    },
  });
};
