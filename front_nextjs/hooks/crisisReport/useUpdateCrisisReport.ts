import { updateCrisisReport } from "@/api/crisisReport/updateCrisisReport";
import { ApiErrorRes } from "@/types/common/ApiErrorRes";
import { UpdateCrisisReportDto } from "@/types/crisisReport/UpdateCrisisReportDto";
import { UseUpdateCrisisReportOptions } from "@/types/crisisReport/UseUpdateCrisisReportOptions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

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

      alert("제보가 성공적으로 수정되었습니다.");
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error: AxiosError<ApiErrorRes>) => {
      const message =
        error.response?.data?.message || "오류가 발생했습니다.";
      alert(message);
    },
  });
};
