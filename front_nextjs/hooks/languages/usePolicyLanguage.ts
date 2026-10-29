// src/hooks/languages/usePolicyLanguage.ts
import { useState, useEffect } from "react";
import { CATEGORIES, Category } from "@/constants/Category";

const policyTexts = {
  ko: {
    headerTitle: "복지 지원 정책",
    searchPlaceholder: "검색어를 입력해 보세요.",
    noResultsTitle: "검색 결과가 없습니다",
    noResultsSub: "다른 검색어나 다른 카테고리를 선택해 보세요.",
    scrollToTopAria: "맨 위로 이동",

    categoryLabels: {
      전체: "전체",
      신체건강: "신체건강",
      정신건강: "정신건강",
      생활지원: "생활지원",
      주거: "주거",
      일자리: "일자리",
      "문화/여가": "문화/여가",
      "안전/위기": "안전/위기",
      "임신/출산": "임신/출산",
      보육: "보육",
      교육: "교육",
      "보호/돌봄": "보호/돌봄",
      서민금융: "서민금융",
      법률: "법률",
      관계개선: "관계개선",
      에너지: "에너지",
    } as Record<Category, string>,
  },
  en: {
    headerTitle: "Welfare Policies",
    searchPlaceholder: "Search for policies...",
    noResultsTitle: "No search results found",
    noResultsSub: "Try searching with a different term or category.",
    scrollToTopAria: "Scroll to top",

    categoryLabels: {
      전체: "All",
      신체건강: "Physical Health",
      정신건강: "Mental Health",
      생활지원: "Living Support",
      주거: "Housing",
      일자리: "Employment",
      "문화/여가": "Culture & Leisure",
      "안전/위기": "Safety & Crisis",
      "임신/출산": "Pregnancy & Childbirth",
      보육: "Childcare",
      교육: "Education",
      "보호/돌봄": "Protection & Care",
      서민금융: "Financial Support",
      법률: "Legal",
      관계개선: "Relationship Improvement",
      에너지: "Energy",
    } as Record<Category, string>,
  },
};

export function usePolicyLanguage() {
  const [locale, setLocale] = useState<"ko" | "en">("ko");

  useEffect(() => {
    const browserLang = navigator.language || navigator.languages[0];
    if (browserLang && browserLang.toLowerCase().startsWith("ko")) {
      setLocale("ko");
    } else {
      setLocale("en");
    }
  }, []);

  return {
    t: policyTexts[locale],
    categories: CATEGORIES, 
    locale,
  };
}
