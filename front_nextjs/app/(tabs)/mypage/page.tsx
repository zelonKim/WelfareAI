"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Settings,
  User,
  Heart,
  Ban,
  ChevronRight,
  Loader2,
  Siren,
  Info,
  UserKey,
} from "lucide-react";
import { removeAccessToken } from "@/api/token";
import { getMyInfo } from "@/api/user/getMyInfo";
import { BlockModal } from "@/components/BlockModal";
import { ProfileEditModal } from "@/components/ProfileEditModal";
import { ReportModal } from "@/components/ReportModal";
import { useDeleteAccount } from "@/hooks/user/useDeleteAccount";
import { useSaveProfile } from "@/hooks/user/useSaveProfile";
import { UserProfile } from "@/types/user/UserProfile";
import { handlePickProfileImage } from "@/utils/handlePickProfileImage";

export default function MyPageScreen() {
  const router = useRouter();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

  ////////////////////////////////////////////////////////////////////////////////////

  const { data: myInfo, isPending: myInfoPending } = useQuery<UserProfile>({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
  });

  ////////////////////////////////////////////////////////////////////////////////////

  const handleOpenEditModal = () => setIsEditModalOpen(true);
  const handleCloseEditModal = () => setIsEditModalOpen(false);

  ////////////////////////////////////////////////////////////////////////////////////

  const { saveProfile, isSaving } = useSaveProfile({
    onSuccessCallback: handleCloseEditModal,
  });

  const handleSaveProfile = (data: {
    nickname: string;
    imageUri?: string | null;
  }) => {
    saveProfile({
      nickname: data.nickname,
      selectedImageUri: data.imageUri ?? selectedImageUri,
      currentProfileImage: myInfo?.profileImage,
    });
  };

  ////////////////////////////////////////////////////////////////////////////////////

  const handleRemoveProfileImage = () => {
    setSelectedImageUri(null);
  };

  ////////////////////////////////////////////////////////////////////////////////////

  const { mutate: deleteAccountMutation, isPending: deleteAccountPending } =
    useDeleteAccount();

  const handleDeleteAccount = () => {
    if (
      window.confirm("정말로 탈퇴하시겠습니까? 탈퇴한 계정 정보는 복구할 수 없습니다.")
    ) {
      deleteAccountMutation();
    }
  };

  ////////////////////////////////////////////////////////////////////////////////////

  const onPressLogout = async () => {
    await removeAccessToken();
    router.replace("/login");
  };

  const handleLogout = () => {
    if (window.confirm("정말 로그아웃 하시겠습니까?")) {
      onPressLogout();
    }
  };

  ////////////////////////////////////////////////////////////////////////////////////

  if (myInfoPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-slate-500" />
      </div>
    );
  }

  ////////////////////////////////////////////////////////////////////////////////////

  return (
    <div className="min-h-screen bg-slate-50 pb-20 text-slate-800">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFEFEA]">
            <Settings className="h-6 w-6 text-[#FF7F66]" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">환경 설정</h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 pt-6">
        <section className="relative mb-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <button
            onClick={handleOpenEditModal}
            className="cursor-pointer absolute right-5 top-5 rounded-md px-3 py-1.5 text-xs font-semibold text-slate-500 transition bg-slate-100   hover:bg-slate-200"
          >
            변경하기
          </button>

          <div className="flex flex-col items-center">
            <div className="mb-4">
              {myInfo?.profileImage ? (
                <Image
                  src={myInfo.profileImage}
                  alt="프로필 이미지"
                  width={96}
                  height={96}
                  className="h-24 w-24 rounded-full object-cover ring-2 ring-slate-100"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#1665341F] text-[#1A3A3A]">
                  <User className="h-12 w-12" />
                </div>
              )}
            </div>

            <div className="text-center">
              <h2 className="text-xl font-bold text-slate-800 mb-1">
                {myInfo?.nickname}
              </h2>
              <p className="text-sm font-medium text-slate-500">
                {myInfo?.email}
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h3 className="mb-3 px-1 text-base font-bold text-slate-600">
            앱 설정
          </h3>

          <div className="divide-y divide-slate-100 rounded-2xl bg-white px-5 shadow-sm ring-1 ring-slate-100">
            <button
              onClick={() => router.push("/together")}
              className="cursor-pointer flex w-full items-center justify-between py-4 text-left transition hover:opacity-70"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span className="text-[18px] font-semibold text-slate-800">
                    함께하기
                  </span>
                </div>
                <p className="text-[15px] text-slate-500 pl-7">
                  서비스 운영과 발전에 함께합니다.
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-400" />
            </button>

            <button
              onClick={() => setIsReportModalOpen(true)}
              className="cursor-pointer flex w-full items-center justify-between py-4 text-left transition hover:opacity-70"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Siren className="h-5 w-5 text-red-600" />
                  <span className="text-[18px]  font-semibold text-slate-800">
                    신고하기
                  </span>
                </div>
                <p className="text-[15px] text-slate-500 pl-7">
                  악성 댓글 및 대화를 신고합니다.
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-400" />
            </button>

            <button
              onClick={() => setIsBlockModalOpen(true)}
              className="cursor-pointer flex w-full items-center justify-between py-4 text-left transition hover:opacity-70"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Ban className="h-5 w-5 text-slate-500" />
                  <span className="text-[18px]  font-semibold text-slate-800">
                    차단하기
                  </span>
                </div>
                <p className="text-[15px] text-slate-500 pl-7">
                  악성 댓글 및 대화를 차단합니다.
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-400" />
            </button>

            <button
              onClick={() => router.push("/terms")}
              className="cursor-pointer flex w-full items-center justify-between py-4 text-left transition hover:opacity-70"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Info className="h-5 w-5 text-orange-500" />
                  <span className="text-[18px]  font-semibold text-slate-800">
                    서비스 이용약관
                  </span>
                </div>
                <p className="text-[15px] text-slate-500 pl-7">
                  서비스 약관에 대해 살펴봅니다.
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-400" />
            </button>

            <button
              onClick={() => router.push("/privacy")}
              className="cursor-pointer flex w-full items-center justify-between py-4 text-left transition hover:opacity-70"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <UserKey className="h-5 w-5 text-blue-800" />
                  <span className="text-[18px]  font-semibold text-slate-800">
                    개인정보 처리방침
                  </span>
                </div>
                <p className="text-[15px] text-slate-500 pl-7">
                  개인정보 처리에 대해 살펴봅니다.
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-400" />
            </button>
          </div>
        </section>

        <div className="flex items-center justify-center gap-3 text-[15px]">
          <button
            onClick={handleLogout}
            className="cursor-pointer text-slate-500 hover:underline underline-offset-4 hover:text-slate-800"
          >
            로그아웃
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={handleDeleteAccount}
            disabled={deleteAccountPending}
            className="cursor-pointer text-red-500 hover:underline underline-offset-4 hover:text-red-600 disabled:opacity-50"
          >
            회원탈퇴
          </button>
        </div>

        <BlockModal
          visible={isBlockModalOpen}
          onClose={() => setIsBlockModalOpen(false)}
        />

        <ReportModal
          visible={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
        />

        <ProfileEditModal
          visible={isEditModalOpen}
          initialNickname={myInfo?.nickname ?? ""}
          initialAvatarUri={myInfo?.profileImage}
          selectedImageUri={selectedImageUri}
          isLoading={myInfoPending}
          onClose={handleCloseEditModal}
          onPickImage={() => handlePickProfileImage(setSelectedImageUri)}
          onSave={handleSaveProfile}
          onRemoveImage={handleRemoveProfileImage}
          onPending={isSaving}
        />
      </main>
    </div>
  );
}
