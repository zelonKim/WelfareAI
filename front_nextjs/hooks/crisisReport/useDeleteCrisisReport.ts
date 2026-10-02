import { deleteCrisisReport } from "@/api/crisisReport/deleteCrisisReport";
import { ApiErrorRes } from "@/types/common/ApiErrorRes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export const useDeleteCrisisReport = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: deleteCrisisReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crisisReports"] });
      alert("제보가 성공적으로 삭제되었습니다.");
      router.back();
    },
    onError: (error: AxiosError<ApiErrorRes>) => {
      const errorMessage =
        error?.response?.data?.message || "삭제 도중 오류가 발생했습니다.";
      alert(errorMessage);
    },
  });
};
