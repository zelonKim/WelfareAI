import { blockUser } from "@/api/block/blockUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

export const useBlockUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: blockUser,
    onSuccess: (_, nickname) => {
      queryClient.invalidateQueries({ queryKey: ["blockedUsers"] });
      Alert.alert("알림", `${nickname}님을 차단했습니다.`);
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "차단 실패했습니다.";
      Alert.alert("오류", msg);
    },
  });
};
