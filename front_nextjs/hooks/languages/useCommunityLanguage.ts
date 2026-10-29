import { useState, useEffect } from "react";

const communityTexts = {
  ko: {
    headerTitle: "소통 및 봉사 모임",
    loadingPosts: "모임 목록을 불러오는 중...",
    loadError: "목록을 불러오지 못했습니다.",
    retryButton: "다시 시도",
    emptyTitle: "등록된 모임이 없습니다.",
    emptySub: "새로운 모임을 만들어 사람들과 소통해 보세요!",
    createButton: "모임 만들기",
    alertTitle: "제목을 입력해 주세요.",
    alertContent: "상세 내용을 입력해 주세요.",
    tabs: [
      { value: "ALL" as const, label: "전체 모임" },
      { value: "MY" as const, label: "내가 쓴 모임" },
    ],
  },
  en: {
    headerTitle: "Community & Volunteer Groups",
    loadingPosts: "Loading community posts...",
    loadError: "Failed to load posts.",
    retryButton: "Try Again",
    emptyTitle: "No community posts found.",
    emptySub: "Create a new group and connect with people!",
    createButton: "Create Group",
    alertTitle: "Please enter a title.",
    alertContent: "Please enter detailed content.",
    tabs: [
      { value: "ALL" as const, label: "All Groups" },
      { value: "MY" as const, label: "My Groups" },
    ],
  },
};

export function useCommunityLanguage() {
  const [locale, setLocale] = useState<"ko" | "en">("ko");

  useEffect(() => {
    const browserLang = navigator.language || navigator.languages[0];
    if (browserLang && browserLang.toLowerCase().startsWith("ko")) {
      setLocale("ko");
    } else {
      setLocale("en");
    }
  }, []);

  return { t: communityTexts[locale], locale };
}