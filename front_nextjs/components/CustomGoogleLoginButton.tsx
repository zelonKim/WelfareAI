"use client";

import React from "react";
import Image from "next/image";
import { SocialLoginButtonProps } from "@/types/common/SocialLoginButtonProps";

export function CustomGoogleLoginButton({ onPress }: SocialLoginButtonProps) {
  return (
    <button
      type="button"
      onClick={onPress}
      className="w-full h-12 px-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors active:opacity-80"
    >
      <div className="flex items-center justify-center gap-2.5">
        <Image
          src="/google_logo.png"
          alt="Google logo"
          width={18}
          height={18}
          className="object-contain"
        />
        <span className="text-[#1F1F1F] text-base font-semibold">
          Google로 로그인
        </span>
      </div>
    </button>
  );
}
