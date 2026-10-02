"use client";

import React, { useEffect, useRef } from "react";
import { Camera, MapPin, X, Loader2 } from "lucide-react";
import { CrisisReportModalProps } from "@/types/crisisReport/CrisisReportModalProps";
import { ImageItem } from "./ImageItem";

export default function CrisisReportModal({
  visible,
  onClose,
  title,
  setTitle,
  content,
  setContent,
  address,
  setAddress,
  setLatitude,
  setLongitude,
  images,
  setImages,
  uploadImageMutation,
  uploadImagePending = false,
  createReportPending = false,
  handleGetCurrentLocation,
  handlePickImage,
  handleRemoveImage,
  handleCreateReport,
}: CrisisReportModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ESC 키로 모달 닫기 이벤트
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && visible) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [visible, onClose]);

  // 웹 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handlePickImage({
        files: Array.from(files),
        setImages,
        uploadImageMutation,
      });
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      {/* 배경 클릭 시 닫기 오버레이 */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* 모달 카어드 본문 */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            위기 이웃 제보하기
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 폼 콘텐츠 (스크롤 가능) */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* 1. 제보 제목 */}
          <div className="space-y-2">
            <label className="block text-sm sm:text-base font-semibold text-gray-800">
              제목
            </label>
            <input
              type="text"
              placeholder="예: 단전/단수가 의심되는 가구 제보"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-[#F8F9FA] border border-[#E2E8F0] rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1A3A3A] transition-colors"
            />
          </div>

          {/* 2. 상세 내용 */}
          <div className="space-y-2">
            <label className="block text-sm sm:text-base font-semibold text-gray-800">
              상세 내용
            </label>
            <textarea
              rows={4}
              placeholder="위기 상황에 대해 자세히 적어주세요."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 bg-[#F8F9FA] border border-[#E2E8F0] rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1A3A3A] transition-colors resize-none"
            />
          </div>

          {/* 3. 위치 정보 */}
          <div className="space-y-2">
            <label className="block text-sm sm:text-base font-semibold text-gray-800">
              위치
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="위치를 입력해주세요"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="flex-1 px-4 py-3 bg-[#F8F9FA] border border-[#E2E8F0] rounded-xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1A3A3A] transition-colors"
              />
              <button
                type="button"
                onClick={() =>
                  handleGetCurrentLocation({
                    setLatitude,
                    setLongitude,
                    setAddress,
                  })
                }
                className="flex items-center gap-1.5 px-4 py-3 bg-[#FF7F66] hover:bg-[#e66f57] text-white text-sm sm:text-base font-semibold rounded-xl shrink-0 transition-colors cursor-pointer"
              >
                <MapPin className="w-4 h-4" />
                <span>현위치</span>
              </button>
            </div>
          </div>

          {/* 4. 사진 업로드 */}
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <label className="text-sm sm:text-base font-semibold text-gray-800">
                현장 사진
              </label>
              <span className="text-sm sm:text-base font-semibold text-gray-500">
                ({images.length})
              </span>
            </div>

            {/* 숨겨진 파일 선택 Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              multiple
              className="hidden"
            />

            <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
              <button
                type="button"
                disabled={uploadImagePending}
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-xl bg-[#F8F9FA] border border-dashed border-[#CBD5E1] flex flex-col items-center justify-center gap-1 text-[#6E8B8B] hover:border-[#1A3A3A] hover:text-[#1A3A3A] shrink-0 transition-colors cursor-pointer disabled:opacity-50"
              >
                {uploadImagePending ? (
                  <Loader2 className="w-5 h-5 animate-spin text-[#FF7F66]" />
                ) : (
                  <>
                    <Camera className="w-5 h-5" />
                    <span className="text-xs font-medium">사진 추가</span>
                  </>
                )}
              </button>

              {images.map((uri, index) => (
                <ImageItem
                  key={`${uri}-${index}`}
                  uri={uri}
                  onRemove={() => handleRemoveImage(index)}
                />
              ))}
            </div>
          </div>

          {/* 하단 버튼 영역 */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-2 py-3.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold text-base rounded-xl transition-colors cursor-pointer"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleCreateReport}
              disabled={createReportPending}
              className="flex-3 py-3.5 px-4 bg-[#1A3A3A] hover:bg-[#142e2e] disabled:bg-gray-300 text-white font-semibold text-base rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              {createReportPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>제출 중...</span>
                </>
              ) : (
                <span>제출하기</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
