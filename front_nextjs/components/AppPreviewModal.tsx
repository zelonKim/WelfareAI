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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#FFEFEA] p-7 shadow-2xl border border-teal-900/10 transition-all">
        <button
          onClick={onClose}
          className="cursor-pointer absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-black/5 hover:text-gray-600 transition-colors"
          aria-label="닫기"
        >
          ✕
        </button>
        <div className="flex flex-col items-center text-center">
          <h3 className="text-xl font-bold text-[#1A3A3A] tracking-tight">
            🦊{" "}
            {modalOS === "android" ? "Android 앱 다운로드" : "iOS 앱 다운로드"}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            스마트폰 카메라로 QR코드를 스캔해 주세요.
          </p>
        </div>
        <div className="mt-2 flex flex-col items-center justify-center  p-6  ">
          <div className="bg-white p-3.5 rounded-2xl shadow-md border border-teal-950/5 transition-transform hover:scale-[1.02]">
            <Image
              src="/welfareAI_android_qr.png"
              alt="App Download QR Code"
              width={200}
              height={200}
              className="rounded-xl object-contain"
            />
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span className="relative flex h-2 w-2"></span>
            <span className="text-xs font-semibold text-[#1A3A3A]">
              {modalOS === "android"
                ? "Preview 빌드 앱 다운로드"
                : "TestFlight 공개 링크 참여"}
            </span>
          </div>
        </div>
        ㄴ
      </div>
    </div>
  );
}
