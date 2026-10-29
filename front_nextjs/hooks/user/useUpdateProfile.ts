import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { updateProfile } from "@/api/user/updateProfile";
import { ApiErrorRes } from "@/types/common/ApiErrorRes";
import { UpdateProfileDto } from "@/types/user/UpdateProfileDto";
import { UseUpdateProfileOptions } from "@/types/user/UseUpdateProfileOptions";

const updateProfileTexts = {
  ko: {
    successAlert: "프로필이 변경되었습니다.",
    defaultErrorAlert: "프로필 변경에 실패했습니다.",
  },
  en: {
    successAlert: "Profile updated successfully.",
    defaultErrorAlert: "Failed to update profile.",
  },
};

export const useUpdateProfile = (options?: UseUpdateProfileOptions) => {
  const queryClient = useQueryClient();

  const [locale, setLocale] = useState<"ko" | "en">("ko");

  useEffect(() => {
    const browserLang = navigator.language || navigator.languages[0];
    if (browserLang && browserLang.toLowerCase().startsWith("ko")) {
      setLocale("ko");
    } else {
      setLocale("en");
    }
  }, []);

  const t = updateProfileTexts[locale];

  return useMutation({
    mutationFn: (dto: UpdateProfileDto) => updateProfile(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
      alert(t.successAlert);
      options?.onSuccessCallback?.();
    },
    onError: (error: AxiosError<ApiErrorRes>) => {
      alert(error?.response?.data?.message || t.defaultErrorAlert);
    },
  });
};
