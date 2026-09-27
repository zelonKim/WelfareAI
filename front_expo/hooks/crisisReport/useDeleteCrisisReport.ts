
import { deleteCrisisReport } from "@/api/crisisReport/deleteCrisisReport";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

export const useDeleteCrisisReport = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: deleteCrisisReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crisisReports"] });
      Alert.alert("완료", "제보가 성공적으로 삭제되었습니다.", [
        {
          text: "확인",
          onPress: () => router.back(),
        },
      ]);
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "삭제 도중 오류가 발생했습니다.";
      Alert.alert("삭제 실패", errorMessage);
    },
  });
};
