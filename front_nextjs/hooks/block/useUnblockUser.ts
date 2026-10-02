import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "../../api/client";
import { unblockUser } from "@/api/block/unblockUser";

export const useUnblockUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unblockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blockedUsers"] });
      alert("차단이 해제되었습니다.");
    },
  });
};
