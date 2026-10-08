# 🦊 WelfareAI - Civic Tech AI 통합 복지 플랫폼

> **WelfareAI**는 AI 기술과 공공 데이터를 활용하여 복지 정보의 접근성을 높이고, 지역사회 이웃 간의 연결을 돕는 오픈소스 통합 복지 플랫폼입니다.

---

## 📌 주요 기능 (Core Features)

WelfareAI는 크게 **4가지 핵심 서비스**를 제공합니다.

### 🤖 1. AI 복지 상담 (Consulting)

- 복지 제도 관련 질문 시 맞춤형 AI 복지 상담 제공
- 지원 내용, 신청 자격 요건, 제출 서류 및 신청 방법 등 상세 안내

### 📋 2. 복지 정책 조회 (Policy)

- 대한민국 복지 정책에 대한 카테고리별 맞춤 탐색
- 실시간 키워드 검색과 맞춤 필터링

### 👥 3. 커뮤니티 모임 (Community)

- 관심사 기반의 소통 및 봉사 모임 개설
- 모임 참여자 간 실시간 채팅 및 일정 공유

### 📢 4. 위기 이웃 제보 (Crisis Report)

- 위기에 처한 이웃 발견 시, 글과 사진 업로드를 통한 실시간 제보
- 댓글을 통한 정보 공유 및 관련 도움 전달

---

## 🛠 기술 스택 (Tech Stack)

### Frontend

- **Web**: Next.js 15 (App Router), React 19, Tailwind CSS
- **Mobile**: Expo 55 (React Native), React Navigation

### Backend

- **Core Server**: NestJS 11, TypeScript,
- **AI Server**: FastAPI 0.141, Python 3.11+

### Database

- **DB & ORM**: PostgreSQL 18, Prisma 6
- **Cloud DB**: NeonDB

### External APIs

- **AI Engine**: OpenAI API (gpt-4o-mini)
- **Open Data**: 공공데이터포털 API

### Infrastructure & Deployment

- **Web Hosting**: Vercel
- **Mobile Build**: EAS
- **Backend Server**: AWS Lightsail (Ubuntu, Nginx, PM2)

---

## 🏗 시스템 아키텍처 (System Architecture)

```text
        [ Users (Web / Mobile) ]
                    │
       ┌────────────├────────────┐
       ▼                         ▼
 [ Next.js 15 ]             [ Expo 55 ]
    (Vercel )             (iOS / Android)
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
            [ 공공데이터포털 API ]
```

## 📄 라이선스 (License)

본 프로젝트는 **AGPL-3.0 (GNU Affero General Public License v3.0)** 라이선스를 따릅니다.
누구나 자유롭게 수정 및 재배포할 수 있으나, 본 프로젝트를 기반으로 한 2차적 저작물 및 웹/앱 서비스 역시 동일한 라이선스(AGPL-3.0)로 소스코드를 공개해야 합니다.
