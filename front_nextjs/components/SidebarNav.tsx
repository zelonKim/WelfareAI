"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Settings,
  Bell,
  BotMessageSquare,
  FileText,
  Users,
  Menu,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { name: "상담", href: "/", icon: BotMessageSquare },
  { name: "제보", href: "/crisisReport", icon: Bell },
  { name: "정책", href: "/policy", icon: FileText },
  { name: "모임", href: "/community", icon: Users },
  { name: "설정", href: "/mypage", icon: Settings },
];

const ALLOWED_PATHS = [
  "/",
  "/crisisReport",
  "/policy",
  "/community",
  "/mypage",
];

////////////////////////////////////////////////////////////////////////////////////

export default function SidebarNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentPath =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;

  if (!ALLOWED_PATHS.includes(currentPath)) {
    return null;
  }

  ////////////////////////////////////////////////////////////////////////////////////

  return (
    <nav className="fixed right-6 lg:right-12 bottom-28 lg:bottom-45 z-50 flex flex-col items-center">
      <div
        className={`${
          isOpen
            ? "flex animate-in fade-in slide-in-from-bottom-3 duration-200"
            : "hidden"
        } lg:flex flex-col items-center gap-3 rounded-3xl border border-slate-200/80 bg-white/90 p-3 shadow-xl shadow-[#1A3A3A]/10 backdrop-blur-xl mb-3 lg:mb-0`}
      >
      {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? currentPath === "/"
              : currentPath.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`group relative flex w-16 flex-col items-center justify-center rounded-2xl py-2.5 transition-all duration-200 active:scale-95 ${
                isActive
                  ? "bg-[#1A3A3A] text-white shadow-[#1A3A3A]/90"
                  : "text-[#1A3A3A]/90 hover:bg-[#1A3A3A]/10 hover:text-[#1A3A3A]/80"
              }`}
            >
              <Icon
                className={`h-6 w-6 transition-transform group-hover:scale-110 ${
                  isActive
                    ? "text-white"
                    : "text-[#1A3A3A]/80 group-hover:text-[#1A3A3A]"
                }`}
              />

              <span
                className={`mt-1 text-[13px] font-bold tracking-tight ${
                  isActive
                    ? "text-white"
                    : "text-[#1A3A3A]/780 group-hover:text-[#1A3A3A]"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="메뉴 열기/닫기"
        className="hover:opacity-90 cursor-pointer flex lg:hidden h-14 w-14 items-center justify-center rounded-full bg-[#1A3A3A] text-white shadow-sm shadow-[#1E2E2A]/30 transition-transform active:scale-90"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>
    </nav>
  );
}
