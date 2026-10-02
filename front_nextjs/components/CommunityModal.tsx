"use client";

import React, { useEffect } from "react";
import { X, MessagesCircle, HeartHandshake, Loader2 } from "lucide-react";
import { CommunityModalProps } from "@/types/community/CommunityModalProps";

export default function CommunityModal({
  modalType,
  visible,
  onClose,
  title,
  setTitle,
  content,
  setContent,
  notice,
  setNotice,
  communityType,
  setCommunityType,
  createCommunityPending = false,
  handleCreateCommunity,
}: CommunityModalProps) {
  // ESC 키로 모달 닫기 및 배경 스크롤 방지
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (visible) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm animate-fade-in">
      {/* 모달 카드의 바깥 영역 클릭 시 닫기 */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* 모달 메인 Card */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
            {modalType === "tabs" ? "모임 만들기" : "모임 수정하기"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg transition-colors cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 폼 스크롤 영역 */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* 1. 모임 성격 선택 (tabs 모달일 때) */}
          {modalType === "tabs" && setCommunityType && (
            <div className="space-y-2">
              <label className="block text-base font-semibold text-gray-800">
                모임 성격
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCommunityType("SELF_HELP")}
                  className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl border-2 font-bold text-base transition-all cursor-pointer ${
                    communityType === "SELF_HELP"
                      ? "bg-[#FFEFEA] border-[#FF6C4B] text-[#FF6C4B]"
                      : "bg-[#F2F5F6] border-transparent text-[#8E99A3] hover:bg-gray-200/60"
                  }`}
                >
                  <MessagesCircle className="w-5 h-5" />
                  <span>소통 모임</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCommunityType("VOLUNTEER")}
                  className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl border-2 font-bold text-base transition-all cursor-pointer ${
                    communityType === "VOLUNTEER"
                      ? "bg-[#FFEFEA] border-[#FF6C4B] text-[#FF6C4B]"
                      : "bg-[#F2F5F6] border-transparent text-[#8E99A3] hover:bg-gray-200/60"
                  }`}
                >
                  <HeartHandshake className="w-5 h-5" />
                  <span>봉사 모임</span>
                </button>
              </div>
            </div>
          )}

          {/* 2. 모임 제목 */}
          <div className="space-y-2">
            <label className="block text-base font-semibold text-gray-800">
              제목
            </label>
            <input
              type="text"
              placeholder="예: 치매 어르신 가족 소통방"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-[#F8F9FA] border border-gray-200 rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FF6C4B] focus:bg-white transition-all"
            />
          </div>

          {/* 3. 상세 내용 */}
          <div className="space-y-2">
            <label className="block text-base font-semibold text-gray-800">
              내용
            </label>
            <textarea
              placeholder="모임 내용에 대해 적어주세요."
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 bg-[#F8F9FA] border border-gray-200 rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FF6C4B] focus:bg-white transition-all resize-none"
            />
          </div>

          {/* 4. 공지사항 (detail 모달일 때) */}
          {modalType === "detail" && setNotice && (
            <div className="space-y-2">
              <label className="block text-base font-semibold text-gray-800">
                공지사항
              </label>
              <textarea
                placeholder="공지사항에 대해 입력해주세요."
                rows={3}
                value={notice}
                onChange={(e) => setNotice(e.target.value)}
                className="w-full px-4 py-3 bg-[#F8F9FA] border border-gray-200 rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FF6C4B] focus:bg-white transition-all resize-none"
              />
            </div>
          )}

          {/* 버튼 영역 */}
          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-bold text-base transition-colors cursor-pointer"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleCreateCommunity}
              disabled={createCommunityPending}
              className={`flex-[1.5] flex items-center justify-center py-3.5 px-4 bg-[#1A3A3A] hover:bg-[#255252] text-white rounded-xl font-bold text-base transition-all cursor-pointer ${
                createCommunityPending ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {createCommunityPending ? (
                <Loader2 className="w-5 h-5 animate-spin text-white" />
              ) : modalType === "tabs" ? (
                "개설하기"
              ) : (
                "보완하기"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
