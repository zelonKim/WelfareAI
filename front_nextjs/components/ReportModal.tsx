"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import { useCreateReport } from "@/hooks/report/useCreateReport";
import { ReportReason } from "@/types/report/CreateReportPayload";
import { ReportModalProps } from "@/types/report/ReportModalProps";

const reportModalTexts = {
  ko: {
    modalTitle: "신고하기",
    closeAria: "닫기",
    targetLabel: "신고 대상",
    targetPlaceholder: "신고할 대상의 별명을 입력해주세요.",
    reasonLabel: "신고 사유 선택",
    detailsLabel: "상세 내용 입력",
    detailsPlaceholder: "신고 사유를 상세하게 작성해주세요.",
    cancelButton: "취소",
    submitButton: "접수하기",
    alertNoUser: "신고할 대상자의 별명을 입력해주세요.",
    alertNoDetails: "상세 신고 내용을 입력해주세요.",
    reasons: {
      SPAM: "스팸 / 도배",
      INAPPROPRIATE: "부적절한 내용 / 음란물",
      ABUSE: "욕설 / 비하 및 차별",
      IMPERSONATION: "사기 / 허위 사실",
      OTHER: "기타",
    } as Record<ReportReason, string>,
  },
  en: {
    modalTitle: "Report",
    closeAria: "Close",
    targetLabel: "Target User",
    targetPlaceholder: "Enter the nickname of the user to report.",
    reasonLabel: "Select Report Reason",
    detailsLabel: "Detailed Information",
    detailsPlaceholder: "Please describe the reason for reporting in detail.",
    cancelButton: "Cancel",
    submitButton: "Submit",
    alertNoUser: "Please enter the nickname of the target user.",
    alertNoDetails: "Please enter detailed report content.",
    reasons: {
      SPAM: "Spam / Flooding",
      INAPPROPRIATE: "Inappropriate Content / Explicit",
      ABUSE: "Abuse / Hate Speech & Discrimination",
      IMPERSONATION: "Fraud / False Information",
      OTHER: "Other",
    } as Record<ReportReason, string>,
  },
};

const REASON_KEYS: ReportReason[] = [
  "SPAM",
  "INAPPROPRIATE",
  "ABUSE",
  "IMPERSONATION",
  "OTHER",
];

export const ReportModal: React.FC<ReportModalProps> = ({
  visible,
  onClose,
  initialUserName = "",
}) => {
  const [locale, setLocale] = useState<"ko" | "en">("ko");

  useEffect(() => {
    const browserLang = navigator.language || navigator.languages[0];
    if (browserLang && browserLang.toLowerCase().startsWith("ko")) {
      setLocale("ko");
    } else {
      setLocale("en");
    }
  }, []);

  const t = reportModalTexts[locale];

  const [reportedUserName, setReportedUserName] = useState(initialUserName);
  const [selectedReason, setSelectedReason] = useState<ReportReason>("SPAM");
  const [details, setDetails] = useState("");

  const resetAndClose = useCallback(() => {
    setReportedUserName(initialUserName);
    setSelectedReason("SPAM");
    setDetails("");
    onClose();
  }, [initialUserName, onClose]);

  useEffect(() => {
    setReportedUserName(initialUserName);
  }, [initialUserName]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && visible) {
        resetAndClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [visible, resetAndClose]);

  const { mutate: createReport, isPending } = useCreateReport(() => {
    resetAndClose();
  });

  const handleSubmit = (e?: React.SubmitEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();

    if (!reportedUserName.trim()) {
      alert(t.alertNoUser);
      return;
    }

    if (!details.trim()) {
      alert(t.alertNoDetails);
      return;
    }

    createReport({
      reportedUserName: reportedUserName.trim(),
      reason: selectedReason,
      details: details.trim(),
    });
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={resetAndClose} />

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>🚨</span> {t.modalTitle}
          </h2>
          <button
            type="button"
            onClick={resetAndClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label={t.closeAria}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5 overflow-y-auto flex-1"
        >
          <div>
            <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1.5">
              {t.targetLabel}
            </label>
            <input
              type="text"
              placeholder={t.targetPlaceholder}
              value={reportedUserName}
              onChange={(e) => setReportedUserName(e.target.value)}
              className="w-full px-4 py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
              {t.reasonLabel}
            </label>
            <div className="space-y-2">
              {REASON_KEYS.map((reasonKey) => {
                const isSelected = selectedReason === reasonKey;
                return (
                  <button
                    key={reasonKey}
                    type="button"
                    onClick={() => setSelectedReason(reasonKey)}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all text-sm sm:text-base font-medium cursor-pointer ${
                      isSelected
                        ? "bg-red-50 border-red-500 text-red-600 font-semibold"
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {t.reasons[reasonKey]}{" "}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1.5">
              {t.detailsLabel}
            </label>
            <textarea
              rows={4}
              placeholder={t.detailsPlaceholder}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full px-4 py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={resetAndClose}
              disabled={isPending}
              className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm sm:text-base transition-colors cursor-pointer disabled:opacity-50"
            >
              {t.cancelButton}
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold rounded-xl text-sm sm:text-base transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin text-white" />
              ) : (
                t.submitButton
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
