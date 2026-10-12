"use client";

import React from "react";
import Image from "next/image";
import { AppPreviewModalProps } from "@/types/common/ppPreviewModalProps";

export default function AppPreviewModal({
  isOpen,
  onClose,
  modalOS,
}: AppPreviewModalProps) {
  if (!isOpen) return null;

  const currentQrImage =
    modalOS === "android"
      ? "/welfareAI_android_qr.png"
      : "/welfareAI_ios_qr.png";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* 모달 카드 본체 (동일한 bg-[#FFEFEA] 유지 + 입체감을 주는 은은한 그림자 및 곡률) */}
      <div className="relative w-full max-w-sm rounded-3xl bg-[#FFEFEA] p-7 shadow-2xl border border-teal-900/10 transition-all">
        {/* 닫기 버튼 (터치 영역과 호버 반응 개선) */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-black/5 hover:text-gray-600 transition-colors"
          aria-label="닫기"
        >
          ✕
        </button>

        {/* 상단 뱃지 & 헤더 영역 */}
        <div className="flex flex-col items-center text-center">
          <h3 className="text-xl font-bold text-[#1A3A3A] tracking-tight">
            🦊{" "}
            {modalOS === "android" ? "Android 앱 다운로드" : "iOS 앱 다운로드"}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            스마트폰 카메라로 QR코드를 스캔해 주세요.
          </p>
        </div>

        {/* QR 이미지 출력 영역 (카드와 자연스럽게 대비되는 시각적 집중 구조) */}
        <div className="mt-2 flex flex-col items-center justify-center  p-6  ">
          {/* QR 코드를 들떠 보이게 해주는 화이트 갤러리 래퍼 */}
          <div className="bg-white p-3.5 rounded-2xl shadow-md border border-teal-950/5 transition-transform hover:scale-[1.02]">
            <Image
              src={currentQrImage}
              alt="App Download QR Code"
              width={180}
              height={180}
              className="rounded-xl object-contain"
            />
          </div>

          {/* 하단 상태 가이드 안내 */}
          <div className="mt-4 flex items-center gap-2">
            <span className="relative flex h-2 w-2"></span>
            <span className="text-xs font-semibold text-[#1A3A3A]">
              {modalOS === "android"
                ? "APK 파일 다운로드"
                : "TestFlight 공개 링크 참여"}
            </span>
          </div>
        </div>

        {/* 하단 모바일 사용자를 위한 닫기 패딩 조절 */}
      </div>
    </div>
  );
}
