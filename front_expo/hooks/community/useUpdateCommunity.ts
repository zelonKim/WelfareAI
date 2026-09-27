import { client } from "@/api/client";
import { UpdateCommunityPostDto } from "@/types/community/UpdateCommunityPostDto";
import { UseUpdateCommunityProps } from "@/types/community/UseUpdateCommunityProps";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

export const useUpdateCommunity = ({
  id,
  onSuccessCallback,
}: UseUpdateCommunityProps) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: UpdateCommunityPostDto) => {
      const { data } = await client.patch(`/community/${id}`, dto);
      return data;
    },
    onSuccess: (data) => {
      Alert.alert("수정 완료", data.message || "게시글이 수정되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["communityDetail", id] });
      queryClient.invalidateQueries({ queryKey: ["communityPosts"] });
      onSuccessCallback();
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "게시글 수정에 실패했습니다.";
      Alert.alert("수정 실패", errorMessage);
    },
  });
};
