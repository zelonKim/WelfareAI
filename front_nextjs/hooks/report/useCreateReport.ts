import { submitReport } from "@/api/report/submitReport";
import { CreateReportPayload } from "@/types/report/CreateReportPayload";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateReport = (onSuccessCallback?: () => void) => {
  return useMutation({
    mutationFn: submitReport,
    onSuccess: (data) => {
      alert(data.message || "신고가 접수되었습니다.");
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error: Error) => {
      alert(error.message);
    },
  });
};
