"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Bell, MapPin, Plus, AlertCircle, Loader2 } from "lucide-react";
import { getAllCrisisReports } from "@/api/crisisReport/getAllCrisisReports";
import { getMyCrisisReports } from "@/api/crisisReport/getMyCrisisReports";
import CrisisReportModal from "@/components/CrisisReportModal";
import { useUploadImage } from "@/hooks/common/useUploadImage";
import { useCreateCrisisReport } from "@/hooks/crisisReport/useCreateCrisisReport";
import { CrisisReport } from "@/types/crisisReport/CrisisReport";
import { formatDate } from "@/utils/formatDate";
import { handleGetCurrentLocation } from "@/utils/handleGetCurrentLocation";
import { handlePickImage } from "@/utils/handlePickImage";

export default function CrisisReportPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"all" | "my">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();
  const [images, setImages] = useState<string[]>([]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTitle("");
    setContent("");
    setAddress("");
    setLatitude(undefined);
    setLongitude(undefined);
    setImages([]);
  };

  // 위기 제보하기
  const { mutate: createReportMutation, isPending: createReportPending } =
    useCreateCrisisReport();

  const handleCreateReport = () => {
    if (!title.trim()) {
      alert("제목을 입력해 주세요.");
      return;
    }

    if (!content.trim()) {
      alert("상세 내용을 입력해 주세요.");
      return;
    }

    if (!address.trim()) {
      alert("위치를 입력해 주세요.");
      return;
    }

    createReportMutation({
      title: title.trim(),
      content: content.trim(),
      images,
      latitude,
      longitude,
      address: address.trim(),
    });

    handleCloseModal();
  };

  // 이미지 업로드 Mutation
  const { mutate: uploadImageMutation, isPending: uploadImagePending } =
    useUploadImage();

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  // 1. 전체 제보 조회
  const {
    data: allReports,
    isPending: allReportsPending,
    isRefetching: allReportsRefetching,
    refetch: allReportsRefetch,
  } = useQuery<CrisisReport[]>({
    queryKey: ["crisisReports", "all"],
    queryFn: getAllCrisisReports,
  });

  // 2. 내 제보 조회
  const {
    data: myReports,
    isPending: myReportsPending,
    isRefetching: myReportsRefetching,
    refetch: myReportsRefetch,
  } = useQuery<CrisisReport[]>({
    queryKey: ["crisisReports", "my"],
    queryFn: getMyCrisisReports,
  });

  const reports = activeTab === "all" ? allReports : myReports;
  const isPending = activeTab === "all" ? allReportsPending : myReportsPending;
  const isRefetching =
    activeTab === "all" ? allReportsRefetching : myReportsRefetching;
  const refetch = activeTab === "all" ? allReportsRefetch : myReportsRefetch;

  const handleCardPress = (id: string) => {
    router.push(`/crisisReport/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#F2F6F6] text-[#1A3A3A] relative pb-28">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-6 py-4 bg-[#F2F6F6] border-b border-[#1A3A3A]/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#FF7F66]/15 flex items-center justify-center">
            <Bell className="w-5 h-5 text-[#FF7F66]" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1A3A3A]">
            위기 이웃 제보
          </h1>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* 탭 전환 (전체 제보 / 내 제보) */}
        <div className="flex bg-[#E4ECEC] p-1 rounded-xl my-4">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`flex-1 py-2.5 text-sm sm:text-base font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === "all"
                ? "bg-white text-[#1A3A3A] shadow-sm"
                : "text-[#6E8B8B] hover:text-[#1A3A3A]"
            }`}
          >
            전체 제보
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("my")}
            className={`flex-1 py-2.5 text-sm sm:text-base font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === "my"
                ? "bg-white text-[#1A3A3A] shadow-sm"
                : "text-[#6E8B8B] hover:text-[#1A3A3A]"
            }`}
          >
            내가 쓴 제보
          </button>
        </div>

        {/* 로딩 / 목록 영역 */}
        {isPending || isRefetching ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#6E8B8B] gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF7F66]" />
            <p className="text-base font-medium">제보 내역을 불러오는 중...</p>
          </div>
        ) : (
          <main className="space-y-3.5">
            {reports && reports.length > 0 ? (
              reports.map((item) => (
                <article
                  key={item.id}
                  onClick={() => handleCardPress(item.id)}
                  className="bg-white p-5 rounded-2xl  border-[#1A3A3A]/10  hover:border-[#FF7F66]/60 border-2 shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h2 className="text-base sm:text-lg font-bold text-[#1A3A3A] group-hover:text-[#FF7F66] transition-colors line-clamp-1">
                      {item.title}
                    </h2>
                    <time className="text-xs sm:text-sm text-gray-400 shrink-0">
                      {formatDate(item.createdAt)}
                    </time>
                  </div>

                  <p className="text-sm sm:text-base text-[#6E8B8B] leading-relaxed line-clamp-2 mb-3">
                    {item.content}
                  </p>

                  {item.address && (
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#6E8B8B] font-medium pt-2 border-t border-gray-100">
                      <MapPin className="w-4 h-4 text-[#6E8B8B] shrink-0" />
                      <span className="truncate">{item.address}</span>
                    </div>
                  )}
                </article>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center text-[#6E8B8B] gap-3">
                <AlertCircle className="w-10 h-10 text-[#A3B8B8]" />
                <p className="text-base font-medium">
                  {activeTab === "all"
                    ? "등록된 제보 내역이 없습니다."
                    : "작성한 제보 내역이 없습니다."}
                </p>
              </div>
            )}
          </main>
        )}
      </div>

      {/*  제보하기 */}
      <div className="fixed bottom-6 right-6 sm:right-10 z-30">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#FF7F66] hover:bg-[#e66f57] text-white px-5 py-3.5 rounded-full shadow-lg transition-transform active:scale-95 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span className="font-bold text-base sm:text-lg">제보하기</span>
        </button>
      </div>

      {/* 모달 컴포넌트 */}
      <CrisisReportModal
        visible={isModalOpen}
        onClose={handleCloseModal}
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
        createReportPending={createReportPending}
        handleGetCurrentLocation={handleGetCurrentLocation}
        handlePickImage={handlePickImage}
        handleRemoveImage={handleRemoveImage}
        handleCreateReport={handleCreateReport}
      />
    </div>
  );
}
