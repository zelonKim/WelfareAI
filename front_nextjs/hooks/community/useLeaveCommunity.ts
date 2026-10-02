import { useMutation, useQueryClient } from "@tanstack/react-query";
import { leaveCommunity } from "@/api/community/leaveCommunity";

import { UseLeaveCommunityOptions } from "@/types/community/UseLeaveCommunityOptions";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { ApiErrorRes } from "@/types/common/ApiErrorRes";

export const useLeaveCommunity = (options?: UseLeaveCommunityOptions) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: leaveCommunity,
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ["communityPosts"] });
      queryClient.invalidateQueries({ queryKey: ["communityDetail", postId] });
      router.push(`/community`);
    },
    onError: (error: AxiosError<ApiErrorRes>) => {
      const message =
        error?.response?.data?.message || "모임 나가기에 실패했습니다.";
      alert(message);
    },
  });
};
