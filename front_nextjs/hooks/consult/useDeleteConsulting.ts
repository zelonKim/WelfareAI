import { deleteConsulting } from "@/api/consult/deleteConsulting";
import { ApiErrorRes } from "@/types/common/ApiErrorRes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useDeleteConsulting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteConsulting(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultings"] });
    },
    onError: (error: AxiosError<ApiErrorRes>) => {
      const message =
        error.response?.data?.message || "삭제 중 오류가 발생했습니다.";
      alert(message);
    },
  });
};
