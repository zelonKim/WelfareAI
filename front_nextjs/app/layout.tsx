import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

import SidebarNav from "@/components/SidebarNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "웰페어AI (WelfareAI) - AI 복지 통합 플랫폼",
  description:
    "언제 어디서든 복지 상담, 위기이웃 제보, 복지지원 정책, 소통 및 봉사 모임을 한번에! 도움이 필요할때 언제든지 와(WA)요.",
  keywords: [
    "웰페어AI",
    "WelfareAI",
    "복지",
    "상담",
    "혜택",
    "AI",
    "위기",
    "이웃",
    "제보",
    "지원",
    "정책",
    "봉사",
    "모임",
    "소통",
  ],
  openGraph: {
    title: "웰페어AI (WelfareAI) - AI 복지 통합 플랫폼",
    description:
      "언제 어디서든 복지 상담, 위기이웃 제보, 복지지원 정책, 소통 및 봉사 모임을 한번에! 도움이 필요할때 언제든지 와(WA)요.",
    siteName: "웰페어AI",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/icon.png",
        width: 800,
        height: 800,
        alt: "웰페어AI 로고",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
          <SidebarNav />
        </Providers>
      </body>
    </html>
  );
}
