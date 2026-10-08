"use client";

import { SocialLoginButtonsProps } from "@/types/auth/SocialLoginButtonsProps";
import { GoogleLogin } from "@react-oauth/google";

export function SocialLoginButtons({
  onGoogleSuccess,
  onAppleLogin,
  isSocialPending,
}: SocialLoginButtonsProps) {
  return (
    <div className="flex flex-col gap-3.5 w-full">
      <div className="relative w-full h-12.5 bg-gray-50 hover:bg-gray-100 text-black text-[17px] font-semibold rounded-2xl border border-neutral-300 flex items-center justify-center gap-2.5 overflow-hidden shadow-xs">
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>Google로 로그인</span>

        <div className=" absolute inset-0 opacity-0 cursor-pointer flex items-center justify-center">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              if (credentialResponse.credential) {
                onGoogleSuccess(credentialResponse.credential);
              } else {
                alert("구글 인증 토큰을 가져오지 못했습니다.");
              }
            }}
            onError={() => {
              alert("구글 로그인에 실패했습니다.");
            }}
            useOneTap={false}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onAppleLogin}
        disabled={isSocialPending}
        className="cursor-pointer hover:bg-gray-900 w-full h-12.5 bg-black text-white text-[17px] font-semibold rounded-2xl border border-neutral-300 flex items-center justify-center gap-2.5 transition active:scale-[0.98] disabled:opacity-50"
      >
        <svg className="w-5 h-5 mb-0.5 fill-current" viewBox="0 0 170 170">
          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.82.25-9.74-1.8-14.75-6.14-3.23-2.76-7.1-7.44-11.62-14.04-6.41-9.35-11.41-20.08-15-32.21-3.59-12.13-5.39-23.83-5.39-35.1 0-14.75 3.75-26.79 11.25-36.12 7.5-9.33 16.89-14.07 28.17-14.22 4.82 0 10.08 1.15 15.78 3.45 5.7 2.3 9.7 3.52 12 3.66 2.01 0 6.13-1.28 12.37-3.84 6.24-2.56 11.75-3.71 16.53-3.45 12.3.93 22.06 5.58 29.28 13.95-10.97 6.64-16.32 15.82-16.05 27.53.27 9.17 3.84 16.84 10.72 23 6.88 6.16 15.12 9.77 24.72 10.83-2.52 7.62-5.92 15.22-10.2 22.8zM119.22 31.84c0-6.95 2.52-13.72 7.56-20.31 5.04-6.59 11.51-10.78 19.41-11.53.13 1.01.2 1.88.2 2.62 0 6.81-2.6 13.68-7.8 20.61-5.2 6.93-11.69 11.08-19.47 12.45-.13-.9-.2-2.18-.2-3.84z" />
        </svg>
        <span>Apple로 로그인</span>
      </button>
    </div>
  );
}
