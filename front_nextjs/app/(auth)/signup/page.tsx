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
import { useSignupLanguage } from "@/hooks/languages/useSignupLanguage";

export default function SignupPage() {
  const router = useRouter();
  const { t } = useSignupLanguage();

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

  const { mutate: signupMutation, isPending: signupPending } = useSignup();

  const handleSignup = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const refinedEmail = email.trim();
    const refinedNickname = nickname.trim();

    if (!refinedEmail || !refinedNickname || !password || !passwordConfirm) {
      alert(t.alertEmpty);
      return;
    }

    if (refinedNickname.length < 2) {
      alert(t.alertNicknameMin);
      return;
    }

    if (refinedNickname.length > 12) {
      alert(t.alertNicknameMax);
      return;
    }

    if (password !== passwordConfirm) {
      alert(t.alertPasswordMismatch);
      return;
    }

    if (!isTermsAgreed || !isPrivacyAgreed) {
      alert(t.alertTermsRequired);
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

  return (
    <main className="min-h-screen w-full bg-[#F2F6F6] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#1A3A3A]/10">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-[28px] font-extrabold text-[#1A3A3A] tracking-tight">
            {t.welcomeTitle}
          </h1>
          <p className="text-sm sm:text-[15px] text-[#6E8B8B] mt-1.5 font-medium">
            {t.welcomeSubtitle}
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm sm:text-[15px] font-semibold text-[#1A3A3A]">
              {t.emailLabel}
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-5 h-5 text-[#6E8B8B]" />
              <input
                type="email"
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 pl-11 pr-4 bg-[#F8FAFA] text-[15px] text-[#1A3A3A] placeholder-[#A3B8B8] rounded-xl border border-[#1A3A3A]/10 focus:outline-none focus:border focus:border-[#FF7F66] transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm sm:text-[15px] font-semibold text-[#1A3A3A]">
              {t.passwordLabel}
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-5 h-5 text-[#6E8B8B]" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder={t.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 pl-11 pr-12 bg-[#F8FAFA] text-[15px] text-[#1A3A3A] placeholder-[#A3B8B8] rounded-xl border border-[#1A3A3A]/10 focus:outline-none focus:border focus:border-[#FF7F66] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 p-1 text-[#6E8B8B] hover:text-[#1A3A3A] transition-colors"
                aria-label={showPassword ? t.hidePassword : t.showPassword}
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
            <label className="block text-sm sm:text-[15px] font-semibold text-[#1A3A3A]">
              {t.passwordConfirmLabel}
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-5 h-5 text-[#6E8B8B]" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder={t.passwordConfirmPlaceholder}
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className="w-full h-12 pl-11 pr-4 bg-[#F8FAFA] text-[15px] text-[#1A3A3A] placeholder-[#A3B8B8] rounded-xl border border-[#1A3A3A]/10 focus:outline-none focus:border focus:border-[#FF7F66] transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm sm:text-[15px] font-semibold text-[#1A3A3A]">
              {t.nicknameLabel}
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1 flex items-center">
                <User className="absolute left-3.5 w-5 h-5 text-[#6E8B8B]" />
                <input
                  type="text"
                  placeholder={t.nicknamePlaceholder}
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 bg-[#F8FAFA] text-base text-[#1A3A3A] placeholder-[#A3B8B8] rounded-xl border border-[#1A3A3A]/10 focus:outline-none focus:border focus:border-[#FF7F66] transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={handleAutoGenerateNickname}
                className="cursor-pointer h-12 px-4 bg-[#FF7F66]/10 border border-[#FF7F66]/20 text-[#FF7F66] rounded-xl flex items-center gap-1.5 font-semibold text-sm sm:text-base hover:bg-[#FF7F66]/20 transition-colors shrink-0"
              >
                <RefreshCw className="w-4 h-4" />
                {t.recommendButton}
              </button>
            </div>
          </div>

          <div className="pt-2 pb-1 space-y-3">
            <label className="block text-sm sm:text-[15px] font-semibold text-[#1A3A3A]">
              {t.termsLabel}
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
              <span className="font-bold text-sm sm:text-[15px] text-[#1A3A3A]">
                {t.allAgree}
              </span>
            </button>

            <div className="h-px bg-gray-200 my-2" />

            <div className="space-y-2.5 pl-1">
              <div className="flex items-center justify-between text-sm sm:text-[15px]">
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
                  <span className="text-[#1A3A3A]">{t.termsRequired}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setModalType("terms")}
                  className="cursor-pointer text-xs sm:text-sm text-[#1A3A3A] font-semibold underline shrink-0 ml-2"
                >
                  {t.viewButton}
                </button>
              </div>

              <div className="flex items-center justify-between text-sm sm:text-[15px]">
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
                  <span className="text-[#1A3A3A]">{t.privacyRequired}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setModalType("privacy")}
                  className="cursor-pointer text-xs sm:text-sm text-[#1A3A3A] font-semibold underline shrink-0 ml-2"
                >
                  {t.viewButton}
                </button>
              </div>

              <div className="flex items-center justify-between text-sm sm:text-[15px]">
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
                  <span className="text-[#1A3A3A]">{t.marketingOptional}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setModalType("marketing")}
                  className="cursor-pointer text-xs sm:text-sm text-[#1A3A3A] font-semibold underline shrink-0 ml-2"
                >
                  {t.viewButton}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={signupPending}
            className="cursor-pointer w-full h-12 mt-2 bg-[#1A3A3A] hover:bg-[#142E2E] text-white font-bold text-[15px] sm:text-lg rounded-xl flex items-center justify-center transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {signupPending ? (
              <Loader2 className="w-5 h-5 animate-spin text-white" />
            ) : (
              t.startButton
            )}
          </button>
        </form>

        <div className="flex items-center justify-center gap-2 mt-6 text-sm sm:text-[15px]">
          <span className="text-[#6E8B8B]">{t.hasAccount}</span>
          <button
            type="button"
            onClick={() => router.back()}
            className="font-bold text-[#FF7F66] hover:underline cursor-pointer"
          >
            {t.loginButton}
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
