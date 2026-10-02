"use client";

import React, { useState } from "react";
import { MoreHorizontal, Trash2 } from "lucide-react";

import { ChatItemProps } from "@/types/community/ChatItemProps";
import { UserProfileAvatar } from "./UserProfileAvatar";

export const ChatItem = ({
  currentUserId,
  handleDelete,
  item,
  handleProfilePress,
  activePopoverItemId,
  setActivePopoverItemId,
  handleReportPress,
  handleBlockPress,
  blockedList,
}: ChatItemProps) => {
  const isMyMessage = item.userId === currentUserId;
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);

  // 시간 포맷팅 (오전/오후 HH:MM)
  const formattedTime = new Date(item.createdAt).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex w-full my-3 ${
        isMyMessage ? "justify-end" : "justify-start"
      }`}
    >
      {!isMyMessage ? (
        /* 상대방 메시지 */
        <div className="flex max-w-[85%] sm:max-w-[75%] flex-col gap-1.5">
          {/* 프로필 이미지 및 닉네임 */}
          <div className="flex items-center gap-2.5">
            <UserProfileAvatar
              profileImage={item.user?.profileImage}
              nickname={item.user?.nickname}
              size={36}
              iconSize={20}
              isPopoverVisible={activePopoverItemId === item.id}
              onProfilePress={() => handleProfilePress(item)}
              onClosePopover={() => setActivePopoverItemId(null)}
              onReportPress={handleReportPress}
              onBlockPress={handleBlockPress}
            />
            <span className="text-sm font-semibold text-slate-600">
              {item.user?.nickname || "익명"}
            </span>
          </div>

          {/* 메시지 말풍선 & 시간 */}
          <div className="flex items-end gap-2 pl-1">
            <div className="rounded-2xl rounded-tl-xs border border-slate-200 bg-white px-4 py-3 shadow-2xs">
              <p className="whitespace-pre-line text-base leading-relaxed text-slate-800">
                {item.message}
              </p>
            </div>
            <span className="shrink-0 text-xs font-medium text-slate-400">
              {formattedTime}
            </span>
          </div>
        </div>
      ) : (
        /* 내 메시지 */
        <div className="group relative flex max-w-[85%] sm:max-w-[75%] items-end justify-end gap-2">
          {/* 웹/데스크톱용 삭제/옵션 더보기 버튼 (호버 시 표시) */}
          <div className="relative">
            <button
              onClick={() => setShowDeleteMenu((prev) => !prev)}
              className="opacity-0 group-hover:opacity-100 rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition"
              title="옵션"
            >
              {/* <MoreHorizontal className="h-4 w-4" /> */}
            </button>

            {/* 삭제 드롭다운 메뉴 */}
            {showDeleteMenu && (
              <div className="absolute bottom-full right-0 mb-1 z-20 w-24 rounded-lg border border-slate-100 bg-white shadow-md ring-1 ring-black/5">
                <button
                  onClick={() => {
                    setShowDeleteMenu(false);
                    handleDelete(item.id);
                  }}
                  className="flex w-full items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="h-4 w-4" />
                  삭제
                </button>
              </div>
            )}
          </div>

          {/* 전송 시간 */}
          <span className="shrink-0 text-xs font-medium text-slate-400">
            {formattedTime}
          </span>

          {/* 내 메시지 말풍선 */}
          <div
            onClick={() => handleDelete(item.id)}
            className="cursor-pointer rounded-2xl rounded-tr-xs bg-[#FF6C4B] px-4 py-3 shadow-2xs transition hover:bg-[#e05b3d]"
            title="클릭하여 메시지 삭제"
          >
            <p className="whitespace-pre-line text-base leading-relaxed text-white">
              {item.message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
