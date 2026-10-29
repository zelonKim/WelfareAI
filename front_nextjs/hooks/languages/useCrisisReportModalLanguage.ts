import { useState, useEffect } from "react";

const crisisReportModalTexts = {
  ko: {
    modalTitle: "📢 위기 이웃 제보하기",
    closeAria: "닫기",
    titleLabel: "제목",
    titlePlaceholder: "예: 단전/단수가 의심되는 가구 제보",
    contentLabel: "상세 내용",
    contentPlaceholder: "위기 상황에 대해 자세히 적어주세요.",
    locationLabel: "위치",
    locationPlaceholder: "위치를 입력해주세요",
    currentLocation: "현위치",
    photoLabel: "현장 사진",
    addPhoto: "사진 추가",
    cancelButton: "취소",
    submitting: "제출 중...",
    submitButton: "제출하기",
  },
  en: {
    modalTitle: "📢 Report a Crisis Neighbor",
    closeAria: "Close",
    titleLabel: "Title",
    titlePlaceholder:
      "e.g., Report on household suspected of power/water cutoff",
    contentLabel: "Detailed Content",
    contentPlaceholder: "Please describe the crisis situation in detail.",
    locationLabel: "Location",
    locationPlaceholder: "Please enter the location",
    currentLocation: "Current Location",
    photoLabel: "Site Photos",
    addPhoto: "Add Photo",
    cancelButton: "Cancel",
    submitting: "Submitting...",
    submitButton: "Submit",
  },
};

export function useCrisisReportModalLanguage() {
  const [locale, setLocale] = useState<"ko" | "en">("ko");

  useEffect(() => {
    const browserLang = navigator.language || navigator.languages[0];
    if (browserLang && browserLang.toLowerCase().startsWith("ko")) {
      setLocale("ko");
    } else {
      setLocale("en");
    }
  }, []);

  return { t: crisisReportModalTexts[locale], locale };
}
