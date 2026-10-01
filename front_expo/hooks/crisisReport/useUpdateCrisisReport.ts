import { updateCrisisReport } from "@/api/crisisReport/updateCrisisReport";
import { UpdateCrisisReportDto } from "@/types/crisisReport/UpdateCrisisReportDto";
import { UseUpdateCrisisReportOptions } from "@/types/crisisReport/UseUpdateCrisisReportOptions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

export const useUpdateCrisisReport = ({
  id,
  onSuccessCallback,
}: UseUpdateCrisisReportOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateCrisisReportDto) => updateCrisisReport(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crisisReports"] });
      queryClient.invalidateQueries({ queryKey: ["crisisReport", id] });

      Alert.alert("완료", "제보가 성공적으로 수정되었습니다.");
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error: any) => {
      Alert.alert(
        "수정 실패",
        error?.response?.data?.message || "오류가 발생했습니다.",
      );
    },
  });
};
