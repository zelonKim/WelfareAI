"use client";
import { Section } from "@/types/common/Section";
import { useRouter } from "next/navigation";

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

////////////////////////////////////////////////////////////////////////////////////

export default function TermsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F4F7F6] text-[#193E3B] px-4 py-8 md:py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#E2ECE9]">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E2ECE9]">
          <h1 className="text-xl md:text-2xl font-bold text-[#193E3B] flex items-center gap-2">
            <span className="text-[#FF6B5B]">📋</span> 서비스 이용약관 및
            운영정책
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
            Terms of Service & Operating Policy
          </p>
          <p className="text-sm text-[#385B56] leading-relaxed">
            WelfareAI 서비스를 이용해 주셔서 감사합니다. 본 약관은 안전하고
            신뢰할 수 있는 AI 복지 플랫폼 이용 환경을 위해 마련되었습니다.
          </p>
        </div>

        <div className="space-y-5 text-[#385B56] leading-relaxed text-sm md:text-[15px]">
          {TERMS_SECTIONS.map((section, index) => (
            <section key={index} className="space-y-1.5">
              <h2 className="text-[15px] font-bold text-[#193E3B] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B5B]"></span>
                {section.title}
              </h2>
              <div className="bg-[#F8FAF9] p-3.5 rounded-xl border border-[#EBF2F0] text-[#2C4844] whitespace-pre-line leading-relaxed">
                {section.body}
              </div>
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
