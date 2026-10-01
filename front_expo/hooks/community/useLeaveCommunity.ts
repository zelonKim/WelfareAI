import { useMutation, useQueryClient } from "@tanstack/react-query";
import { leaveCommunity } from "@/api/community/leaveCommunity";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { UseLeaveCommunityOptions } from "@/types/community/UseLeaveCommunityOptions";

export const useLeaveCommunity = (options?: UseLeaveCommunityOptions) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: leaveCommunity,
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ["communityPosts"] });
      queryClient.invalidateQueries({ queryKey: ["communityDetail", postId] });
      router.push(`/(tabs)/community`);
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "모임 나가기에 실패했습니다.";
      Alert.alert("오류", message);
    },
  });
};
