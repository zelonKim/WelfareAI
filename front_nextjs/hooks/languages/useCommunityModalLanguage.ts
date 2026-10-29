import { useState, useEffect } from "react";

const communityModalTexts = {
  ko: {
    createTitle: "👥 모임 만들기",
    editTitle: "👥 모임 수정하기",
    closeAria: "닫기",
    natureLabel: "모임 성격",
    selfHelpTab: "소통 모임",
    volunteerTab: "봉사 모임",
    titleLabel: "제목",
    titlePlaceholder: "예: 치매 어르신 가족 소통방",
    contentLabel: "내용",
    contentPlaceholder: "모임 내용에 대해 적어주세요.",
    noticeLabel: "공지사항",
    noticePlaceholder: "공지사항에 대해 입력해주세요.",
    cancelButton: "취소",
    createButton: "개설하기",
    editButton: "보완하기",
  },
  en: {
    createTitle: "👥 Create Group",
    editTitle: "👥 Edit Group",
    closeAria: "Close",
    natureLabel: "Group Type",
    selfHelpTab: "Communication",
    volunteerTab: "Volunteer",
    titleLabel: "Title",
    titlePlaceholder: "e.g., Dementia caregiver support group",
    contentLabel: "Content",
    contentPlaceholder: "Please describe the group details.",
    noticeLabel: "Notice",
    noticePlaceholder: "Please enter any notices.",
    cancelButton: "Cancel",
    createButton: "Create",
    editButton: "Update",
  },
};

export function useCommunityModalLanguage() {
  const [locale, setLocale] = useState<"ko" | "en">("ko");

  useEffect(() => {
    const browserLang = navigator.language || navigator.languages[0];
    if (browserLang && browserLang.toLowerCase().startsWith("ko")) {
      setLocale("ko");
    } else {
      setLocale("en");
    }
  }, []);

  return { t: communityModalTexts[locale], locale };
}
