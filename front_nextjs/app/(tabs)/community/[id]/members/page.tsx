"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, Siren, User as UserIcon } from "lucide-react";
import { getCommunityDetail } from "@/api/community/getCommunityDetail";
import { getMyInfo } from "@/api/user/getMyInfo";
import { ReportModal } from "@/components/ReportModal";
import { useUpdateMemberStatus } from "@/hooks/community/useUpdateMemberStatus";
import { UserProfile } from "@/types/user/UserProfile";

export default function CommunityMembersPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [isReportModalVisible, setIsReportModalVisible] = useState(false);

  // 모임 상세 정보 조회
  const { data: post } = useQuery({
    queryKey: ["communityDetail", id],
    queryFn: () => getCommunityDetail(id),
    enabled: !!id,
  });

  // 내 정보 조회
  const { data: myInfo } = useQuery<UserProfile>({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
  });

  // 방장 여부 확인
  const isHost = post?.hostId === myInfo?.id;

  // APPROVED 상태 멤버 목록
  const approvedMembers =
    post?.members?.filter((member) => member.status === "APPROVED") || [];

  // 강퇴 mutation
  const { mutate: updateStatusMutation, isPending: updateStatusPending } =
    useUpdateMemberStatus();

  const handleBanMember = (targetUserId: string, nickname: string) => {
    const isConfirmed = window.confirm(
      `정말로 '${nickname}' 님을 모임에서 강퇴하시겠습니까?`,
    );

    if (isConfirmed && id) {
      updateStatusMutation({
        postId: id,
        targetUserId,
        status: "BANNED",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* 헤더 영역 */}
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-100 bg-white/80 px-4 backdrop-blur-md">
        <button
          onClick={() => router.back()}
          className="cursor-pointer rounded-full p-2 text-slate-700 hover:bg-slate-100 transition"
          aria-label="뒤로가기"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <h1 className="text-xl font-bold text-slate-800">모임원 목록</h1>

        <button
          onClick={() => setIsReportModalVisible(true)}
          className="cursor-pointer rounded-full p-2 text-red-500 hover:bg-red-50 transition"
          aria-label="신고하기"
        >
          <Siren className="h-6 w-6" />
        </button>
      </header>

      {/* 메인 리스트 영역 */}
      <main className="mx-auto max-w-3xl px-5 py-4">
        {approvedMembers.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-base">
            참여 중인 모임원이 없습니다.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {approvedMembers.map((item) => {
              const isTargetHost = post?.hostId === item.user?.id;
              const isMe = item.user?.id === myInfo?.id;

              return (
                <li
                  key={item.id}
                  className="flex items-center justify-between py-4"
                >
                  {/* 프로필 이미지 & 정보 */}
                  <div className="flex items-center gap-3.5">
                    {item.user?.profileImage ? (
                      <div className="relative h-12 w-12 overflow-hidden rounded-full bg-slate-100">
                        <Image
                          src={item.user.profileImage}
                          alt={item.user?.nickname || "프로필 이미지"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-800">
                        <UserIcon className="h-6 w-6" />
                      </div>
                    )}

                    {/* 닉네임 & 방장 뱃지 */}
                    <div className="flex items-center gap-2">
                      <span className="text-base font-semibold text-slate-800">
                        {item.user?.nickname || "알 수 없음"}
                      </span>
                      {isTargetHost && (
                        <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-[#FF6C4B]">
                          방장
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 강퇴 버튼 (방장 전용 & 자기 자신/다른 방장 제외) */}
                  {isHost && !isTargetHost && !isMe && (
                    <button
                      disabled={updateStatusPending}
                      onClick={() =>
                        handleBanMember(
                          item.user?.id || "",
                          item.user?.nickname || "알 수 없음",
                        )
                      }
                      className="cursor-pointer rounded-lg bg-red-500 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:bg-slate-300"
                    >
                      강퇴
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </main>

      {/* 신고 모달 */}
      <ReportModal
        visible={isReportModalVisible}
        onClose={() => setIsReportModalVisible(false)}
      />
    </div>
  );
}
