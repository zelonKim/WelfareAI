import { updateProfile } from "@/api/user/updateProfile";
import { UpdateProfileDto } from "@/types/user/UpdateProfileDto";
import { UseUpdateProfileOptions } from "@/types/user/UseUpdateProfileOptions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";


export const useUpdateProfile = (options?: UseUpdateProfileOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateProfileDto) => updateProfile(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
      Alert.alert("성공", "프로필이 변경되었습니다.");
      options?.onSuccessCallback?.();
    },
    onError: (error: any) => {
      Alert.alert(
        "오류",
        error?.response?.data?.message || "프로필 변경에 실패했습니다."
      );
    },
  });
};