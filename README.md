# 🦊 WelfareAI - Civic Tech AI Integrated Welfare Platform (AI 통합 복지 플랫폼)

> **WelfareAI** is an open-source integrated welfare platform that enhances accessibility to public welfare information using AI technology and public data, while fostering connections among local community members.
>
> **WelfareAI**는 AI 기술과 공공 데이터를 활용하여 복지 정보의 접근성을 높이고, 지역사회 이웃 간의 연결을 돕는 오픈소스 통합 복지 플랫폼입니다.

---

## 📌 Core Features (주요 기능)

WelfareAI provides **four key core services** (WelfareAI는 크게 **4가지 핵심 서비스**를 제공합니다):

### 🤖 1. AI Welfare Counseling (AI 복지 상담)

- **AI-powered welfare consultation (AI 맞춤형 복지 상담)**: Provides tailored AI consultation for welfare programs and policies. (복지 제도 관련 질문 시 맞춤형 AI 복지 상담 제공)
- **Detailed guidance (상세 안내)**: Detailed instructions on eligibility, required documents, and application procedures. (지원 내용, 신청 자격 요건, 제출 서류 및 신청 방법 등 상세 안내)

### 📋 2. Welfare Policy Search (복지 정책 조회)

- **Category-based exploration (카테고리별 탐색)**: Custom navigation for South Korean welfare policies by category. (대한민국 복지 정책에 대한 카테고리별 맞춤 탐색)
- **Search & Filtering (실시간 검색 및 필터링)**: Real-time keyword search and smart filtering options. (실시간 키워드 검색과 맞춤 필터링)

### 👥 3. Community Groups (커뮤니티 모임)

- **Interest-based meetups (관심사 기반 모임)**: Create interest-based social and volunteer groups. (관심사 기반의 소통 및 봉사 모임 개설)
- **Real-time communication (실시간 소통)**: Real-time chat and schedule sharing among group members. (모임 참여자 간 실시간 채팅 및 일정 공유)

### 📢 4. Crisis Reporting (위기 이웃 제보)

- **Real-time reports (실시간 제보)**: Report neighbors in need by uploading posts and photos. (위기에 처한 이웃 발견 시, 글과 사진 업로드를 통한 실시간 제보)
- **Information sharing (정보 공유 및 지원)**: Share information via comments and deliver assistance. (댓글을 통한 정보 공유 및 관련 도움 전달)

---

## 🛠 Tech Stack (기술 스택)

### Frontend (프론트엔드)

- **Web**: Next.js 15 (App Router), React 19, Tailwind CSS
- **Mobile**: Expo 55 (React Native), React Navigation

### Backend (백엔드)

- **Core Server**: NestJS 11, TypeScript
- **AI Server**: FastAPI 0.141, Python 3.11+

### Database (데이터베이스)

- **DB & ORM**: PostgreSQL 18, Prisma 6
- **Cloud DB**: NeonDB

### External APIs (외부 API)

- **AI Engine**: OpenAI API (`gpt-4o-mini`)
- **Open Data**: 대한민국 공공데이터포털 API (South Korean Public Data API)
  - Note: The live website relies on Korean Public Data APIs (data.go.kr), which are geo-restricted to domestic (South Korea) IP addresses.

### Infrastructure & Deployment (인프라 및 배포)

- **Web Hosting**: Vercel
- **Mobile Build**: EAS (Expo Application Services)
- **Backend Server**: AWS Lightsail (Ubuntu, Nginx, PM2)

---

## 🏗 System Architecture (시스템 아키텍처)

```text
        [ Users (Web / Mobile) ]
                    │
       ┌────────────├────────────┐
       ▼                         ▼
 [ Next.js 15 ]             [ Expo 55 ]
    (Vercel)              (iOS / Android)
       │                         │
       └────────────┬────────────┘
                    │
                    ▼
     ┌──────────────────────────────┐
     │        AWS Lightsail         │
     │  ┌────────────────────────┐  │
     │  │ NestJS 11 (Core Server)│  │ ───► [ PostgreSQL 18 / NeonDB ]
     │  └───────────┬────────────┘  │
     │              │               │
     │  ┌───────────▼────────────┐  │
     │  │   FastAPI (AI Server)  │  │ ───► [ OpenAI API ]
     │  └────────────────────────┘  │
     └──────────────────────────────┘
                    │
                    ▼
      [ Public Data API (공공데이터포털) ]
```

---

## 📄 License (라이선스)

This project is licensed under the **AGPL-3.0 (GNU Affero General Public License v3.0)**.
Anyone is free to modify and redistribute it, but derivative works and commercial web/app services based on this project must also open their source code under the same AGPL-3.0 license.

본 프로젝트는 **AGPL-3.0 (GNU Affero General Public License v3.0)** 라이선스를 따릅니다.
누구나 자유롭게 수정 및 재배포할 수 있으나, 본 프로젝트를 기반으로 한 2차적 저작물 및 웹/앱 서비스 역시 동일한 라이선스(AGPL-3.0)로 소스코드를 공개해야 합니다.
