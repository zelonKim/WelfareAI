"use client";

import { Section } from "@/types/common/Section";
import { useRouter } from "next/navigation";

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
    title: "제 5 조 (개인정보 보호책임자 및 고객 지원 문의처)",
    body: "서비스 이용 중 발생하는 서비스 지원 문의, 개인정보 보호 관련 불만 처리, 피해구제 등에 관한 사항은 맨 위의 고객 지원 이메일 및 담당자를 통해 문의해 주시면 지체 없이 답변드리겠습니다.",
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

////////////////////////////////////////////////////////////////////////////////////

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F4F7F6] text-[#193E3B] px-4 py-8 md:py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#E2ECE9]">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E2ECE9]">
          <h1 className="text-xl md:text-2xl font-bold text-[#193E3B] flex items-center gap-2">
            <span className="text-[#FF6B5B]">🔒</span> 개인정보 처리방침 및 고객
            지원
          </h1>
          <button
            onClick={() => router.back()}
            className="cursor-pointer text-xs font-semibold text-[#5A7A76] hover:text-[#193E3B] hover:bg-[#EAF2F0] transition px-3 py-1.5 rounded-lg bg-[#F4F7F6]"
          >
            뒤로가기
          </button>
        </div>

        <div className="mb-6 p-4 rounded-xl bg-[#F0F6F5] border border-[#DCEBE8]">
          <p className="text-xs font-bold text-[#FF6B5B] uppercase tracking-wider mb-1">
            Privacy Policy & Support
          </p>
          <p className="text-sm text-[#385B56] leading-relaxed mb-3">
            WelfareAI는 이용자의 개인정보를 소중히 다루며, 관련 법령을 준수하여
            안전하게 관리하고 있습니다.
          </p>

          <div className="pt-3 font-medium border-t border-[#D0E2DF] text-[15px] text-[#2C4844] space-y-1">
            <p>
              <strong>• 고객 지원 이메일:</strong> ksz18601@gmail.com
            </p>
            <p>
              <strong>• 담당자:</strong> 김성진
            </p>
          </div>
        </div>

        <div className="space-y-5 text-[#385B56] leading-relaxed text-sm md:text-[15px] mt-6">
          {PRIVACY_SECTIONS.map((section, index) => (
            <section key={index} className="space-y-1.5">
              <h2 className="text-[15px] font-bold text-[#193E3B] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B5B]"></span>
                {section.title}
              </h2>
              <p className="bg-[#F8FAF9] p-3.5 rounded-xl border border-[#EBF2F0] text-[#2C4844] leading-relaxed whitespace-pre-line">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-10 pt-4 border-t border-[#E2ECE9] text-center text-xs text-[#7A9A95]">
          시행 일자: 2026년 10월 2일 · OpenWelfare
        </div>
      </div>
    </div>
  );
}
