"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Loader2 } from "lucide-react";
import { ImageItemProps } from "@/types/common/ImageItemProps";

export const ImageItem = ({ uri, onRemove }: ImageItemProps) => {
  const [loading, setLoading] = useState(true);

  if (!uri) return null;

  return (
    <div className="relative shrink-0 w-20 h-20 group">
      {loading && (
        <div className="absolute inset-0 bg-gray-100 rounded-xl flex items-center justify-center z-10">
          <Loader2 className="w-5 h-5 text-[#6E8B8B] animate-spin" />
        </div>
      )}

      <div className="relative w-full h-full rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
        <Image
          src={uri}
          alt="업로드 현장 사진"
          fill
          sizes="80px"
          className={`object-cover transition-opacity duration-200 ${
            loading ? "opacity-0" : "opacity-100"
          }`}
          onLoadingComplete={() => setLoading(false)}
          onError={() => setLoading(false)}
        />
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="absolute top-0 -right-2 z-20 w-6 h-6 bg-black/70 hover:bg-black text-white rounded-full flex items-center justify-center shadow-md transition-all active:scale-90 cursor-pointer"
        aria-label="사진 삭제"
      >
        <X className="w-3.5 h-3.5 stroke-[2.5]" />
      </button>
    </div>
  );
};
