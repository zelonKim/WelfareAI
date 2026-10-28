# 💻 WelfareAI - NestJS Main Server (NestJS 메인 서버)

> `back_nestjs` is the core backend built on NestJS 11, handling user authentication, welfare policy search, real-time community meetups and chat, crisis reporting, push notifications, and primary database operations across the platform.
>
> `back_nestjs`는 NestJS 11 기반의 메인 백엔드로서, 유저 인증, 복지 정책 조회, 실시간 모임 및 채팅, 위기 이웃 제보, 푸시 알림 등 서비스 전반의 핵심 비즈니스 로직과 데이터베이스 연동을 담당합니다.

---

## 🛠 Tech Stack (기술 스택)

- **Framework**: NestJS 11 (TypeScript)
- **Database & ORM**: PostgreSQL 18, Prisma ORM 6, NeonDB
- **Real-Time Communication**: WebSocket / Socket.io Gateway
- **Notification**: Expo Server SDK Push Notification
- **Media Storage**: Cloudflare R2
- **Authentication**: JWT, OAuth2 (Apple, Google)

---

## 🔑 Key Features (핵심 기능)

### 💬 1. Community & Real-Time Chat (커뮤니티 & 실시간 채팅)

- **WebSocket Gateway (실시간 메시징)**: Built a Socket.io-based WebSocket gateway to enable real-time messaging among community members. (Socket.io 기반 게이트웨이를 구축하여 모임 참여자 간의 실시간 메시지 기능 구현)
- **Meetup management (모임 관리)**: Features for creating meetups, exploring categories, applying to join, and managing members. (모임 개설, 카테고리별 모임 탐색, 참여 신청 및 멤버 관리 기능)

### 🔔 2. Push Notifications (푸시 알림)

- **Expo Push Notifications (푸시 알림 전송)**: Delivers real-time push notifications to mobile application users. (모바일 앱 사용자 대상 실시간 푸시 알림 전송)
- **Group chat alerts (단체 채팅 알림)**: Triggers group push notifications when new chat messages arrive in a group room. (채팅방 내 신규 메시지 수신 시, 단체 푸시 알림 전송)

### 📋 3. Public Data Integration (공공 데이터 연동)

- **Data synchronization (데이터 동기화)**: Collects and synchronizes current welfare policies from South Korean Public Data Portal APIs into the database. (공공데이터 포털 API 연동을 통한 최신 복지 정책 수집 및 DB 동기화)

- **Smart search & filtering (맞춤 검색 및 필터링)**: Provides category-based policy exploration and keyword filtering. (카테고리별 맞춤 검색 및 필터링 기능 제공)

### ☁️ 4. Cloudflare R2 & OAuth (스토리지 및 소셜 인증)

- **R2 Provider**: Implements S3-compatible object storage provider for media and image uploads. (이미지 업로드를 위한 S3 호환 객체 스토리지 프로바이더 구현)
- **OAuth Verification (소셜 로그인 검증)**: Server-side Identity Token verification utilities for Apple and Google authentication. (Apple 및 Google Identity Token 서버 측 검증 유틸리티 구현)

---

## 📂 Directory Structure (디렉터리 구조)

```text
back_nestjs/
├── constants/                    # Domain constants like policy codes (정책 코드 등 도메인 공통 상수)
│   └── PolicyCode.ts
├── prisma/                       # Prisma ORM schema and migrations (Prisma ORM 스키마 및 마이그레이션)
│   ├── migrations/
│   ├── prisma.module.ts
│   ├── prisma.service.ts
│   └── schema.prisma
├── src/
│   ├── auth/                     # Authentication, social logins & JWT generation (회원가입, 소셜 로그인 및 토큰 발급)
│   ├── block/                    # User blocking functionality (사용자 차단 기능)
│   ├── community/                # Community meetups & WebSocket gateway (이웃 모임 및 WebSocket 게이트웨이)
│   ├── consulting/               # AI welfare consulting proxy API (AI 복지 상담 연동 API)
│   ├── crisis-report/            # Crisis reporting & support comments (위기 이웃 제보 및 도움 댓글)
│   ├── notification/             # Expo push notification module (Expo 푸시 알림 발송 모듈)
│   ├── policy/                   # Public data integration & policy search (공공데이터 API 연동 및 복지 정책 조회/검색)
│   ├── report/                   # Post and user reporting functionality (게시글 및 유저 신고 기능)
│   └── user/                     # User profile & account management (사용자 프로필 및 개인 정보 관리)
└── utils/                        # Shared utility helper functions (공통 유틸리티 헬퍼 함수)
    ├── r2.provider.ts            # Cloudflare R2 image upload helper (Cloudflare R2 이미지 업로드)
    ├── sendGroupChatPushNoti.ts  # Group chat push notification helper (단체 푸시 알림 전송 헬퍼)
    ├── verifyAppleToken.ts       # Apple OAuth token verification (Apple 소셜 로그인 토큰 검증)
    └── verifyGoogleToken.ts      # Google OAuth token verification (Google 소셜 로그인 토큰 검증)
```
