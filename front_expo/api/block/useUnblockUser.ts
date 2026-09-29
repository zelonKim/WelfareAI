import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { client } from "../client";

export const useUnblockUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (blockedId: string) => {
      const res = await client.delete(`/block/${blockedId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blockedUsers"] });
      Alert.alert("완료", "차단이 해제되었습니다.");
    },
  });
};
