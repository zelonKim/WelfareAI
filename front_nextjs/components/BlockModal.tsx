"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { X, User, Loader2 } from "lucide-react";
import { getBlockedUsers } from "@/api/block/getBlockedUsers";
import { useBlockUser } from "@/hooks/block/useBlockUser";
import { useUnblockUser } from "@/hooks/block/useUnblockUser";
import { BlockedItem } from "@/types/block/BlockedItem";
import { BlockModalProps } from "@/types/block/BlockModalProps";
import { useBlockModalLanguage } from "@/hooks/languages/useBlockModalLanguage";

export const BlockModal: React.FC<BlockModalProps> = ({ visible, onClose }) => {
  const { t } = useBlockModalLanguage();

  const [usernameInput, setUsernameInput] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && visible) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [visible, onClose]);

  const { data: blockedList = [], isLoading } = useQuery<BlockedItem[]>({
    queryKey: ["blockedUsers"],
    queryFn: getBlockedUsers,
    enabled: !!visible,
  });

  const { mutate: blockUserMutation, isPending: blockUserPending } =
    useBlockUser();

  const handleBlockSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmedUsername = usernameInput.trim();
    if (!trimmedUsername) {
      alert(t.alertNoUsername);
      return;
    }
    blockUserMutation(trimmedUsername, {
      onSuccess: () => {
        setUsernameInput("");
        alert(t.blockSuccess(trimmedUsername));
      },
    });
  };

  const { mutate: unblockUserMutation, isPending: unblockUserPending } =
    useUnblockUser();

  const handleUnblock = (blockedId: string, username: string) => {
    if (confirm(t.unblockConfirm(username))) {
      unblockUserMutation(blockedId);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-lg transform rounded-2xl bg-white p-6 shadow-xl transition-all">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>🚫</span> {t.modalTitle}
          </h2>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-2xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            aria-label={t.closeAria}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6">
          <label
            htmlFor="username-input"
            className="block text-base font-semibold text-slate-700 mb-2"
          >
            {t.blockSectionTitle}
          </label>
          <form onSubmit={handleBlockSubmit} className="flex gap-2">
            <input
              id="username-input"
              type="text"
              placeholder={t.inputPlaceholder}
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-800 placeholder-slate-400 focus:border-red-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500"
            />
            <button
              type="submit"
              disabled={blockUserPending}
              className="cursor-pointer flex items-center justify-center rounded-xl bg-red-500 px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-50 min-w-[90px]"
            >
              {blockUserPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                t.blockButton
              )}
            </button>
          </form>
        </div>

        <div>
          <h3 className="text-base font-semibold text-slate-700 mb-3">
            {t.blockedListTitle} ({blockedList.length})
          </h3>

          <div className="max-h-64 overflow-y-auto pr-1">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-7 w-7 animate-spin text-slate-400" />
              </div>
            ) : blockedList.length === 0 ? (
              <div className="rounded-xl bg-slate-50 py-8 text-center text-sm font-medium text-slate-400">
                {t.emptyList}
              </div>
            ) : (
              <ul className="space-y-2">
                {blockedList.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between rounded-xl bg-slate-50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-full bg-slate-200 flex-shrink-0">
                        {item.blockedUser.profileImage ? (
                          <Image
                            src={item.blockedUser.profileImage}
                            alt={item.blockedUser.nickname}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-green-50 text-[#1A3A3A]">
                            <User className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      <span className="text-base font-medium text-slate-800">
                        {item.blockedUser.nickname}
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        handleUnblock(item.blockedId, item.blockedUser.nickname)
                      }
                      disabled={unblockUserPending}
                      className="cursor-pointer rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-300 disabled:opacity-50"
                    >
                      {t.unblockButton}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
