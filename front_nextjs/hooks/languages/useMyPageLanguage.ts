// src/hooks/languages/useMyPageLanguage.ts
import { useState, useEffect } from "react";

const myPageTexts = {
  ko: {
    headerTitle: "환경 설정",
    editProfile: "변경하기",
    appSettings: "앱 설정",
    menuTogetherTitle: "함께하기",
    menuTogetherDesc: "서비스 운영과 발전에 함께합니다.",
    menuReportTitle: "신고하기",
    menuReportDesc: "악성 댓글 및 대화를 신고합니다.",
    menuBlockTitle: "차단하기",
    menuBlockDesc: "악성 댓글 및 대화를 차단합니다.",
    menuTermsTitle: "서비스 이용약관",
    menuTermsDesc: "서비스 약관에 대해 살펴봅니다.",
    menuPrivacyTitle: "개인정보 처리방침",
    menuPrivacyDesc: "개인정보 처리에 대해 살펴봅니다.",
    logout: "로그아웃",
    deleteAccount: "회원탈퇴",

    confirmLogout: "정말 로그아웃 하시겠습니까?",
    confirmDeleteAccount:
      "정말로 탈퇴하시겠습니까? 탈퇴한 계정 정보는 복구할 수 없습니다.",
  },
  en: {
    headerTitle: "Settings",
    editProfile: "Edit",
    appSettings: "App Settings",
    menuTogetherTitle: "Support Us",
    menuTogetherDesc: "Join us in service operation and development.",
    menuReportTitle: "Report",
    menuReportDesc: "Report malicious comments and conversations.",
    menuBlockTitle: "Block",
    menuBlockDesc: "Block abusive users and comments.",
    menuTermsTitle: "Terms of Service",
    menuTermsDesc: "Review our service terms and conditions.",
    menuPrivacyTitle: "Privacy Policy",
    menuPrivacyDesc: "Review how we process personal information.",
    logout: "Log Out",
    deleteAccount: "Delete Account",

    confirmLogout: "Are you sure you want to log out?",
    confirmDeleteAccount:
      "Are you sure you want to delete your account? Account information cannot be restored once deleted.",
  },
};

export function useMyPageLanguage() {
  const [locale, setLocale] = useState<"ko" | "en">("ko");

  useEffect(() => {
    const browserLang = navigator.language || navigator.languages[0];
    if (browserLang && browserLang.toLowerCase().startsWith("ko")) {
      setLocale("ko");
    } else {
      setLocale("en");
    }
  }, []);

  return { t: myPageTexts[locale], locale };
}
