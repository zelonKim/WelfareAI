import { uploadProfileImage } from "@/api/user/uploadProfileImage";
import { SaveProfileParams } from "@/types/user/SaveProfileParams";
import { UseSaveProfileOptions } from "@/types/user/UseSaveProfileOptions";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Alert } from "react-native";
import { useUpdateProfile } from "./useUpdateProfile";

export const useSaveProfile = (options?: UseSaveProfileOptions) => {
  const queryClient = useQueryClient();

  const [isUploading, setIsUploading] = useState(false);

  const { mutate: updateProfileMutation, isPending: updateProfilePending } =
    useUpdateProfile({
      onSuccessCallback: () => {
        queryClient.invalidateQueries({ queryKey: ["myInfo"] });
        options?.onSuccessCallback?.();
      },
    });

  const saveProfile = async ({
    nickname,
    selectedImageUri,
    currentProfileImage,
  }: SaveProfileParams) => {
    const trimmedNickname = nickname.trim();

    // 유효성 검사
    if (trimmedNickname.length < 2 || trimmedNickname.length > 12) {
      Alert.alert("알림", "별명은 2~12자 사이로 입력해 주세요.");
      return;
    }

    try {
      setIsUploading(true);
      let uploadedImageUrl: string | undefined =
        currentProfileImage || undefined;

      if (selectedImageUri === null) {
        uploadedImageUrl = "";
      } else if (selectedImageUri) {
        uploadedImageUrl = await uploadProfileImage(selectedImageUri);
      }

      // 프로필 정보 업데이트
      updateProfileMutation({
        nickname: trimmedNickname,
        profileImage: uploadedImageUrl,
      });
    } catch (error) {
      Alert.alert("오류", "이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  return {
    saveProfile,
    isSaving: isUploading || updateProfilePending,
  };
};
