import { createCrisisReport } from "@/api/crisisReport/createCrisisReport";
import { CreateCrisisReportDto } from "@/types/crisisReport/CreateCrisisReportDto";
import { CreateCrisisReportResponse } from "@/types/crisisReport/CreateCrisisReportResponse";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

export const useCreateCrisisReport = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateCrisisReportResponse, Error, CreateCrisisReportDto>({
    mutationFn: (dto: CreateCrisisReportDto) => createCrisisReport(dto),
    onSuccess: (data) => {
      Alert.alert("접수 완료 🦊", data.message);
      queryClient.invalidateQueries({ queryKey: ["crisisReports"] });
      queryClient.invalidateQueries({ queryKey: ["crisisReports", "me"] });
    },
    onError: (error) => {
      Alert.alert(
        "제보 실패",
        error.message || "제보 등록 중 오류가 발생했습니다.",
      );
    },
  });
};
