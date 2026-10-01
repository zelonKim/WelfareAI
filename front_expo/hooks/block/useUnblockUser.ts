import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { client } from "../../api/client";
import { unblockUser } from "@/api/block/unblockUser";

export const useUnblockUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
  mutationFn: unblockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blockedUsers"] });
      Alert.alert("완료", "차단이 해제되었습니다.");
    },
  });
};
