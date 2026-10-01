import { applyCommunity } from "@/api/community/applyCommunity";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

export const useApplyCommunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => applyCommunity(id),
    onSuccess: (data, id) => {
      Alert.alert("신청 완료", data?.message || "참여 신청이 완료되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["communityPosts"] });
      queryClient.invalidateQueries({ queryKey: ["communityDetail", id] });
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "참여 신청 중 오류가 발생했습니다.";
      Alert.alert("신청 실패", errorMessage);
    },
  });
};
