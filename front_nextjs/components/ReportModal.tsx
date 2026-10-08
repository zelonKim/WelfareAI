"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import { REPORT_REASONS } from "@/constants/ReportResons";
import { useCreateReport } from "@/hooks/report/useCreateReport";
import { ReportReason } from "@/types/report/CreateReportPayload";
import { ReportModalProps } from "@/types/report/ReportModalProps";

export const ReportModal: React.FC<ReportModalProps> = ({
  visible,
  onClose,
  initialUserName = "",
}) => {
  const [reportedUserName, setReportedUserName] = useState(initialUserName);
  const [selectedReason, setSelectedReason] = useState<ReportReason>("SPAM");
  const [details, setDetails] = useState("");

  const resetAndClose = useCallback(() => {
    setReportedUserName(initialUserName);
    setSelectedReason("SPAM");
    setDetails("");
    onClose();
  }, [initialUserName, onClose]);

  ////////////////////////////////////////////////////////////////////////////////////

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

  ////////////////////////////////////////////////////////////////////////////////////

  const { mutate: createReport, isPending } = useCreateReport(() => {
    resetAndClose();
  });

  const handleSubmit = (e?: React.SubmitEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();

    if (!reportedUserName.trim()) {
      alert("신고할 대상자의 별명을 입력해주세요.");
      return;
    }

    if (!details.trim()) {
      alert("상세 신고 내용을 입력해주세요.");
      return;
    }

    createReport({
      reportedUserName: reportedUserName.trim(),
      reason: selectedReason,
      details: details.trim(),
    });
  };

  if (!visible) return null;

  ////////////////////////////////////////////////////////////////////////////////////

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={resetAndClose} />

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>🚨</span> 신고하기
          </h2>
          <button
            type="button"
            onClick={resetAndClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="닫기"
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
              신고 대상
            </label>
            <input
              type="text"
              placeholder="신고할 대상의 별명을 입력해주세요."
              value={reportedUserName}
              onChange={(e) => setReportedUserName(e.target.value)}
              className="w-full px-4 py-3 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
              신고 사유 선택
            </label>
            <div className="space-y-2">
              {REPORT_REASONS.map((item) => {
                const isSelected = selectedReason === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setSelectedReason(item.value)}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all text-sm sm:text-base font-medium cursor-pointer ${
                      isSelected
                        ? "bg-red-50 border-red-500 text-red-600 font-semibold"
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-1.5">
              상세 내용 입력
            </label>
            <textarea
              rows={4}
              placeholder="신고 사유를 상세하게 작성해주세요."
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
              취소
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold rounded-xl text-sm sm:text-base transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin text-white" />
              ) : (
                "접수하기"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
