import { deleteAllConsulting } from "@/api/consult/deleteAllConsulting";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteAllConsulting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAllConsulting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultings"] });
      alert("모든 상담 내역이 삭제되었습니다.");
    },
    onError: (error) => {
      console.error("상담 내역 삭제 실패:", error);
      alert("상담 내역 삭제 중 오류가 발생했습니다.");
    },
  });
};
