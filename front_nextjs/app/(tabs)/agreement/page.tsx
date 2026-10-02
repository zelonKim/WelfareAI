"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckSquare, Square, Loader2 } from "lucide-react";
import { client } from "@/api/client";
import { updateAgreementAndNickname } from "@/api/auth/updateAgreementAndNickname";
import TermsModal from "@/components/TermsModal"; // 기존 컴포넌트 import
import { ApiErrorRes } from "@/types/common/ApiErrorRes";
import { AxiosError } from "axios";

export default function AgreementPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [nickname, setNickname] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [marketingAgreed, setMarketingAgreed] = useState(false);
  const [modalType, setModalType] = useState<
    "terms" | "privacy" | "marketing" | null
  >(null);

  // 내 정보 조회
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

  // 전체 동의 토글
  const handleAllAgree = () => {
    const nextState = !(termsAgreed && privacyAgreed && marketingAgreed);
    setTermsAgreed(nextState);
    setPrivacyAgreed(nextState);
    setMarketingAgreed(nextState);
  };

  // 회원가입 완료 mutation
  const { mutate: signupCompleteMutation, isPending: signupCompletePending } =
    useMutation({
      mutationFn: () => updateAgreementAndNickname(nickname, marketingAgreed),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["myInfo"] });
        router.replace("/");
      },
      onError: (error: AxiosError<ApiErrorRes>) => {
        const message = error.response?.data?.message;
        const displayMessage = Array.isArray(message) ? message[0] : message;
        alert(displayMessage || "처리 중 오류가 발생했습니다.");
      },
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) {
      alert("사용하실 별명을 입력해 주세요.");
      return;
    }
    if (!termsAgreed || !privacyAgreed) {
      alert("필수 약관에 모두 동의해 주세요.");
      return;
    }
    signupCompleteMutation();
  };

  const isFormValid =
    nickname.trim().length > 0 && termsAgreed && privacyAgreed;
  const isAllChecked = termsAgreed && privacyAgreed && marketingAgreed;

  return (
    <div className="flex min-h-screen items-center justify-center bg-orange-50 px-4 py-12 text-slate-900">
      <main className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm border border-slate-100 sm:p-8">
        {/* 헤더 섹션 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            거의 다 완료됐어요 🦊
          </h1>
          <p className="mt-2 text-base leading-relaxed text-slate-500">
            WelfareAI 시작을 위해 별명과 약관 동의가 필요해요.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* 별명 입력 섹션 */}
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

          {/* 약관 동의 카드 영역 */}
          <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5">
            {/* 전체 동의 버튼 */}
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

            {/* 개별 약관 목록 */}
            <div className="flex flex-col gap-4">
              {/* 필수 1: 서비스 이용약관 */}
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

              {/* 필수 2: 개인정보 처리방침 */}
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

              {/* 선택 1: 마케팅 정보 수신 */}
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

          {/* 제출 버튼 */}
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

      {/* 기존 TermsModal 컴포넌트 연결 */}
      <TermsModal
        visible={modalType !== null}
        type={modalType}
        onClose={() => setModalType(null)}
      />
    </div>
  );
}
