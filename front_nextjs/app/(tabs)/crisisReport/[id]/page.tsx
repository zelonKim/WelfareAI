"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  Clock,
  MapPin,
  MoreVertical,
  Send,
  Siren,
  Trash,
  User,
  MessageCircleMore,
  Loader2,
} from "lucide-react";

import { getBlockedUsers } from "@/api/block/getBlockedUsers";
import { getCrisisReportById } from "@/api/crisisReport/getCrisisReportById";
import { getMyInfo } from "@/api/user/getMyInfo";
import CrisisReportModal from "@/components/CrisisReportModal";
import { ReportModal } from "@/components/ReportModal";
import { UserProfileAvatar } from "@/components/UserProfileAvatar";
import { useBlockUser } from "@/hooks/block/useBlockUser";
import { useUploadImage } from "@/hooks/common/useUploadImage";
import { useCreateCrisisComment } from "@/hooks/crisisReport/useCreateCrisisComment";
import { useDeleteCrisisComment } from "@/hooks/crisisReport/useDeleteCrisisComment";
import { useDeleteCrisisReport } from "@/hooks/crisisReport/useDeleteCrisisReport";
import { useUpdateCrisisReport } from "@/hooks/crisisReport/useUpdateCrisisReport";
import { BlockedItem } from "@/types/block/BlockedItem";
import { Comment } from "@/types/crisisReport/Comment";
import { CrisisReportDetail } from "@/types/crisisReport/CrisisReportDetail";
import { UserProfile } from "@/types/user/UserProfile";
import { formatDate } from "@/utils/formatDate";
import { handleGetCurrentLocation } from "@/utils/handleGetCurrentLocation";
import { handlePickImage } from "@/utils/handlePickImage";

export default function CrisisReportDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  // 수정 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [images, setImages] = useState<string[]>([]);

  // 댓글 및 신고 상태
  const [commentInput, setCommentInput] = useState("");
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [initialUserName, setInitialUserName] = useState("");
  const [activePopoverCommentId, setActivePopoverCommentId] = useState<
    string | null
  >(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // 제보 상세 조회
  const {
    data: report,
    isLoading,
    isError,
  } = useQuery<CrisisReportDetail>({
    queryKey: ["crisisReport", id],
    queryFn: () => getCrisisReportById(id),
    enabled: !!id,
    refetchInterval: 5000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  });

  // 내 정보 조회
  const { data: myInfo } = useQuery<UserProfile>({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
  });

  const isAuthor = myInfo?.id === report?.user.id;

  // 차단 유저 목록
  const { data: blockedList = [] } = useQuery<BlockedItem[]>({
    queryKey: ["blockedUsers"],
    queryFn: getBlockedUsers,
  });

  // 프로필 클릭 핸들러
  const handleProfilePress = (comment: Comment) => {
    if (comment.user.id === myInfo?.id) return;
    setActivePopoverCommentId((prev) =>
      prev === comment.id ? null : comment.id,
    );
  };

  // 이미지 업로드
  const { mutate: uploadImageMutation, isPending: uploadImagePending } =
    useUploadImage();

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  // 제보 수정
  const { mutate: updateReportMutation, isPending: updateReportPending } =
    useUpdateCrisisReport({
      id,
      onSuccessCallback: () => setIsModalOpen(false),
    });

  const handleUpdateReport = () => {
    updateReportMutation({
      title,
      content,
      address,
      latitude,
      longitude,
      images,
    });
  };

  const handleEditReport = () => {
    if (!report) return;
    setTitle(report.title ?? "");
    setContent(report.content ?? "");
    setAddress(report.address ?? "");
    setLatitude(report.latitude);
    setLongitude(report.longitude);
    setImages(report.images ?? []);
    setShowMoreMenu(false);
    setIsModalOpen(true);
  };

  // 제보 삭제
  const { mutate: deleteReportMutation } = useDeleteCrisisReport();

  const handleDeleteReport = () => {
    setShowMoreMenu(false);
    if (window.confirm("정말 이 제보를 삭제하시겠습니까?")) {
      deleteReportMutation(id);
    }
  };

  // 댓글 작성
  const { mutate: createCommentMutation, isPending: createCommentPending } =
    useCreateCrisisComment({
      reportId: id,
      onSuccessCallback: () => setCommentInput(""),
    });

  const handleSendComment = () => {
    if (!commentInput.trim()) return;
    createCommentMutation(commentInput.trim());
  };

  // 댓글 삭제
  const { mutate: deleteCommentMutation } = useDeleteCrisisComment({
    reportId: id,
  });

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm("정말 이 댓글을 삭제하시겠습니까?")) {
      deleteCommentMutation(commentId);
    }
  };

  // 차단하기
  const { mutate: blockUserMutation } = useBlockUser();

  const handleBlockPress = (nickname: string) => {
    if (
      window.confirm(
        `정말 ${nickname}님을 차단하시겠습니까?\n차단한 사용자의 댓글은 더 이상 보이지 않습니다.`,
      )
    ) {
      blockUserMutation(nickname);
    }
  };

  // 신고하기
  const handleReportPress = (nickname: string) => {
    setIsReportModalVisible(true);
    setInitialUserName(nickname);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 text-[#1A3A3A] animate-spin" />
      </div>
    );
  }

  if (isError || !report) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-base text-gray-500">
          제보 내역을 불러올 수 없습니다.
        </p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return { label: "제보 접수", style: "bg-amber-100 text-amber-800" };
      case "IN_PROGRESS":
        return { label: "조치 중", style: "bg-blue-100 text-blue-800" };
      case "RESOLVED":
        return { label: "조치 완료", style: "bg-green-100 text-green-800" };
      default:
        return { label: "접수", style: "bg-amber-100 text-amber-800" };
    }
  };

  const badge = getStatusBadge(report.status);

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-5xl mx-auto border-x border-gray-100 shadow-sm">
      {/* 1. 헤더 */}
      <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="뒤로가기"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">위기 제보 상세</h1>

        {isAuthor ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMoreMenu((prev) => !prev)}
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <MoreVertical className="w-6 h-6 text-gray-800" />
            </button>

            {/* 드롭다운 메뉴 */}
            {showMoreMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMoreMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20 overflow-hidden">
                  <button
                    type="button"
                    onClick={handleEditReport}
                    className="w-full px-4 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    수정하기
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteReport}
                    className="w-full px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    삭제하기
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setIsReportModalVisible(true);
              setInitialUserName(report.user.nickname);
            }}
            className="p-1.5 rounded-full hover:bg-red-50 transition-colors cursor-pointer"
            aria-label="신고하기"
          >
            <Siren className="w-5 h-5 text-red-500" />
          </button>
        )}
      </header>

      {/* 2. 상세 본문 영역 */}
      <main className="flex-1 p-5 space-y-6 overflow-y-auto pb-24">
        {/* 상태 태그 및 작성일 */}
        <div className="flex items-center justify-between">
          <span
            className={`px-3 py-1 rounded-md text-xs sm:text-sm font-semibold ${badge.style}`}
          >
            {badge.label}
          </span>
          <div className="flex items-center gap-1.5 text-gray-400 text-xs sm:text-sm">
            <Clock className="w-4 h-4" />
            <span>
              {new Date(report.createdAt).toLocaleDateString("ko-KR")}
            </span>
          </div>
        </div>

        {/* 제보 제목 */}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
          {report.title}
        </h2>

        {/* 이미지 갤러리 */}
        {report.images && report.images.length > 0 && (
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {report.images.map((imgUri, index) => (
              <div
                key={index}
                className="relative shrink-0 w-52 h-52 sm:w-60 sm:h-60 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50"
              >
                <Image
                  src={imgUri}
                  alt={`제보 이미지 ${index + 1}`}
                  fill
                  sizes="240px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* 제보 본문 */}
        <div className="text-base sm:text-lg text-gray-800 leading-relaxed whitespace-pre-line">
          {report.content}
        </div>

        {/* 위치 및 제보자 정보 카드 */}
        <div className="p-4 sm:p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-[#1A3A3A] shrink-0" />
            <span className="text-sm sm:text-base font-semibold text-gray-400 w-16 shrink-0">
              제보 위치
            </span>
            <span className="text-sm sm:text-base text-gray-800 font-medium truncate">
              {report.address}
            </span>
          </div>

          <div className="h-px bg-gray-200" />

          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-[#1A3A3A] shrink-0" />
            <span className="text-sm sm:text-base font-semibold text-gray-400 w-16 shrink-0">
              제보자
            </span>
            <span className="text-sm sm:text-base text-gray-900 font-bold">
              {report.user.nickname}
            </span>
          </div>
        </div>

        {/* 댓글 헤더 */}
        <div className="flex items-center gap-2 pt-4">
          <MessageCircleMore className="w-5 h-5 text-[#FF7F66]" />
          <h3 className="text-base sm:text-lg font-bold text-gray-900">
            댓글 ({report.comments ? report.comments.length : 0})
          </h3>
        </div>

        {/* 댓글 목록 */}
        {report.comments && report.comments.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {report.comments
              .filter(
                (comment) =>
                  !blockedList.some(
                    (b) => b.blockedUser.nickname === comment.user.nickname,
                  ),
              )
              .map((comment) => (
                <div key={comment.id} className="py-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <UserProfileAvatar
                        profileImage={comment.user?.profileImage}
                        nickname={comment.user?.nickname}
                        isPopoverVisible={activePopoverCommentId === comment.id}
                        onProfilePress={() => handleProfilePress(comment)}
                        onClosePopover={() => setActivePopoverCommentId(null)}
                        onReportPress={handleReportPress}
                        onBlockPress={handleBlockPress}
                      />
                      <span className="text-sm sm:text-base font-bold text-gray-900">
                        {comment.user?.nickname || "사용자"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm text-gray-400">
                        {formatDate(comment.createdAt)}
                      </span>
                      {comment.user.id === myInfo?.id && (
                        <button
                          type="button"
                          onClick={() => handleDeleteComment(comment.id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                          aria-label="댓글 삭제"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="pl-11 text-sm sm:text-base text-gray-700 leading-normal">
                    {comment.content}
                  </p>
                </div>
              ))}
          </div>
        ) : (
          <div className="py-12 text-center text-sm sm:text-base text-gray-400">
            첫번째 댓글을 남겨보세요!
          </div>
        )}
      </main>

      {/* 3. 하단 댓글 고정 입력창 */}
      <footer className="sticky bottom-0 z-30 p-3 sm:p-4 bg-white border-t border-gray-100 max-w-5xl w-full mx-auto">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="댓글을 입력해주세요..."
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendComment();
              }
            }}
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-full text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1A3A3A] transition-colors"
          />
          <button
            type="button"
            onClick={handleSendComment}
            disabled={!commentInput.trim() || createCommentPending}
            className="w-11 h-11 bg-[#FF7F66] hover:bg-[#e66f57] disabled:bg-gray-300 text-white rounded-full flex items-center justify-center shrink-0 transition-colors cursor-pointer"
          >
            {createCommentPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </footer>

      {/* 모달 컴포넌트들 */}
      <ReportModal
        visible={isReportModalVisible}
        onClose={() => setIsReportModalVisible(false)}
        initialUserName={initialUserName}
      />

      <CrisisReportModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        address={address}
        setAddress={setAddress}
        setLatitude={setLatitude}
        setLongitude={setLongitude}
        images={images}
        setImages={setImages}
        uploadImageMutation={uploadImageMutation}
        uploadImagePending={uploadImagePending}
        createReportPending={updateReportPending}
        handleGetCurrentLocation={handleGetCurrentLocation}
        handlePickImage={handlePickImage}
        handleRemoveImage={handleRemoveImage}
        handleCreateReport={handleUpdateReport}
      />
    </div>
  );
}
