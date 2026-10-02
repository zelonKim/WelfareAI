import { createCrisisReport } from "@/api/crisisReport/createCrisisReport";
import { ApiErrorRes } from "@/types/common/ApiErrorRes";
import { CreateCrisisReportDto } from "@/types/crisisReport/CreateCrisisReportDto";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useCreateCrisisReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateCrisisReportDto) => createCrisisReport(dto),
    onSuccess: (data) => {
      alert(data.message + "🦊");
      queryClient.invalidateQueries({ queryKey: ["crisisReports"] });
      queryClient.invalidateQueries({ queryKey: ["crisisReports", "me"] });
    },
    onError: (error: AxiosError<ApiErrorRes>) => {
      const message =
        error.response?.data?.message || "제보 등록 중 오류가 발생했습니다.";
      alert(message);
    },
  });
};
