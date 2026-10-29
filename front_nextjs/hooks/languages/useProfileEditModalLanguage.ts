import { useState, useEffect } from "react";

const profileEditModalTexts = {
  ko: {
    modalTitle: "내 정보 변경",
    removePhotoAria: "프로필 사진 삭제",
    nicknameLabel: "별명",
    nicknamePlaceholder: "별명 (2~12자)",
    cancelButton: "취소",
    saveButton: "변경하기",
  },
  en: {
    modalTitle: "Edit Profile",
    removePhotoAria: "Remove profile photo",
    nicknameLabel: "Nickname",
    nicknamePlaceholder: "Nickname (2~12 characters)",
    cancelButton: "Cancel",
    saveButton: "Save Changes",
  },
};

export function useProfileEditModalLanguage() {
  const [locale, setLocale] = useState<"ko" | "en">("ko");

  useEffect(() => {
    const browserLang = navigator.language || navigator.languages[0];
    if (browserLang && browserLang.toLowerCase().startsWith("ko")) {
      setLocale("ko");
    } else {
      setLocale("en");
    }
  }, []);

  return { t: profileEditModalTexts[locale], locale };
}
