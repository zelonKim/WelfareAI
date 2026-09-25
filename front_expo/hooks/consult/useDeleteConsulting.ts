import { deleteConsulting } from "@/api/consult/deleteConsulting";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

export const useDeleteConsulting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteConsulting(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultings"] });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "삭제 중 오류가 발생했습니다.";
      Alert.alert("오류", message);
    },
  });
};
