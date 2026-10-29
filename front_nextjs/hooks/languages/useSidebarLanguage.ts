import { useState, useEffect } from "react";

const sidebarTexts = {
  ko: {
    consult: "상담",
    crisisReport: "제보",
    policy: "정책",
    community: "모임",
    mypage: "설정",
    menuAria: "메뉴 열기/닫기",
  },
  en: {
    consult: "Chat",
    crisisReport: "Report",
    policy: "Policy",
    community: "Groups",
    mypage: "Settings",
    menuAria: "Open/Close Menu",
  },
};

export function useSidebarLanguage() {
  const [locale, setLocale] = useState<"ko" | "en">("ko");

  useEffect(() => {
    const browserLang = navigator.language || navigator.languages[0];
    if (browserLang && browserLang.toLowerCase().startsWith("ko")) {
      setLocale("ko");
    } else {
      setLocale("en");
    }
  }, []);

  return { t: sidebarTexts[locale], locale };
}
