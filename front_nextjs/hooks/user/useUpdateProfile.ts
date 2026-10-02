import { updateProfile } from "@/api/user/updateProfile";
import { ApiErrorRes } from "@/types/common/ApiErrorRes";
import { UpdateProfileDto } from "@/types/user/UpdateProfileDto";
import { UseUpdateProfileOptions } from "@/types/user/UseUpdateProfileOptions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useUpdateProfile = (options?: UseUpdateProfileOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateProfileDto) => updateProfile(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
      alert("프로필이 변경되었습니다.");
      options?.onSuccessCallback?.();
    },
    onError: (error: AxiosError<ApiErrorRes>) => {
      alert(error?.response?.data?.message || "프로필 변경에 실패했습니다.");
    },
  });
};
