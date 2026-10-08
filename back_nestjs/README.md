# 💻 WelfareAI - NestJS Core Server

> **`back_nestjs`**는 NestJS 11 기반의 메인 백엔드로서, 유저 인증, 복지 정책 조회, 실시간 모임 및 채팅, 위기 이웃 제보, 푸시 알림 등 서비스 전반의 핵심 비즈니스 로직과 데이터베이스 연동을 담당합니다.

---

## 🛠 Tech Stack

- **Framework**: NestJS 11 (TypeScript)
- **Database & ORM**: PostgreSQL 18, Prisma ORM 6, NeonDB
- **Real-Time Communication**: WebSocket / Socket.io Gateway
- **Notification**: Expo Server SDK Push Notification
- **Media Storage**: Cloudflare R2
- **Authentication**: JWT, OAuth2

---

## 🔑 Key Features

### 💬 1. 커뮤니티 & 실시간 채팅 (`src/community`)

- **WebSocket Gateway**: Socket.io 기반 게이트웨이를 구축하여 모임 참여자 간의 실시간 메시지 기능 구현
- 모임 개설, 카테고리별 모임 탐색, 참여 신청 및 멤버 관리 기능

### 🔔 2. 푸시 알림 (`src/notification` & `utils`)

- **Expo Push Notifications**: 모바일 앱 사용자 대상 실시간 푸시 알림 전송
- **`sendGroupChatPushNoti.ts`**: 채팅방 내 신규 메시지 수신 시, 단체 푸시 알림 전송

### 📋 3. 공공 데이터 연동 (`src/policy`)

- 공공데이터 포털 API 연동을 통한 최신 복지 정책 수집 및 DB 동기화
- 카테고리별 맞춤 검색 및 필터링 기능 제공

### ☁️ 4. Cloudflare R2 & OAuth (`utils/`)

- **`r2.provider.ts`**: 이미지 업로드를 위한 S3 호환 객체 스토리지 프로바이더 구현 ()
- **OAuth Verification**: Apple 및 Google Identity Token 서버 측 검증 유틸리티 구현

---

## 📂 Folder Structure

```text
back_nestjs/
├── constants/             # 정책 코드 등 도메인 공통 상수 관리
│   └── PolicyCode.ts
├── prisma/                # Prisma ORM 스키마 및 마이그레이션 관리
│   ├── migrations/
│   ├── prisma.module.ts
│   ├── prisma.service.ts
│   └── schema.prisma
├── src/
│   ├── auth/              # 회원가입, 소셜 로그인 및 토큰 발급
│   ├── block/             # 사용자 차단 기능
│   ├── community/         # 이웃 모임 생성/참여 & WebSocket 게이트웨이
│   ├── consulting/        # AI 복지 상담 연동 API
│   ├── crisis-report/     # 위기 이웃 제보 및 도움 댓글
│   ├── notification/      # Expo 푸시 알림 발송 모듈
│   ├── policy/            # 공공데이터 API 연동 및 복지 정책 조회/검색
│   ├── report/            # 게시글 및 유저 신고 기능
│   └── user/              # 사용자 프로필 및 개인 정보 관리
└── utils/                 # 공통 유틸리티 헬퍼 함수
    ├── r2.provider.ts            # Cloudflare R2 이미지 업로드
    ├── sendGroupChatPushNoti.ts  # 단체 푸시 알림 전송 헬퍼
    ├── verifyAppleToken.ts       # Apple 소셜 로그인 토큰 검증
    └── verifyGoogleToken.ts      # Google 소셜 로그인 토큰 검증
```
