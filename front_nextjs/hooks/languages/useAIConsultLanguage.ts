import { useState, useEffect } from "react";

const aiConsultTexts = {
  ko: {
    headerTitle: "AI 복지 상담",
    deleteAllConfirm: "대화 내역을 모두 삭제하고, 초기화 하시겠습니까?",
    deleteItemConfirm: "정말로 해당 상담 내역을 삭제하시겠습니까?",
    fetchingHistory: "이전 상담 내역을 가져오는 중...",
    welcomeMessage:
      "안녕하세요! 맞춤 복지 상담 AI비서 웰폭스입니다.🦊 궁금한 복지 혜택 및 제도를 편하게 말씀해 주세요.",
    aiLoading: "AI가 관련 복지 정책을 찾아보고 있어요.🦊",
    inputPlaceholder: "상담받고 싶은 내용을 입력해 보세요...",
    scrollToTop: "맨 위로 이동",
    sendButton: "보내기",
    deleteAllTooltip: "대화 내역 초기화",
    messageTooltip: "우클릭 시 메시지 삭제 가능",
  },
  en: {
    headerTitle: "AI Welfare Consultation",
    deleteAllConfirm:
      "Are you sure you want to delete all chat history and reset?",
    deleteItemConfirm:
      "Are you sure you want to delete this consultation history?",
    fetchingHistory: "Loading previous consultation history...",
    welcomeMessage:
      "Hello! I am WelFox, your personalized welfare consultation AI assistant. 🦊 Feel free to ask about any welfare benefits and programs you are curious about.",
    aiLoading: "AI is searching for relevant welfare policies. 🦊",
    inputPlaceholder: "Type what you would like to consult about...",
    scrollToTop: "Scroll to top",
    sendButton: "Send",
    deleteAllTooltip: "Reset chat history",
    messageTooltip: "Right-click to delete message",
  },
};

export function useAIConsultLanguage() {
  const [locale, setLocale] = useState<"ko" | "en">("ko");

  useEffect(() => {
    const browserLang = navigator.language || navigator.languages[0];
    if (browserLang && browserLang.toLowerCase().startsWith("ko")) {
      setLocale("ko");
    } else {
      setLocale("en");
    }
  }, []);

  return { t: aiConsultTexts[locale], locale };
}
