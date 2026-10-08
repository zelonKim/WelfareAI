"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  HeartHandshake,
  LogOut,
  MessagesCircle,
  MoreVertical,
  UserCheck,
  Users,
  Loader2,
} from "lucide-react";
import { getCommunityDetail } from "@/api/community/getCommunityDetail";
import { getMyInfo } from "@/api/user/getMyInfo";
import CommunityModal from "@/components/CommunityModal";
import { useApplyCommunity } from "@/hooks/community/useApplyCommunity";
import { useDeleteCommunityPost } from "@/hooks/community/useDeleteCommunityPost";
import { useLeaveCommunity } from "@/hooks/community/useLeaveCommunity";
import { useUpdateCommunity } from "@/hooks/community/useUpdateCommunity";
import { useUpdateMemberStatus } from "@/hooks/community/useUpdateMemberStatus";
import { CommunityMemberStatus } from "@/types/community/CommunityMemberStatus";
import { UserProfile } from "@/types/user/UserProfile";

export default function CommunityDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [notice, setNotice] = useState<string>("");

  ////////////////////////////////////////////////////////////////////////////////////

  const {
    data: post,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["communityDetail", id],
    queryFn: () => getCommunityDetail(id!),
    enabled: !!id,
    refetchInterval: 10000, 
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  });

  ////////////////////////////////////////////////////////////////////////////////////

  const { data: myInfo } = useQuery<UserProfile>({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
  });

  const myMemberInfo = post?.members?.find(
    (member) => member.userId === myInfo?.id,
  );

  const isHost = post?.hostId === myInfo?.id;

  const isApprovedMember = myMemberInfo?.status === "APPROVED";

  const pendingMembers =
    post?.members?.filter((member) => member.status === "PENDING") || [];

  const approvedMembersCount =
    post?.members?.filter((m) => m.status === "APPROVED").length || 0;

  //////////////////////////////////////////////////////////////////////////////////////

  const { mutate: updateCommunityMutation, isPending: updateCommunityPending } =
    useUpdateCommunity({
      id,
      onSuccessCallback: () => setIsModalVisible(false),
    });

  const handleUpdateCommunity = () => {
    updateCommunityMutation({
      title,
      content,
      notice,
    });
  };

  //////////////////////////////////////////////////////////////////////////////////////

  const { mutate: CommunityDeleteMutation } = useDeleteCommunityPost();

  const handleDeleteCommunity = () => {
    setIsMenuOpen(false);
    if (confirm("정말로 이 모임을 삭제하시겠습니까?")) {
      CommunityDeleteMutation(id);
    }
  };

  //////////////////////////////////////////////////////////////////////////////////////

  const { mutate: applyCommunityMutation, isPending: applyCommunityPending } =
    useApplyCommunity();

  const handleJoinCommunity = () => {
    if (confirm("이 모임에 참여 신청 하시겠습니까?")) {
      applyCommunityMutation(id);
    }
  };

  //////////////////////////////////////////////////////////////////////////////////////

  const { mutate: leaveCommunityMutation } = useLeaveCommunity();

  const handleLeaveCommunity = () => {
    if (confirm("정말로 이 모임을 그만두고, 나가시겠습니까?")) {
      leaveCommunityMutation(id);
    }
  };

  //////////////////////////////////////////////////////////////////////////////////////

  const { mutate: updateStatusMutation, isPending: updateStatusPending } =
    useUpdateMemberStatus();

  const handleUpdateMemberStatus = (
    targetUserId: string,
    newStatus: CommunityMemberStatus,
  ) => {
    const statusText = newStatus === "APPROVED" ? "승인" : "강퇴";
    if (confirm(`해당 회원을 ${statusText}하시겠습니까?`)) {
      updateStatusMutation({
        postId: id,
        targetUserId,
        status: newStatus,
      });
    }
  };

  //////////////////////////////////////////////////////////////////////////////////////

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setTitle("");
    setContent("");
    setNotice("");
  };

  const handleEditCommunity = () => {
    if (!post) return;
    setTitle(post.title ?? "");
    setContent(post.content ?? "");
    setNotice(post.notice ?? "");
    setIsModalVisible(true);
    setIsMenuOpen(false);
  };

  //////////////////////////////////////////////////////////////////////////////////////

  if (isPending) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-[#FF6C4B]" />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-white p-6">
        <p className="mb-4 text-lg font-medium text-slate-600">
          게시글을 불러오는 데 실패했습니다.
        </p>
        <button
          onClick={() => router.back()}
          className="rounded-lg bg-slate-100 px-5 py-2.5 text-base font-semibold text-slate-800 transition hover:bg-slate-200"
        >
          돌아가기
        </button>
      </div>
    );
  }

  //////////////////////////////////////////////////////////////////////////////////////

  return (
    <div className="mx-auto min-h-screen max-w-5xl bg-white text-slate-900 shadow-sm">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-100 bg-white/80 px-6 backdrop-blur-md">
        <button
          onClick={() => router.back()}
          className="cursor-pointer rounded-full p-2 text-slate-700 transition hover:bg-slate-100"
          aria-label="뒤로가기"
        >
          <ChevronLeft className="h-7 w-7" />
        </button>

        <h1 className="text-xl font-bold text-slate-800">모임 상세</h1>

        <div className="relative">
          {isHost ? (
            <div>
              <button
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="cursor-pointer rounded-full p-2 text-slate-700 transition hover:bg-slate-100"
                aria-label="더보기"
              >
                <MoreVertical className="h-7 w-7" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-36 rounded-xl border border-slate-100 bg-white shadow-lg ring-1 ring-black/5">
                  <button
                    onClick={handleEditCommunity}
                    className="cursor-pointer w-full px-4 py-3 text-left text-base text-slate-700 transition hover:bg-slate-50"
                  >
                    수정하기
                  </button>
                  <button
                    onClick={handleDeleteCommunity}
                    className="cursor-pointer w-full border-t border-slate-100 px-4 py-3 text-left text-base text-red-500 transition hover:bg-red-50"
                  >
                    삭제하기
                  </button>
                </div>
              )}
            </div>
          ) : isApprovedMember ? (
            <button
              onClick={handleLeaveCommunity}
              className="cursor-pointer rounded-full p-2 text-red-500 transition hover:bg-red-50"
              aria-label="모임 나가기"
            >
              <LogOut className="h-6 w-6" />
            </button>
          ) : (
            <div className="w-8" />
          )}
        </div>
      </header>

      {/* 메인 콘텐츠 영역 */}
      <main className="px-6 py-6 pb-16">
        {/* 모임 성격 배지 및 개설일 */}
        <div className="mb-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#FFEFEA] px-3 py-1.5 text-sm font-bold text-[#FF6C4B]">
            {post.type === "VOLUNTEER" ? (
              <>
                <HeartHandshake className="h-4 w-4" />
                봉사 모임
              </>
            ) : (
              <>
                <MessagesCircle className="h-4 w-4" />
                소통 모임
              </>
            )}
          </span>
          <span className="text-sm text-slate-400">
            개설일:{" "}
            {new Date(post.createdAt).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        {/* 제목 */}
        <h2 className="mb-5 text-2xl font-bold leading-snug text-slate-900">
          {post.title}
        </h2>

        {/* 호스트 및 모집인원 카드 정보 */}
        <div className="mb-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-slate-500" />
            <span className="text-base text-slate-600">
              참여 인원:{" "}
              <strong className="font-bold text-[#FF6C4B]">
                {approvedMembersCount}명
              </strong>
              {post.maxMembers ? ` / ${post.maxMembers}명` : ""}
            </span>
          </div>

          <button
            onClick={() => router.push(`/community/${id}/members`)}
            className="cursor-pointer inline-flex items-center gap-0.5 text-base font-extrabold text-[#FF6C4B] transition hover:opacity-80"
          >
            모임원 목록
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* 방장 전용: 참여 신청 관리 섹션 */}
        {isHost && (
          <section className="mb-8 rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
            <div className="mb-3 flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-slate-500" />
              <h3 className="text-base font-semibold text-slate-700">
                참여 신청 관리 ({pendingMembers.length})
              </h3>
            </div>

            {pendingMembers.length === 0 ? (
              <div className="py-6 text-center text-base text-slate-400">
                현재 대기 중인 신청자가 없습니다.
              </div>
            ) : (
              <div className="space-y-2">
                {pendingMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
                  >
                    <div className="mr-3">
                      <p className="text-base font-semibold text-slate-800">
                        {member.user?.nickname || "익명 회원"}
                      </p>
                      <p className="text-sm text-slate-400">
                        {member.user?.email}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        handleUpdateMemberStatus(member.userId, "APPROVED")
                      }
                      disabled={updateStatusPending}
                      className="cursor-pointer rounded-lg bg-[#FF6C4B] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#e05b3d] disabled:opacity-50"
                    >
                      승인
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* 모임 소개 내용 */}
        <section className="mb-8">
          <h3 className="mb-3 text-lg font-bold text-slate-800">
            👥 모임 소개
          </h3>
          <p className="whitespace-pre-line text-base leading-relaxed text-slate-700">
            {post.content}
          </p>
        </section>

        {/* 승인 상태에 따른 조건부 영역 */}
        {isApprovedMember || isHost ? (
          <>
            {/* 1. 모임 공지사항 섹션 */}
            <section className="mb-8">
              <h3 className="mb-3 text-lg font-bold text-slate-800">
                📢 모임 공지사항
              </h3>
              <div className="rounded-2xl border border-[#FFE0D3] bg-[#FFF9F5] p-5">
                <p className="whitespace-pre-line text-base leading-normal text-slate-800">
                  {post.notice || "등록된 공지사항이 없습니다."}
                </p>
              </div>
            </section>

            {/* 2. 모임 채팅방 입장 섹션 */}
            <section className="mt-8">
              <h3 className="mb-3 text-lg font-bold text-slate-800">
                💬 모임 대화방
              </h3>
              <button
                onClick={() => router.push(`/community/${post.id}/chat`)}
                className="cursor-pointer w-full rounded-xl bg-[#FF6C4B] py-4 text-center text-lg font-bold text-white transition hover:bg-[#e05b3d]"
              >
                모임 대화방 입장하기
              </button>
            </section>
          </>
        ) : (
          <section className="mt-10">
            <button
              onClick={handleJoinCommunity}
              disabled={
                myMemberInfo?.status === "PENDING" || applyCommunityPending
              }
              className={` w-full rounded-xl py-4 text-center text-lg font-bold text-white transition ${
                myMemberInfo?.status === "PENDING"
                  ? "bg-slate-400 cursor-not-allowed"
                  : "cursor-pointer bg-[#FF6C4B] hover:bg-[#e05b3d]"
              } ${applyCommunityPending ? "opacity-70" : ""}`}
            >
              {applyCommunityPending
                ? "신청 처리 중..."
                : myMemberInfo?.status === "PENDING"
                  ? "승인 대기 중"
                  : "모임 참여하기"}
            </button>
          </section>
        )}
      </main>

      {/* 모임 수정 모달  */}
      <CommunityModal
        modalType="detail"
        visible={isModalVisible}
        onClose={handleCloseModal}
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        notice={notice}
        setNotice={setNotice}
        createCommunityPending={updateCommunityPending}
        handleCreateCommunity={handleUpdateCommunity}
      />
    </div>
  );
}
