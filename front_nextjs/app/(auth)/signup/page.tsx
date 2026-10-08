"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  RefreshCw,
  Check,
  Loader2,
} from "lucide-react";
import TermsModal from "@/components/TermsModal";
import { useSignup } from "@/hooks/auth/useSignup";
import { generateRandomNickname } from "@/utils/generateRandomNickname";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);
  const [isPrivacyAgreed, setIsPrivacyAgreed] = useState(false);
  const [isMarketingAgreed, setIsMarketingAgreed] = useState(false);
  const [modalType, setModalType] = useState<
    "terms" | "privacy" | "marketing" | null
  >(null);

  //////////////////////////////////////////////////////////////////////////////

  const { mutate: signupMutation, isPending: signupPending } = useSignup();

  const handleSignup = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const refinedEmail = email.trim();
    const refinedNickname = nickname.trim();

    if (!refinedEmail || !refinedNickname || !password || !passwordConfirm) {
      alert("모든 정보를 입력해 주세요.");
      return;
    }

    if (refinedNickname.length < 2) {
      alert("별명은 최소 2자 이상이어야 합니다.");
      return;
    }

    if (refinedNickname.length > 12) {
      alert("별명은 최대 12자 이하이어야 합니다.");
      return;
    }

    if (password !== passwordConfirm) {
      alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    if (!isTermsAgreed || !isPrivacyAgreed) {
      alert("필수 약관에 모두 동의해 주세요.");
      return;
    }

    signupMutation({
      email: refinedEmail,
      nickname: refinedNickname,
      password,
      passwordConfirm,
      isTermsAgreed,
      isPrivacyAgreed,
      isMarketingAgreed,
    });
  };

  //////////////////////////////////////////////////////////////////////////////

  const isAllAgreed = isTermsAgreed && isPrivacyAgreed && isMarketingAgreed;

  const handleAllAgree = () => {
    const newValue = !isAllAgreed;
    setIsTermsAgreed(newValue);
    setIsPrivacyAgreed(newValue);
    setIsMarketingAgreed(newValue);
  };

  const handleAutoGenerateNickname = () => {
    const newNickname = generateRandomNickname();
    setNickname(newNickname);
  };

  //////////////////////////////////////////////////////////////////////////////

  return (
    <main className="min-h-screen w-full bg-[#F2F6F6] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#1A3A3A]/10">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A3A3A] tracking-tight">
            환영해요 🦊
          </h1>
          <p className="text-sm sm:text-base text-[#6E8B8B] mt-1.5 font-medium">
            지금 가입하고, 맞춤형 복지를 누려보세요.
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm sm:text-base font-semibold text-[#1A3A3A]">
              이메일
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-5 h-5 text-[#6E8B8B]" />
              <input
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 pl-11 pr-4 bg-[#F8FAFA] text-base text-[#1A3A3A] placeholder-[#A3B8B8] rounded-xl border border-[#1A3A3A]/10 focus:outline-none focus:border  focus:border-[#FF7F66] transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm sm:text-base font-semibold text-[#1A3A3A]">
              비밀번호
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-5 h-5 text-[#6E8B8B]" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="숫자와 영문 포함 8자 이상"
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

          <div className="space-y-1.5">
            <label className="block text-sm sm:text-base font-semibold text-[#1A3A3A]">
              비밀번호 확인
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-5 h-5 text-[#6E8B8B]" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호 재입력"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className="w-full h-12 pl-11 pr-4 bg-[#F8FAFA] text-base text-[#1A3A3A] placeholder-[#A3B8B8] rounded-xl border border-[#1A3A3A]/10 focus:outline-none focus:border  focus:border-[#FF7F66] transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm sm:text-base font-semibold text-[#1A3A3A]">
              별명
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1 flex items-center">
                <User className="absolute left-3.5 w-5 h-5 text-[#6E8B8B]" />
                <input
                  type="text"
                  placeholder="최소 2자 이상"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 bg-[#F8FAFA] text-base text-[#1A3A3A] placeholder-[#A3B8B8] rounded-xl border border-[#1A3A3A]/10 focus:outline-none focus:border  focus:border-[#FF7F66] transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={handleAutoGenerateNickname}
                className="cursor-pointer h-12 px-4 bg-[#FF7F66]/10 border border-[#FF7F66]/20 text-[#FF7F66] rounded-xl flex items-center gap-1.5 font-semibold text-sm sm:text-base hover:bg-[#FF7F66]/20 transition-colors shrink-0"
              >
                <RefreshCw className="w-4 h-4" />
                추천
              </button>
            </div>
          </div>

          <div className="pt-2 pb-1 space-y-3">
            <label className="block text-sm sm:text-base font-semibold text-[#1A3A3A]">
              약관 동의
            </label>

            <button
              type="button"
              onClick={handleAllAgree}
              className="flex items-center gap-3 w-full text-left py-1 cursor-pointer"
            >
              <div
                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                  isAllAgreed
                    ? "bg-[#FF7F66] border-[#FF7F66]"
                    : "border-gray-300 bg-white"
                }`}
              >
                {isAllAgreed && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
              <span className="font-bold text-sm sm:text-base text-[#1A3A3A]">
                약관 전체 동의
              </span>
            </button>

            <div className="h-px bg-gray-200 my-2" />

            <div className="space-y-2.5 pl-1">
              <div className="flex items-center justify-between text-sm sm:text-base">
                <button
                  type="button"
                  onClick={() => setIsTermsAgreed(!isTermsAgreed)}
                  className="flex items-center gap-2.5 text-left cursor-pointer"
                >
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      isTermsAgreed
                        ? "bg-[#FF7F66] border-[#FF7F66]"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {isTermsAgreed && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-[#1A3A3A]">
                    [필수] 서비스 이용약관 동의
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setModalType("terms")}
                  className="cursor-pointer text-xs sm:text-sm text-[#1A3A3A] font-semibold underline shrink-0 ml-2"
                >
                  보기
                </button>
              </div>

              <div className="flex items-center justify-between text-sm sm:text-base">
                <button
                  type="button"
                  onClick={() => setIsPrivacyAgreed(!isPrivacyAgreed)}
                  className="flex items-center gap-2.5 text-left cursor-pointer"
                >
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      isPrivacyAgreed
                        ? "bg-[#FF7F66] border-[#FF7F66]"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {isPrivacyAgreed && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="text-[#1A3A3A]">
                    [필수] 개인정보 수집 및 이용 동의
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setModalType("privacy")}
                  className="cursor-pointer text-xs sm:text-sm text-[#1A3A3A] font-semibold underline shrink-0 ml-2"
                >
                  보기
                </button>
              </div>

              <div className="flex items-center justify-between text-sm sm:text-base">
                <button
                  type="button"
                  onClick={() => setIsMarketingAgreed(!isMarketingAgreed)}
                  className="flex items-center gap-2.5 text-left cursor-pointer"
                >
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      isMarketingAgreed
                        ? "bg-[#FF7F66] border-[#FF7F66]"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {isMarketingAgreed && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="text-[#1A3A3A]">
                    [선택] 마케팅 정보 수신 동의
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setModalType("marketing")}
                  className="cursor-pointer text-xs sm:text-sm text-[#1A3A3A] font-semibold underline shrink-0 ml-2"
                >
                  보기
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={signupPending}
            className="cursor-pointer w-full h-12 mt-2 bg-[#1A3A3A] hover:bg-[#142E2E] text-white font-bold text-base sm:text-lg rounded-xl flex items-center justify-center transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {signupPending ? (
              <Loader2 className="w-5 h-5 animate-spin text-white" />
            ) : (
              "시작하기"
            )}
          </button>
        </form>

        <div className="flex items-center justify-center gap-2 mt-6 text-sm sm:text-base">
          <span className="text-[#6E8B8B]">이미 계정이 있으신가요?</span>
          <button
            type="button"
            onClick={() => router.back()}
            className="font-bold text-[#FF7F66] hover:underline cursor-pointer"
          >
            로그인
          </button>
        </div>
      </div>

      <TermsModal
        visible={modalType !== null}
        type={modalType}
        onClose={() => setModalType(null)}
      />
    </main>
  );
}
