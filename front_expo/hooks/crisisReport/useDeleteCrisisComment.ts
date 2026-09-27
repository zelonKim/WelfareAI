import { deleteComment } from "@/api/crisisReport/deleteComment";
import { UseDeleteCrisisCommentOptions } from "@/types/crisisReport/UseDeleteCrisisCommentOptions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

export const useDeleteCrisisComment = ({
  reportId,
}: UseDeleteCrisisCommentOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crisisReport", reportId] });
      Alert.alert("완료", "댓글이 삭제되었습니다.");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "댓글 삭제 실패";
      Alert.alert("오류", message);
    },
  });
};
