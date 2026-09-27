import { createComment } from "@/api/crisisReport/createComment";
import { UseCreateCrisisCommentOptions } from "@/types/crisisReport/UseCreateCrisisCommentOptions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

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
    onError: () => {
      Alert.alert("오류", "댓글 등록에 실패했습니다.");
    },
  });
};
