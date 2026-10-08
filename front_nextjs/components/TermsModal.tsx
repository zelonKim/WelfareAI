"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { Section } from "@/types/common/Section";
import { TermsModalProps } from "@/types/auth/TermsModalProps";

// 서비스 이용약관
const TERMS_SECTIONS: Section[] = [
  {
    title: "제 1 조 (목적)",
    body: "본 약관은 WelfareAI(이하 '서비스')가 제공하는 AI 기반 복지 정보 추천 및 커뮤니티 서비스의 이용 조건과 절차, 이용자와 서비스 간의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.",
  },
  {
    title: "제 2 조 (부적절한 콘텐츠 및 악성 사용자에 대한 무관용 원칙)",
    body: "본 서비스는 불쾌감을 주거나 부적절한 콘텐츠(UGC) 및 이를 유포하는 악성 사용자에 대해 절대 용납하지 않는 무관용 원칙(Zero Tolerance)을 적용합니다. 욕설, 비하, 불법 정보, 광고성 게시물 작성 시 사전 통보 없이 콘텐츠가 삭제되거나 이용이 제한될 수 있습니다.",
  },
  {
    title: "제 3 조 (신고 및 차단, 모니터링 시스템)",
    body: "1. 신고 기능: 회원은 부적절한 게시글, 메시지 또는 사용자를 발견할 경우 앱 내 <신고> 버튼을 통해 즉시 관리자에게 신고할 수 있습니다.\n2. 차단 기능: 회원은 원치 않는 사용자를 <차단>할 수 있으며, 차단된 사용자의 콘텐츠 및 메시지는 즉시 숨김 처리됩니다.\n3. 조치 절차: 신고된 콘텐츠 및 악성 사용자는 24시간 이내에 검토되어 삭제 및 계정 정지 등의 조치가 취해집니다.",
  },
  {
    title: "제 4 조 (책임의 제한)",
    body: "1. 본 플랫폼은 AI를 통해 복지 정책 및 모임 정보를 안내 및 중개하는 플랫폼으로서, AI가 제공하는 복지 정보의 완전성 및 모임 과정에서 발생하는 회원 간 분쟁에 대해 법적 책임을 지지 않습니다.\n2. 회원은 공공기관의 공식 발표 내용을 최종 확인할 책임이 있습니다.",
  },
];

// 개인정보 처리방침
const PRIVACY_SECTIONS: Section[] = [
  {
    title: "제 1 조 (수집하는 개인정보 항목)",
    body: "본 서비스는 회원가입, AI 맞춤 복지 추천, 모임 중개 서비스 제공을 위해 최소한의 개인정보(별명, 이메일, 프로필 이미지, 맞춤 추천용 연령대/관심 지역/복지 관심 분야)를 수집합니다.",
  },
  {
    title: "제 2 조 (개인정보의 보유 및 이용 기간)",
    body: "수집된 개인정보는 회원 탈퇴 시 즉시 파기하는 것을 원칙으로 하며, 관계 법령의 규정에 의하여 보존할 필요가 있는 경우 해당 법령에서 정한 기간 동안 보관합니다.",
  },
  {
    title: "제 3 조 (개인정보의 파기 절차 및 방법)",
    body: "회원 탈퇴 등 파기 사유가 발생한 개인정보는 복구할 수 없는 기술적 방법을 사용하여 안전하게 삭제합니다.",
  },
  {
    title: "제 4 조 (개인정보의 제3자 제공)",
    body: "본 플랫폼은 이용자의 동의 없이 개인정보를 외부에 제공하지 않으며, 모임 진행 시 필요한 최소한의 프로필 정보만 참가자 간에 상호 제공됩니다.",
  },
  {
    title: "제 5 조 (개인정보 관리책임자 및 문의처)",
    body: "서비스 이용 중 발생하는 모든 개인정보 보호 관련 문의, 불만 처리, 피해구제 등에 관한 사항은 앱 내 [설정 > 문의하기] 또는 개발자 이메일을 통해 문의해 주시기 바랍니다.",
  },
  {
    title: "제 6 조 (계정 삭제 및 데이터 파기 요청)",
    body: "사용자는 언제든지 서비스 내 [설정 > 회원 탈퇴] 메뉴를 통해 계정 삭제 및 데이터 파기를 직접 요청할 수 있으며, 탈퇴 즉시 모든 개인 데이터는 지체 없이 파기됩니다.",
  },
  {
    title: "제 7 조 (아동 및 청소년 보호 정책)",
    body: "본 서비스는 아동 성적 학대 및 착취(CSAM/CSAE) 콘텐츠를 엄격히 금지합니다. 해당 콘텐츠나 사용자가 발견될 경우 사전 경고 없이 즉시 계정이 영구 정지되며, 관련 법률에 따라 관계 기관에 신고될 수 있습니다.",
  },
];

// 마케팅 수신 동의
const MARKETING_SECTIONS: Section[] = [
  {
    title: "제 1 조 (마케팅 정보 수신 동의)",
    body: "WelfareAI 서비스가 제공하는 신규 맞춤 복지 혜택 안내, 이벤트 정보, 서비스 업데이트 및 공지사항 등 유용한 정보를 앱 푸시 알림, 이메일, SMS 등으로 전달받는 것에 동의합니다.",
  },
  {
    title: "제 2 조 (동의 철회 및 철회 방법)",
    body: "마케팅 정보 수신에 대한 동의는 임의적인 사항이며, 동의하지 않더라도 기본적인 복지 검색 및 커뮤니티 서비스 이용에는 제한이 없습니다. 동의 이후에도 앱 내 [설정 > 알림 설정] 메뉴를 통해 언제든지 수신 거부로 변경할 수 있습니다.",
  },
];

////////////////////////////////////////////////////////////////////////////////////

export default function TermsModal({
  visible,
  type,
  onClose,
}: TermsModalProps) {
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (visible) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [visible, onClose]);

  if (!visible || !type) return null;

  ////////////////////////////////////////////////////////////////////////////////////

  const title =
    type === "terms"
      ? "서비스 이용 약관"
      : type === "privacy"
        ? "개인정보 처리 방침"
        : "마케팅 정보 수신 동의";

  const sections =
    type === "terms"
      ? TERMS_SECTIONS
      : type === "privacy"
        ? PRIVACY_SECTIONS
        : MARKETING_SECTIONS;

  ////////////////////////////////////////////////////////////////////////////////////

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[85vh] bg-white rounded-2xl p-6 shadow-xl border border-gray-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <h2 className="text-lg sm:text-xl font-bold text-[#1A3A3A]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="모달 닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto my-4 pr-1 space-y-4">
          {sections.map((section, index) => (
            <div
              key={index}
              className="bg-[#F8FAFA] p-4 rounded-xl border border-[#1A3A3A]/5"
            >
              <h3 className="text-sm sm:text-base font-bold text-[#1A3A3A] mb-2">
                {section.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {section.body}
              </p>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer w-full p-3 bg-[#1A3A3A] hover:bg-[#142E2E] text-white font-bold text-base rounded-xl transition-colors mt-2"
        >
          확인
        </button>
      </div>
    </div>
  );
}
