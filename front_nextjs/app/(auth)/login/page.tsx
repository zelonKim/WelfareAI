"use client";

import React, { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useLogin } from "@/hooks/auth/useLogin";
import { useSocialLogin } from "@/hooks/auth/useSocialLogin";
import { handleAppleLogin } from "@/utils/handleAppleLogin";
import { SocialLoginButtons } from "@/components/SocialLoginButtons";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "@/constants/SocialLoginCredentials";
import { useRouter, useSearchParams } from "next/navigation";

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: loginMutation, isPending: loginPending } = useLogin();

  const { mutate: socialLoginMutation, isPending: socialLoginPending } =
    useSocialLogin();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      alert("이메일과 비밀번호를 모두 입력해 주세요.");
      return;
    }
    loginMutation({ email: email.trim(), password });
  };

  useEffect(() => {
    const idToken = searchParams.get("id_token");
    if (idToken) {
      socialLoginMutation({ idToken, provider: "apple" });
    }
  }, [searchParams, socialLoginMutation]);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <main className="min-h-screen w-full bg-[#F2F6F6] flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#1A3A3A]/10">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="relative w-16 h-16 mb-2 overflow-hidden rounded-[20px]">
              <Image
                src="/icon.png"
                alt="WelfareAI Logo"
                width={72}
                height={72}
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-[33px] font-black text-[#1A3A3A] tracking-tight">
              <span className="text-[#FF7F66]">W</span>elfare
              <span className="text-[#FF7F66]">A</span>I
            </h1>
            <p className="text-base text-[#6E8B8B] font-medium">
              도움이 필요할때 언제든지 와요
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm sm:text-base font-semibold text-[#1A3A3A]">
                이메일
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 w-5 h-5 text-[#6E8B8B]" />
                <input
                  type="email"
                  placeholder="hong@gildong.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 bg-[#F8FAFA] text-base text-[#1A3A3A] placeholder-[#A3B8B8] rounded-xl border border-[#1A3A3A]/10 focus:outline-none focus:border  focus:border-[#FF7F66] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm sm:text-base font-semibold text-[#1A3A3A]">
                비밀번호
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-5 h-5 text-[#6E8B8B]" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호 입력"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 pl-11 pr-12 bg-[#F8FAFA] text-base text-[#1A3A3A] placeholder-[#A3B8B8] rounded-xl border border-[#1A3A3A]/10 focus:outline-none focus:border  focus:border-[#FF7F66] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 p-1 text-[#6E8B8B] hover:text-[#1A3A3A] transition-colors"
                  aria-label={
                    showPassword ? "비밀번호 숨기기" : "비밀번호 보이기"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginPending}
              className="cursor-pointer w-full h-12 mt-2 bg-[#1A3A3A] hover:bg-[#142E2E] text-white font-bold text-base sm:text-lg rounded-xl flex items-center justify-center transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loginPending ? (
                <Loader2 className="w-5 h-5 animate-spin text-white" />
              ) : (
                "로그인"
              )}
            </button>
          </form>

          <div className="flex items-center justify-center gap-2 mt-6 text-sm sm:text-base">
            <span className="text-[#6E8B8B]">계정이 없으신가요?</span>
            <Link
              href="/signup"
              className="font-bold text-[#FF7F66] hover:underline"
            >
              회원가입
            </Link>
          </div>

          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-[#E5E7EB]" />
            <span className="px-3 text-sm text-[#9CA3AF] font-medium">
              간편 로그인
            </span>
            <div className="flex-1 h-px bg-[#E5E7EB]" />
          </div>

          {socialLoginPending ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-[#6E8B8B]" />
            </div>
          ) : (
            <SocialLoginButtons
              onGoogleSuccess={(token) =>
                socialLoginMutation({ idToken: token, provider: "google" })
              }
              onAppleLogin={handleAppleLogin}
              isSocialPending={socialLoginPending}
            />
          )}

          <div className="pt-8 text-center space-y-4 ">
            <div className="bg-[#1A3A3A]/10 p-3 rounded-xl border border-[#1A3A3A]/20 ">
              <p className="text-sm font-medium text-[#1A3A3A] mb-2">
                🦊 10월 중 앱 출시 예정
              </p>
              <div className="flex justify-center items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    alert("안드로이드 앱이 10월 중에 출시될 예정입니다! 📱")
                  }
                  className="cursor-pointer hover:scale-103 active:scale-95 transition-transform"
                >
                  <Image
                    src="/playStore.png"
                    alt="Get it on Google Play"
                    width={120}
                    height={36}
                    className="h-10 w-auto"
                  />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    alert("iOS 앱이 10월 중에 출시될 예정입니다! 📱")
                  }
                  className="cursor-pointer hover:scale-103 active:scale-95 transition-transform"
                >
                  <Image
                    src="/appStore.svg"
                    alt="Download on the App Store"
                    width={120}
                    height={36}
                    className="h-10.5 w-auto"
                  />
                </button>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex justify-center items-center gap-3 text-xs text-[#1A3A3A]">
                <button
                  type="button"
                  onClick={() => router.push("/terms")}
                  className=" transition hover:underline underline-offset-3 hover:font-semibold cursor-pointer"
                >
                  서비스 이용약관
                </button>
                <span>|</span>
                <button
                  type="button"
                  onClick={() => router.push("/privacy")}
                  className=" transition hover:underline underline-offset-3 hover:font-semibold cursor-pointer"
                >
                  개인정보 처리방침
                </button>
              </div>

              <p className="mt-2 text-[11px] text-[#555]">
                Copyright © 2026 OpenWelfare. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </main>
    </GoogleOAuthProvider>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          로딩 중...
        </div>
      }
    >
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <LoginContent />
      </GoogleOAuthProvider>
    </Suspense>
  );
}
