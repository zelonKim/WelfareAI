"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CheckSquare, Square, Loader2 } from "lucide-react";
import { client } from "@/api/client";
import TermsModal from "@/components/TermsModal";
import { useSignupComplete } from "@/hooks/user/useSignupComplete";


export default function AgreementPage() {
  const [nickname, setNickname] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [marketingAgreed, setMarketingAgreed] = useState(false);
  const [modalType, setModalType] = useState<
    "terms" | "privacy" | "marketing" | null
  >(null);

  ////////////////////////////////////////////////////////////////////////////////////

  const { data: myInfo } = useQuery({
    queryKey: ["myInfo"],
    queryFn: async () => {
      const { data } = await client.get("/user/me");
      return data;
    },
  });

  useEffect(() => {
    if (myInfo?.nickname) {
      setNickname(myInfo.nickname);
    }
  }, [myInfo]);

  //////////////////////////////////////////////////////////////////////////////

  const { mutate: signupCompleteMutation, isPending: signupCompletePending } =
    useSignupComplete();

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nickname.trim()) {
      alert("사용하실 별명을 입력해 주세요.");
      return;
    }
    if (!termsAgreed || !privacyAgreed) {
      alert("필수 약관에 모두 동의해 주세요.");
      return;
    }
    signupCompleteMutation({ nickname, marketingAgreed });
  };

  //////////////////////////////////////////////////////////////////////////////

  // 전체 동의 토글
  const handleAllAgree = () => {
    const nextState = !(termsAgreed && privacyAgreed && marketingAgreed);
    setTermsAgreed(nextState);
    setPrivacyAgreed(nextState);
    setMarketingAgreed(nextState);
  };

  const isAllChecked = termsAgreed && privacyAgreed && marketingAgreed;

  const isFormValid =
    nickname.trim().length > 0 && termsAgreed && privacyAgreed;

  //////////////////////////////////////////////////////////////////////////////

  return (
    <div className="flex min-h-screen items-center justify-center bg-orange-50 px-4 py-12 text-slate-900">
      <main className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm border border-slate-100 sm:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            거의 다 완료됐어요 🦊
          </h1>
          <p className="mt-2 text-base leading-relaxed text-slate-500">
            WelfareAI 시작을 위해 별명과 약관 동의가 필요해요.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="nickname"
              className="text-base font-semibold text-slate-800"
            >
              별명
            </label>
            <div className="relative flex items-center">
              <input
                id="nickname"
                type="text"
                placeholder="최소 2자 ~ 최대 12자"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={12}
                className="h-14 w-full rounded-xl border border-slate-200 bg-white px-4 pr-16 text-base text-slate-900 placeholder-slate-400 focus:border-[#FF7F66] focus:outline-none focus:ring-1 focus:ring-[#FF7F66]"
              />
              {nickname.length > 0 && (
                <span className="absolute right-4 text-sm text-slate-400">
                  {nickname.length}/12
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5">
            <button
              type="button"
              onClick={handleAllAgree}
              className="cursor-pointer flex items-center gap-3 text-left transition hover:opacity-80"
            >
              {isAllChecked ? (
                <CheckSquare className="h-6 w-6 text-[#FF7F66]" />
              ) : (
                <Square className="h-6 w-6 text-slate-300" />
              )}
              <span className="text-lg font-bold text-slate-900">
                약관 전체 동의하기
              </span>
            </button>

            <hr className="border-slate-100" />

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setTermsAgreed(!termsAgreed)}
                  className="cursor-pointer flex items-center gap-3 text-left transition hover:opacity-80"
                >
                  {termsAgreed ? (
                    <CheckSquare className="h-5 w-5 text-[#FF7F66]" />
                  ) : (
                    <Square className="h-5 w-5 text-slate-300" />
                  )}
                  <span className="text-base text-slate-700">
                    <strong className="font-semibold text-[#1E2E2A]">
                      [필수]
                    </strong>{" "}
                    서비스 이용약관 동의
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setModalType("terms")}
                  className="cursor-pointer text-sm text-slate-400 underline transition hover:text-slate-600"
                >
                  보기
                </button>
              </div>

              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setPrivacyAgreed(!privacyAgreed)}
                  className="cursor-pointer flex items-center gap-3 text-left transition hover:opacity-80"
                >
                  {privacyAgreed ? (
                    <CheckSquare className="h-5 w-5 text-[#FF7F66]" />
                  ) : (
                    <Square className="h-5 w-5 text-slate-300" />
                  )}
                  <span className="text-base text-slate-700">
                    <strong className="font-semibold text-[#1E2E2A]">
                      [필수]
                    </strong>{" "}
                    개인정보 처리방침 동의
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setModalType("privacy")}
                  className="cursor-pointer text-sm text-slate-400 underline transition hover:text-slate-600"
                >
                  보기
                </button>
              </div>

              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setMarketingAgreed(!marketingAgreed)}
                  className="cursor-pointer flex items-center gap-3 text-left transition hover:opacity-80"
                >
                  {marketingAgreed ? (
                    <CheckSquare className="h-5 w-5 text-[#FF7F66]" />
                  ) : (
                    <Square className="h-5 w-5 text-slate-300" />
                  )}
                  <span className="text-base text-slate-700">
                    <span className="font-medium text-slate-400">[선택]</span>{" "}
                    마케팅 정보 수신 동의
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setModalType("marketing")}
                  className="cursor-pointer text-sm text-slate-400 underline transition hover:text-slate-600"
                >
                  보기
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!isFormValid || signupCompletePending}
            className={`flex h-14 w-full items-center justify-center rounded-xl text-lg font-bold transition active:scale-[0.99] ${
              isFormValid
                ? "cursor-pointer bg-[#FF7F66] text-white shadow-lg shadow-[#FF7F66]/20 hover:bg-[#FF7F66]/90"
                : "cursor-not-allowed bg-slate-200 text-slate-400"
            }`}
          >
            {signupCompletePending ? (
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            ) : (
              "시작하기"
            )}
          </button>
        </form>
      </main>

      <TermsModal
        visible={modalType !== null}
        type={modalType}
        onClose={() => setModalType(null)}
      />
    </div>
  );
}
