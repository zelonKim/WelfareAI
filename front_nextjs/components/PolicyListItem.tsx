"use client";

import React from "react";
import { PolicyItem } from "@/types/policy/PolicyItem";
import { Building, CalendarDays } from "lucide-react";

export const PolicyListItem = ({ item }: { item: PolicyItem }) => {
  const handleClick = () => {
    if (item.detailUrl) {
      window.open(item.detailUrl, "_blank", "noopener,noreferrer");
    }
  };
  
  ////////////////////////////////////////////////////////////////////////////////////

  return (
    <div
      onClick={handleClick}
      className={`group flex bg-white rounded-2xl overflow-hidden border border-[#f1f5f9] shadow-sm hover:shadow-md transition-all duration-200 ${
        item.detailUrl ? "cursor-pointer" : "cursor-default"
      }`}
    >
      <div className="w-1.5 bg-[#1A3A3A] shrink-0 group-hover:bg-[#FF7F66] transition-colors" />

      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-3 mb-2">
            <h3 className="text-base sm:text-lg font-bold text-[#0f172a] truncate tracking-tight group-hover:text-[#FF7F66] transition-colors">
              {item.title}
            </h3>
            {item.isOnlineApply && (
              <span className="shrink-0 bg-[#dcfce7] text-[#15803d] text-xs sm:text-sm font-bold px-2.5 py-1 rounded-md">
                온라인신청
              </span>
            )}
          </div>

          <p className="text-sm sm:text-base text-[#475569] leading-relaxed line-clamp-2 mb-4">
            {item.summary || "상세 내용을 확인하려면 클릭하세요."}
          </p>
        </div>

        <div className="pt-3 border-t border-[#1665341F]  flex items-center justify-between text-xs sm:text-sm font-medium text-[#64748b]">
          <div className="flex items-center gap-1">
            <Building size={14} style={{ marginBottom: 2 }} />
            <span>{item.department}</span>
            {item.supportCycle && (
              <>
                <span className="text-gray-300 px-1">•</span>
                <CalendarDays size={14} style={{ marginBottom: 1 }} />
                <span>{item.supportCycle}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
