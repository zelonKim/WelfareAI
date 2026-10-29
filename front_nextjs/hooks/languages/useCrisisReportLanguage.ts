import { useState, useEffect } from "react";

const crisisReportTexts = {
  ko: {
    headerTitle: "위기 이웃 제보",
    allTab: "전체 제보",
    myTab: "내가 쓴 제보",
    loadingReports: "제보 내역을 불러오는 중...",
    emptyAll: "등록된 제보 내역이 없습니다.",
    emptyMy: "작성한 제보 내역이 없습니다.",
    reportButton: "제보하기",
    alertTitle: "제목을 입력해 주세요.",
    alertContent: "상세 내용을 입력해 주세요.",
    alertAddress: "위치를 입력해 주세요.",
  },
  en: {
    headerTitle: "Crisis Neighbor Report",
    allTab: "All Reports",
    myTab: "My Reports",
    loadingReports: "Loading report history...",
    emptyAll: "No registered reports found.",
    emptyMy: "No reports written by you found.",
    reportButton: "Report",
    alertTitle: "Please enter a title.",
    alertContent: "Please enter detailed content.",
    alertAddress: "Please enter a location.",
  },
};

export function useCrisisReportLanguage() {
  const [locale, setLocale] = useState<"ko" | "en">("ko");

  useEffect(() => {
    const browserLang = navigator.language || navigator.languages[0];
    if (browserLang && browserLang.toLowerCase().startsWith("ko")) {
      setLocale("ko");
    } else {
      setLocale("en");
    }
  }, []);

  return { t: crisisReportTexts[locale], locale };
}
