import { updateMemberStatus } from "@/api/community/updateMemberStatus";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

export const useUpdateMemberStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMemberStatus,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["communityDetail", variables.postId],
      });
      queryClient.invalidateQueries({ queryKey: ["community"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "상태 변경에 실패했습니다.";
      Alert.alert("오류", message);
    },
  });
};
