"use client";

import React from "react";
import Image from "next/image";
import { User as UserIcon, ShieldAlert, Ban } from "lucide-react";
import { UserProfileAvatarProps } from "@/types/user/UserProfileAvatarProps";

export const UserProfileAvatar: React.FC<UserProfileAvatarProps> = ({
  profileImage,
  nickname = "유저",
  size = 40,
  iconSize = 22,
  isPopoverVisible = false,
  onProfilePress,
  onClosePopover,
  onReportPress,
  onBlockPress,
}) => {
  return (
    <div className="relative inline-block z-30">
      <button
        type="button"
        onClick={onProfilePress}
        style={{ width: `${size}px`, height: `${size}px` }}
        className="relative rounded-full overflow-hidden flex items-center justify-center bg-teal-50 border border-gray-100 transition-transform active:scale-95 cursor-pointer focus:outline-none shrink-0"
        aria-label={`${nickname} 프로필`}
      >
        {profileImage ? (
          <Image
            src={profileImage}
            alt={`${nickname} 프로필 이미지`}
            fill
            sizes={`${size}px`}
            className="object-cover"
          />
        ) : (
          <UserIcon
            style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
            className="text-[#1A3A3A]"
          />
        )}
      </button>

      {isPopoverVisible && (
        <>
          <div
            className="fixed inset-0 z-40 bg-transparent"
            onClick={onClosePopover}
          />

          <div
            style={{ left: `${size + 8}px` }}
            className="absolute top-0 z-50 flex items-center justify-around w-36 py-2 px-1 bg-white rounded-xl border border-gray-100 shadow-xl animate-in fade-in zoom-in-95 duration-150"
          >
            <button
              type="button"
              onClick={() => {
                onReportPress?.(nickname);
                onClosePopover?.();
              }}
              className="flex items-center gap-1.5 px-2 py-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 stroke-[2.2]" />
              <span className="text-sm font-semibold">신고</span>
            </button>

            <div className="w-px h-4 bg-gray-200" />

            <button
              type="button"
              onClick={() => {
                onBlockPress?.(nickname);
                onClosePopover?.();
              }}
              className="flex items-center gap-1.5 px-2 py-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            >
              <Ban className="w-4 h-4 stroke-[2.2]" />
              <span className="text-sm font-semibold">차단</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
