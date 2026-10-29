import { useState, useEffect } from "react";

const socialLoginTexts = {
  ko: {
    googleLogin: "Google로 로그인",
    appleLogin: "Apple로 로그인",
    tokenError: "구글 인증 토큰을 가져오지 못했습니다.",
    loginError: "구글 로그인에 실패했습니다.",
  },
  en: {
    googleLogin: "Sign in with Google",
    appleLogin: "Sign in with Apple",
    tokenError: "Failed to retrieve Google authentication token.",
    loginError: "Google login failed.",
  },
};

export function useSocialLoginLanguage() {
  const [locale, setLocale] = useState<"ko" | "en">("ko");

  useEffect(() => {
    const browserLang = navigator.language || navigator.languages[0];
    if (browserLang && browserLang.toLowerCase().startsWith("ko")) {
      setLocale("ko");
    } else {
      setLocale("en");
    }
  }, []);

  return { t: socialLoginTexts[locale], locale };
}