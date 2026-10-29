"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { TermsModalProps } from "@/types/auth/TermsModalProps";
import { useTermsModalLanguage } from "@/hooks/languages/useTermsModalLanguage"; 

export default function TermsModal({
  visible,
  type,
  onClose,
}: TermsModalProps) {
  const { t } = useTermsModalLanguage();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (visible) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [visible, onClose]);

  if (!visible || !type) return null;

  ////////////////////////////////////////////////////////////////////////////////////

  const title = t.titles[type];

  const sections =
    type === "terms"
      ? t.termsSections
      : type === "privacy"
        ? t.privacySections
        : t.marketingSections;

  ////////////////////////////////////////////////////////////////////////////////////

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[85vh] bg-white rounded-2xl p-6 shadow-xl border border-gray-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <h2 className="text-lg sm:text-xl font-bold text-[#1A3A3A]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label={t.closeAria} 
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto my-4 pr-1 space-y-4">
          {sections.map((section, index) => (
            <div
              key={index}
              className="bg-[#F8FAFA] p-4 rounded-xl border border-[#1A3A3A]/5"
            >
              <h3 className="text-sm sm:text-base font-bold text-[#1A3A3A] mb-2">
                {section.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {section.body}
              </p>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer w-full p-3 bg-[#1A3A3A] hover:bg-[#142E2E] text-white font-bold text-base rounded-xl transition-colors mt-2"
        >
          {t.confirmButton} 
        </button>
      </div>
    </div>
  );
}