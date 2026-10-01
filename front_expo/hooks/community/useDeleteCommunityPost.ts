import { deleteCommunityPost } from "@/api/community/deleteCommunityPost";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

export const useDeleteCommunityPost = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (id: string) => deleteCommunityPost(id),
    onSuccess: () => {
      Alert.alert("삭제 완료", "모임 게시글이 삭제되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["communityPosts"] });
      router.back();
    },
    onError: (error: any) => {
      Alert.alert(
        "삭제 실패",
        error?.response?.data?.message || "삭제 중 오류가 발생했습니다.",
      );
    },
  });
};
