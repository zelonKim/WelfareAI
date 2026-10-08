"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { User, Camera, X, Loader2 } from "lucide-react";
import { ProfileEditModalProps } from "@/types/user/ProfileEditModalProps";

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  visible,
  initialNickname,
  initialAvatarUri,
  isLoading,
  onClose,
  onPickImage,
  onSave,
  onPending,
  onRemoveImage,
  selectedImageUri,
}) => {
  const [nicknameInput, setNicknameInput] = useState(initialNickname);
  const [initialAvatar, setInitialAvatar] = useState(initialAvatarUri);

  useEffect(() => {
    if (visible) {
      setNicknameInput(initialNickname);
    }
  }, [visible, initialNickname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && visible && !onPending) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [visible, onClose, onPending]);

  ////////////////////////////////////////////////////////////////////////////////////

  const handleSave = (e?: React.SubmitEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (!nicknameInput.trim() || onPending) return;
    onSave({ nickname: nicknameInput.trim(), imageUri: selectedImageUri });
  };

  const displayAvatarUri =
    selectedImageUri === null ? initialAvatar : selectedImageUri;

  if (!visible) return null;

  ////////////////////////////////////////////////////////////////////////////////////

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => !onPending && onClose()}
      />

      <div className="relative z-10 w-full max-w-md transform rounded-2xl bg-white p-6 shadow-xl transition-all">
        <h2 className="text-xl font-bold text-slate-900 text-center mb-6">
          내 정보 변경
        </h2>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="relative flex justify-center">
            <div className="relative">
              <button
                type="button"
                onClick={onPickImage}
                disabled={isLoading || onPending}
                className="cursor-pointer group relative flex h-28 w-28 items-center justify-center rounded-full bg-[#1665341F]  ring-slate-100  transition hover:opacity-80 focus:outline-none disabled:cursor-not-allowed"
              >
                <div className="relative h-full w-full overflow-hidden rounded-full flex items-center justify-center">
                  {displayAvatarUri ? (
                    <Image
                      src={displayAvatarUri}
                      alt="프로필 미리보기"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <User className="h-14 w-14 bg-slate-[#1665341F] text-[#1A3A3A]" />
                  )}
                </div>
                <div className="cursor-pointer absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-slate-200">
                  <Camera className="h-4 w-4 text-slate-600" />
                </div>
              </button>

              {displayAvatarUri && (
                <button
                  type="button"
                  onClick={() => {
                    setInitialAvatar(null);
                    onRemoveImage();
                  }}
                  disabled={isLoading || onPending}
                  className="cursor-pointer absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-white shadow-md transition hover:bg-orange-600 disabled:opacity-50"
                  aria-label="프로필 사진 삭제"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="nickname-input"
              className="block text-sm font-semibold text-slate-700"
            >
              별명
            </label>
            <input
              id="nickname-input"
              type="text"
              value={nicknameInput}
              onChange={(e) => setNicknameInput(e.target.value)}
              placeholder="별명 (2~12자)"
              maxLength={12}
              disabled={isLoading || onPending}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 placeholder-slate-400 focus:border-orange-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-orange-400 disabled:opacity-50"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={onPending}
              className="cursor-pointer flex-1 rounded-xl bg-slate-100 py-3.5 text-base font-semibold text-slate-600 transition hover:bg-slate-200 disabled:opacity-50"
            >
              취소
            </button>

            <button
              type="submit"
              disabled={!nicknameInput.trim() || onPending}
              className="cursor-pointer flex flex-1 items-center justify-center rounded-xl bg-[#FF7F66] py-3.5 text-base font-semibold text-white transition hover:bg-[#ff6a4d] disabled:opacity-50"
            >
              {onPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "변경하기"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
