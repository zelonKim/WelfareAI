"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Coffee,
  ExternalLink,
  Heart,
  ShieldCheck,
} from "lucide-react";

export default function DonationPage() {
  const router = useRouter();
  const DONATION_WEB_URL = "https://ko-fi.com/zelonkim";

  const handleOpenWebPage = () => {
    window.open(DONATION_WEB_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* 상단 커스텀 헤더 */}
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-100 bg-white/80 px-4 backdrop-blur-md">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="뒤로가기"
          className="cursor-pointer flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100 active:scale-95"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold text-slate-900">후원하기</h1>
        <div className="w-10" /> {/* 좌우 대칭용 여백 */}
      </header>

      {/* 메인 스크롤 콘텐츠 영역 */}
      <main className="mx-auto flex max-w-lg flex-col items-center px-6 py-8">
        {/* 중앙 하트 아이콘 */}
        <div className="mb-6 mt-4 flex h-24 w-24 items-center justify-center rounded-full bg-red-50">
          <Heart className="h-12 w-12 fill-red-500 text-red-500" />
        </div>

        {/* 타이틀 및 메인 설명 문구 (16px 이상 시원한 폰트) */}
        <h2 className="mb-3 text-center text-2xl font-bold text-slate-900 sm:text-3xl">
          WelfareAI와 함께해 주세요
        </h2>
        <p className="mb-8 text-center text-base leading-relaxed text-slate-600 sm:text-lg">
          WelfareAI는 누구나 쉽고 편리하게 복지 서비스에 접근할 수 있도록 돕는
          비영리 오픈소스 플랫폼입니다.
        </p>

        {/* 상세 안내 카드 */}
        <div className="mb-8 w-full rounded-2xl bg-slate-50 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <Coffee className="mt-0.5 h-6 w-6 shrink-0 text-[#1E2E2A]" />
            <p className="text-base leading-relaxed text-slate-700">
              소중한 후원금은 서버 유지비, AI 토큰비, 개발 및 유지보수비 등으로
              사용됩니다.
            </p>
          </div>

          <div className="mt-5 flex items-start gap-4">
            <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-emerald-500" />
            <p className="text-base leading-relaxed text-slate-700">
              안전한 서드파티 플랫폼을 통해 개인정보 노출 없이 마음을 전하실 수
              있습니다.
            </p>
          </div>
        </div>

        {/* 외부 웹페이지 연결 버튼 */}
        <button
          type="button"
          onClick={handleOpenWebPage}
          className="cursor-pointer flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#1E2E2A] text-lg font-bold text-white shadow-lg shadow-[#1E2E2A]/20 transition hover:bg-[#1E2E2A]/90 active:scale-[0.98]"
        >
          <span>함께하러 가기</span>
          <ExternalLink className="h-5 w-5" />
        </button>

        {/* 하단 안내 텍스트 */}
        <p className="mt-4 text-center text-sm text-slate-400">
          - 버튼을 누르면 후원 웹페이지로 이동합니다.
        </p>
      </main>
    </div>
  );
}
