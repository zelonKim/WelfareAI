import { createCommunityPost } from "@/api/community/createCommunityPost";
import { CreateCommunityPayload } from "@/types/community/CreateCommunityPayload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

export const useCreateCommunity = (onSuccessCallback: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCommunityPayload) =>
      createCommunityPost(payload),
    onSuccess: () => {
      Alert.alert("성공", "모임이 성공적으로 생성되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["communityPosts"] });
      onSuccessCallback();
    },
    onError: (error: any) => {
      Alert.alert(
        "오류",
        error?.response?.data?.message || "생성에 실패했습니다.",
      );
    },
  });
};
