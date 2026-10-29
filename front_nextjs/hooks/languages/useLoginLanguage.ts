import { useState, useEffect } from "react";

const loginTexts = {
  ko: {
    subtitle: "도움이 필요할때 언제든지 와요",
    emailLabel: "이메일",
    emailPlaceholder: "hong@gildong.com",
    passwordLabel: "비밀번호",
    passwordPlaceholder: "비밀번호 입력",
    showPassword: "비밀번호 보이기",
    hidePassword: "비밀번호 숨기기",
    loginButton: "로그인",
    noAccount: "계정이 없으신가요?",
    signup: "회원가입",
    socialLogin: "간편 로그인",
    appRelease: "🦊 AppStore 정식 출시",
    terms: "서비스 이용약관",
    privacy: "개인정보 처리방침",
    loading: "화면을 불러오는 중...",
    alertEmpty: "이메일과 비밀번호를 모두 입력해 주세요.",
  },
  en: {
    subtitle: "We are always here when you need help",
    emailLabel: "Email",
    emailPlaceholder: "hong@gildong.com",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter password",
    showPassword: "Show password",
    hidePassword: "Hide password",
    loginButton: "Log In",
    noAccount: "Don't have an account?",
    signup: "Sign up",
    socialLogin: "Social Login",
    appRelease: "🦊 Official AppStore Release",
    terms: "Terms of Service",
    privacy: "Privacy Policy",
    loading: "Loading...",
    alertEmpty: "Please enter both email and password.",
  },
};

export function useLoginLanguage() {
  const [locale, setLocale] = useState<"ko" | "en">("ko");

  useEffect(() => {
    const browserLang = navigator.language || navigator.languages[0];
    if (browserLang && browserLang.toLowerCase().startsWith("ko")) {
      setLocale("ko");
    } else {
      setLocale("en");
    }
  }, []);

  return { t: loginTexts[locale], locale };
}
