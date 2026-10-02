import { deleteCommunityPost } from "@/api/community/deleteCommunityPost";
import { ApiErrorRes } from "@/types/common/ApiErrorRes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export const useDeleteCommunityPost = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (id: string) => deleteCommunityPost(id),
    onSuccess: () => {
      alert("모임 게시글이 삭제되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["communityPosts"] });
      router.back();
    },
    onError: (error: AxiosError<ApiErrorRes>) => {
      alert(error?.response?.data?.message || "삭제 중 오류가 발생했습니다.");
    },
  });
};
