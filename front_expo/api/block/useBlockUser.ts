import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { client } from "../client";

export const useBlockUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (blockedUserName: string) => {
      const res = await client.post("/block", { blockedUserName });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blockedUsers"] });
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "차단 실패했습니다.";
      Alert.alert("오류", msg);
    },
  });
};
