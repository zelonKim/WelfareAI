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
import { getStatusBadge } from "@/utils/getStatusBadge";
import { useCrisisReportDetailLanguage } from "@/hooks/languages/useCrisisReportDetailLanguage"; // 👈 훅 임포트

export default function CrisisReportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { t, locale } = useCrisisReportDetailLanguage();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [images, setImages] = useState<string[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [initialUserName, setInitialUserName] = useState("");
  const [activePopoverCommentId, setActivePopoverCommentId] = useState<
    string | null
  >(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const {
    data: report,
    isLoading,
    isError,
  } = useQuery<CrisisReportDetail>({
    queryKey: ["crisisReport", id],
    queryFn: () => getCrisisReportById(id),
    enabled: !!id,
    refetchInterval: 10000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  });

  const { data: myInfo } = useQuery<UserProfile>({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
  });

  const isAuthor = myInfo?.id === report?.user.id;

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

  const { mutate: uploadImageMutation, isPending: uploadImagePending } =
    useUploadImage();

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
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

  const { mutate: deleteReportMutation } = useDeleteCrisisReport();

  const handleDeleteReport = () => {
    setShowMoreMenu(false);
    if (window.confirm(t.deleteReportConfirm)) {
      deleteReportMutation(id);
    }
  };

  const { mutate: createCommentMutation, isPending: createCommentPending } =
    useCreateCrisisComment({
      reportId: id,
      onSuccessCallback: () => setCommentInput(""),
    });

  const handleSendComment = () => {
    if (!commentInput.trim() || createCommentPending) return;
    createCommentMutation(commentInput.trim());
  };

  const { mutate: deleteCommentMutation } = useDeleteCrisisComment({
    reportId: id,
  });

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm(t.deleteCommentConfirm)) {
      deleteCommentMutation(commentId);
    }
  };

  const handleProfilePress = (comment: Comment) => {
    if (comment.user.id === myInfo?.id) return;
    setActivePopoverCommentId((prev) =>
      prev === comment.id ? null : comment.id,
    );
  };

  const { data: blockedList = [] } = useQuery<BlockedItem[]>({
    queryKey: ["blockedUsers"],
    queryFn: getBlockedUsers,
  });

  const { mutate: blockUserMutation } = useBlockUser();

  const handleBlockPress = (nickname: string) => {
    if (
      window.confirm(
        `${t.blockConfirmPrefix}${nickname}${t.blockConfirmSuffix}`,
      )
    ) {
      blockUserMutation(nickname);
    }
  };

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
        <p className="text-base text-gray-500">{t.loadingError}</p>{" "}
      </div>
    );
  }

  const badge = getStatusBadge(report.status, locale);

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-5xl mx-auto border-x border-gray-100 shadow-sm">
      <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label={t.backAria}
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="text-[19px] font-bold text-gray-900">{t.headerTitle}</h1>

        {isAuthor ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMoreMenu((prev) => !prev)}
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label={t.moreAria}
            >
              <MoreVertical className="w-6 h-6 text-gray-800" />
            </button>

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
                    {t.editButton}
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteReport}
                    className="w-full px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    {t.deleteButton}
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
            aria-label={t.reportAria}
          >
            <Siren className="w-5 h-5 text-red-500" />
          </button>
        )}
      </header>

      <main className="flex-1 p-5 space-y-6 overflow-y-auto pb-24">
        <div className="flex items-center justify-between">
          <span
            className={`px-3 py-1 rounded-md text-xs sm:text-sm font-semibold ${badge.style}`}
          >
            {badge.label}
          </span>
          <div className="flex items-center gap-1.5 text-gray-400 text-xs sm:text-[13px]">
            <Clock className="w-4 h-4" />
            <span>
              {new Date(report.createdAt).toLocaleDateString(
                locale === "ko" ? "ko-KR" : "en-US",
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                },
              )}
            </span>
          </div>
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
          {report.title}
        </h2>

        {report.images && report.images.length > 0 && (
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {report.images.map((imgUri, index) => (
              <div
                key={index}
                className="relative shrink-0 w-52 h-52 sm:w-60 sm:h-60 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50"
              >
                <Image
                  src={imgUri}
                  alt={`Report Image ${index + 1}`}
                  fill
                  sizes="240px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        <div className="text-[15px] sm:text-base text-gray-800 leading-relaxed whitespace-pre-line">
          {report.content}
        </div>

        <div className="p-4 sm:p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-[#1A3A3A] shrink-0" />
            <span className="text-sm sm:text-[15px] font-semibold text-gray-400 w-24 shrink-0">
              {t.locationLabel}
            </span>
            <span className="text-sm sm:text-[15px] text-gray-800 font-medium truncate">
              {report.address}
            </span>
          </div>

          <div className="h-px bg-gray-200" />

          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-[#1A3A3A] shrink-0" />
            <span className="text-sm sm:text-[15px] font-semibold text-gray-400 w-24 shrink-0">
              {t.authorLabel}
            </span>
            <span className="text-sm sm:text-[15px] text-gray-900 font-bold">
              {report.user.nickname}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-6 mt-10 border-t-2 border-slate-100">
          <MessageCircleMore className="w-5 h-5 text-[#FF7F66]" />
          <h3 className="text-[15px] sm:text-base font-bold text-gray-900">
            {t.commentsTitle} ({report.comments ? report.comments.length : 0})
          </h3>
        </div>

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
                        {comment.user?.nickname || "User"}
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
                          aria-label={t.deleteCommentAria}
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
          <div className="py-12 text-center text-sm sm:text-[15px] text-gray-400">
            {t.noComments}
          </div>
        )}
      </main>

      <footer className="sticky bottom-0 z-30 p-3 sm:p-4 bg-white border-t border-gray-100 max-w-5xl w-full mx-auto">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder={t.commentPlaceholder}
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.nativeEvent.isComposing) return;

              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendComment();
              }
            }}
            className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-full text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 transition-colors"
          />
          <button
            type="button"
            onClick={handleSendComment}
            disabled={!commentInput.trim() || createCommentPending}
            className="w-11 h-11 bg-[#FF7F66] hover:bg-[#e66f57] disabled:bg-gray-300 text-white rounded-full flex items-center justify-center shrink-0 transition-colors cursor-pointer"
            aria-label={t.sendAria}
          >
            {createCommentPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </footer>

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
