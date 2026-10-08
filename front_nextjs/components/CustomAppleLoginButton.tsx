"use client";

import React from "react";
import { SocialLoginButtonProps } from "@/types/common/SocialLoginButtonProps";

export function CustomAppleLoginButton({ onPress }: SocialLoginButtonProps) {
  return (
    <button
      type="button"
      onClick={onPress}
      className="w-full h-12 px-4 bg-black border border-white rounded-xl flex items-center justify-center hover:bg-neutral-900 transition-colors active:opacity-80"
    >
      <div className="flex items-center justify-center gap-2">
        <svg
          className="w-5 h-5 fill-white mb-0.5"
          viewBox="0 0 170 170"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-5.02.12-9.88-1.93-14.58-6.15-3.12-2.72-7.05-7.44-11.78-14.16-5.83-8.29-10.38-17.71-13.65-28.27-3.27-10.56-4.91-20.66-4.91-30.3 0-14.02 3.65-25.59 10.96-34.7 7.31-9.12 16.32-13.75 27.03-13.89 4.8 0 10.12 1.25 15.96 3.75 5.84 2.5 9.77 3.8 11.78 3.9 1.63 0 5.71-1.35 12.24-4.04 6.53-2.69 11.96-3.95 16.3-3.78 11.78.98 20.89 5.56 27.33 13.74-10.5 6.36-15.63 15.17-15.39 26.43.24 8.81 3.59 16.27 10.05 22.38 6.46 6.11 14.17 9.61 23.13 10.5-2.29 6.75-5.22 13.52-8.79 20.32zM119.22 31.87c0-6.75 2.45-13.25 7.35-19.51 4.9-6.26 10.9-10.06 18-11.4 0.33 3.6.11 7.23-.65 10.89-.76 3.66-2.29 7.14-4.59 10.44-2.29 3.3-5.23 6.05-8.82 8.25-3.59 2.2-7.24 3.4-10.95 3.6-0.22-.54-.34-1.3-.34-2.27z" />
        </svg>
        <span className="text-white text-base font-semibold">
          Apple로 로그인
        </span>
      </div>
    </button>
  );
}
