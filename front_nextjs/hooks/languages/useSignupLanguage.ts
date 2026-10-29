// src/hooks/languages/useSignupLanguage.ts
import { useState, useEffect } from "react";

const signupTexts = {
  ko: {
    welcomeTitle: "환영해요 🦊",
    welcomeSubtitle: "지금 가입하고, 맞춤형 복지를 누려보세요.",
    emailLabel: "이메일",
    emailPlaceholder: "example@email.com",
    passwordLabel: "비밀번호",
    passwordPlaceholder: "숫자와 영문 포함 8자 이상",
    passwordConfirmLabel: "비밀번호 확인",
    passwordConfirmPlaceholder: "비밀번호 재입력",
    showPassword: "비밀번호 보이기",
    hidePassword: "비밀번호 숨기기",
    nicknameLabel: "별명",
    nicknamePlaceholder: "최소 2자 이상",
    recommendButton: "추천",
    termsLabel: "약관 동의",
    allAgree: "약관 전체 동의",
    termsRequired: "[필수] 서비스 이용약관 동의",
    privacyRequired: "[필수] 개인정보 수집 및 이용 동의",
    marketingOptional: "[선택] 마케팅 정보 수신 동의",
    viewButton: "보기",
    startButton: "시작하기",
    hasAccount: "이미 계정이 있으신가요?",
    loginButton: "로그인",

    alertEmpty: "모든 정보를 입력해 주세요.",
    alertNicknameMin: "별명은 최소 2자 이상이어야 합니다.",
    alertNicknameMax: "별명은 최대 12자 이하이어야 합니다.",
    alertPasswordMismatch: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
    alertTermsRequired: "필수 약관에 모두 동의해 주세요.",
  },
  en: {
    welcomeTitle: "Welcome 🦊",
    welcomeSubtitle: "Sign up now and discover your personalized benefits.",
    emailLabel: "Email",
    emailPlaceholder: "example@email.com",
    passwordLabel: "Password",
    passwordPlaceholder: "8+ characters with letters & numbers",
    passwordConfirmLabel: "Confirm Password",
    passwordConfirmPlaceholder: "Re-enter password",
    showPassword: "Show password",
    hidePassword: "Hide password",
    nicknameLabel: "Nickname",
    nicknamePlaceholder: "At least 2 characters",
    recommendButton: "Random",
    termsLabel: "Terms & Conditions",
    allAgree: "Agree to all terms",
    termsRequired: "[Required] Agree to Terms of Service",
    privacyRequired: "[Required] Agree to Privacy Policy",
    marketingOptional: "[Optional] Agree to Marketing Communications",
    viewButton: "View",
    startButton: "Get Started",
    hasAccount: "Already have an account?",
    loginButton: "Log In",

    alertEmpty: "Please enter all required information.",
    alertNicknameMin: "Nickname must be at least 2 characters long.",
    alertNicknameMax: "Nickname must be 12 characters or less.",
    alertPasswordMismatch: "Passwords do not match.",
    alertTermsRequired: "Please agree to all required terms.",
  },
};

export function useSignupLanguage() {
  const [locale, setLocale] = useState<"ko" | "en">("ko");

  useEffect(() => {
    const browserLang = navigator.language || navigator.languages[0];
    if (browserLang && browserLang.toLowerCase().startsWith("ko")) {
      setLocale("ko");
    } else {
      setLocale("en");
    }
  }, []);

  return { t: signupTexts[locale], locale };
}
