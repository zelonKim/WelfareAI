import { useState, useEffect } from "react";

const blockModalTexts = {
  ko: {
    modalTitle: "차단 관리",
    closeAria: "닫기",
    blockSectionTitle: "유저 차단하기",
    inputPlaceholder: "차단할 유저 별명 입력",
    blockButton: "차단하기",
    blockedListTitle: "차단된 유저 목록",
    emptyList: "차단된 유저가 없습니다.",
    unblockButton: "해제하기",
    alertNoUsername: "차단할 유저의 별명을 입력해주세요.",
    blockSuccess: (name: string) => `'${name}' 님을 차단했습니다.`,
    unblockConfirm: (name: string) => `'${name}' 님의 차단을 해제하시겠습니까?`,
  },
  en: {
    modalTitle: "Block Management",
    closeAria: "Close",
    blockSectionTitle: "Block User",
    inputPlaceholder: "Enter user nickname to block",
    blockButton: "Block",
    blockedListTitle: "Blocked Users",
    emptyList: "No blocked users.",
    unblockButton: "Unblock",
    alertNoUsername: "Please enter the nickname of the user to block.",
    blockSuccess: (name: string) => `Blocked '${name}'.`,
    unblockConfirm: (name: string) =>
      `Are you sure you want to unblock '${name}'?`,
  },
};

export function useBlockModalLanguage() {
  const [locale, setLocale] = useState<"ko" | "en">("ko");

  useEffect(() => {
    const browserLang = navigator.language || navigator.languages[0];
    if (browserLang && browserLang.toLowerCase().startsWith("ko")) {
      setLocale("ko");
    } else {
      setLocale("en");
    }
  }, []);

  return { t: blockModalTexts[locale], locale };
}
