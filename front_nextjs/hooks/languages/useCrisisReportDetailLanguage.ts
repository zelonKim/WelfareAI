import { useState, useEffect } from "react";

const crisisReportDetailTexts = {
  ko: {
    headerTitle: "위기 제보 상세",
    backAria: "뒤로가기",
    moreAria: "더보기",
    editButton: "수정하기",
    deleteButton: "삭제하기",
    reportAria: "신고하기",
    locationLabel: "제보 위치",
    authorLabel: "제보자",
    commentsTitle: "댓글",
    noComments: "첫번째 댓글을 남겨보세요!",
    commentPlaceholder: "댓글을 입력해주세요...",
    sendAria: "보내기",
    deleteCommentAria: "댓글 삭제",

    deleteReportConfirm: "정말로 이 제보를 삭제하시겠습니까?",
    deleteCommentConfirm: "정말로 이 댓글을 삭제하시겠습니까?",
    blockConfirmPrefix: "정말 ",
    blockConfirmSuffix:
      "님을 차단하시겠습니까?\n차단한 사용자의 댓글은 더 이상 보이지 않습니다.",
    loadingError: "제보 내역을 불러올 수 없습니다.",
  },
  en: {
    headerTitle: "Report Details",
    backAria: "Go back",
    moreAria: "More options",
    editButton: "Edit",
    deleteButton: "Delete",
    reportAria: "Report",
    locationLabel: "Location",
    authorLabel: "Author",
    commentsTitle: "Comments",
    noComments: "Be the first to leave a comment!",
    commentPlaceholder: "Write a comment...",
    sendAria: "Send",
    deleteCommentAria: "Delete comment",

    deleteReportConfirm: "Are you sure you want to delete this report?",
    deleteCommentConfirm: "Are you sure you want to delete this comment?",
    blockConfirmPrefix: "Are you sure you want to block ",
    blockConfirmSuffix: "?\nBlocked users' comments will no longer be visible.",
    loadingError: "Failed to load report details.",
  },
};

export function useCrisisReportDetailLanguage() {
  const [locale, setLocale] = useState<"ko" | "en">("ko");

  useEffect(() => {
    const browserLang = navigator.language || navigator.languages[0];
    if (browserLang && browserLang.toLowerCase().startsWith("ko")) {
      setLocale("ko");
    } else {
      setLocale("en");
    }
  }, []);

  return { t: crisisReportDetailTexts[locale], locale };
}
