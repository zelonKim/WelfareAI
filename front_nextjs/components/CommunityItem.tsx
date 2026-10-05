"use client";

import React from "react";
import Link from "next/link";
import { UserIcon, Users } from "lucide-react";
import { CommunityPost } from "@/types/community/CommunityPost";
import Image from "next/image";

interface CommunityItemProps {
  item: CommunityPost;
}

export const CommunityItem = ({ item }: CommunityItemProps) => {
  const approvedCount = item._count?.members ?? 0;
  const isVolunteer = item.type === "VOLUNTEER";

  return (
    <Link
      href={`/community/${item.id}`}
      className="block bg-white rounded-2xl p-5 mb-3.5  hover:border-[#FF7F66]/60 border-2 shadow-xs transition-all duration-200  border-gray-100/80 group cursor-pointer"
    >
      {/* 카드 상단: 태그 & 제목 */}
      <div className="flex items-center gap-2.5 mb-2.5">
        <span className="shrink-0 px-2.5 py-1 rounded-md text-xs sm:text-sm font-bold bg-[#FFEFEA] text-[#FF7F66]">
          {isVolunteer ? "봉사" : "소통"}
        </span>

        <h3 className="text-lg sm:text-xl font-bold text-[#1A252C] truncate  transition-colors">
          {item.title}
        </h3>
      </div>

      {/* 카드 본문 (2줄 제한) */}
      <p className="text-sm sm:text-base text-[#5C6870] leading-relaxed line-clamp-2 mb-4">
        {item.content}
      </p>

      {/* 카드 푸터: 작성자 & 참여 인원 */}
      <div className="flex items-center justify-between pt-3 border-t border-[#F2F6F6]">
        <div className="flex items-center gap-2">
          {item.host?.profileImage ? (
            <div className="relative w-[34px] h-[34px] overflow-hidden rounded-full bg-primary-light">
              <Image
                src={item.host.profileImage}
                alt={item.host.nickname || "호스트 프로필"}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-[34px] h-[34px] rounded-full bg-primary-light flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-primary" />
            </div>
          )}
          <span className="text-sm sm:text-sm font-medium text-[#8E99A3]">
            {item.host?.nickname || "익명"}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[#8E99A3]">
          <Users className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          <span className="text-xs sm:text-sm font-semibold text-[#5C6870]">
            {approvedCount}명
          </span>
        </div>
      </div>
    </Link>
  );
};
