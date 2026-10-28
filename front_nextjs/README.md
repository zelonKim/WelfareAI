# 🌐 WelfareAI - Next.js Web Frontend (Next.js 웹 프론트엔드)

> `front_nextjs` is a Next.js App Router-based web application providing UI/UX and client interactions across the platform, including AI welfare consulting, policy search, community meetups, real-time chat, and crisis reporting.
>
> `front_nextjs`는 Next.js App Router 기반의 웹 서비스로서, AI 맞춤 상담, 복지 정책 검색, 커뮤니티 모임 및 실시간 채팅, 위기 이웃 제보 등 서비스 전반의 UI/UX 및 클라이언트 인터랙션을 제공합니다.

---

## 🛠 Tech Stack (기술 스택)

- **Framework**: Next.js (App Router, React)
- **Language**: TypeScript
- **State Management & Data Fetching**: TanStack Query (React Query)
- **Real-Time Communication**: Socket.io Client (WebSocket)
- **Geolocation & Mapping**: OpenStreetMap Nominatim API
- **Media Storage**: Cloudflare R2
- **Styling**: Tailwind CSS

---

## 🔑 Key Features (핵심 기능)

### 💬 1. Real-Time Chatting (실시간 채팅)

- **WebSocket integration (웹소켓 연동)**: Connected via Socket.io to enable real-time messaging and chat history synchronization among community members. (Socket.io 커넥션을 통해 커뮤니티 참여자 간 실시간 메시지 송수신 및 채팅 내역 동기화 구현)

### 🔄 2. Polling Optimization (폴링 최적화)

- **Automatic data refetching (데이터 자동 갱신)**: Leveraged React Query's `refetchInterval` option to refresh community details and member status every 10 seconds for optimal UI freshness. (상대적으로 실시간성이 덜 중요한 모임 상세 및 멤버 현황 등은 React Query의 `refetchInterval` 옵션을 활용하여 10초마다 최신 데이터로 갱신)

### 📍 3. Reverse Geocoding (위치 변환)

- **OpenStreetMap Nominatim (주소 정보 변환)**: Integrates OpenStreetMap Nominatim API to convert users' latitude and longitude coordinates into administrative districts and address data. (사용자의 현재 위도 및 경도 좌표를 역지오코딩하여 행정구역과 주소 정보로 변환)

### ☁️ 4. Cloudflare R2 Upload (스토리지 업로드)

- **Direct image upload (이미지 직접 업로드)**: Uploads user profile and community images directly to Cloudflare R2 object storage from the client and retrieves image URLs. (클라이언트에서 Cloudflare R2 객체 스토리지로 프로필 및 커뮤니티 첨부 이미지를 업로드 후 링크 반환)

---

## 📂 Directory Structure (디렉터리 구조)

```text
front_nextjs/
├── api/                   # API clients & request functions (API 클라이언트 및 요청 함수)
├── app/                   # Next.js App Router pages & layouts (페이지 및 레이아웃)
│   ├── (auth)/            # Authentication pages: login & signup (인증 관련 페이지)
│   │   ├── login/
│   │   └── signup/
│   ├── (tabs)/            # Main tab layout & core service pages (메인 탭 및 주요 서비스 페이지)
│   │   ├── agreement/     # Terms & agreement pages (동의서 및 약관)
│   │   ├── community/     # Community meetups & real-time chat (이웃 모임 및 실시간 채팅)
│   │   ├── crisisReport/  # Crisis reporting & detail view (위기 이웃 제보 및 상세 조회)
│   │   ├── mypage/        # User mypage & profile management (마이페이지 및 프로필 관리)
│   │   ├── policy/        # Customized policy search & exploration (맞춤 복지 정책 조회 및 검색)
│   │   └── together/      # Group participation & meetup recommendations (동반 참여 및 모임 추천)
│   ├── apple-callback/    # Apple OAuth callback handler (Apple 소셜 로그인 콜백)
│   ├── privacy/           # Privacy policy page (개인정보처리방침)
│   ├── terms/             # Terms of service page (이용약관)
│   ├── layout.tsx         # Root layout component (루트 레이아웃)
│   └── providers.tsx      # Global React Query & context providers (전역 Provider 설정)
├── certificates/          # SSL and certificate assets (인증서 관련 파일)
├── components/            # Reusable common UI components (공통 UI 컴포넌트)
├── constants/             # Domain constants like routes & categories (상수 정의)
├── hooks/                 # Custom React hooks (커스텀 리액트 훅)
├── public/                # Static assets: logos & images (로고 및 이미지 자원)
├── types/                 # TypeScript type definitions (타입 정의 파일)
└── utils/                 # Utilities for OpenStreetMap & Cloudflare R2 (위치 변환 및 R2 업로드 유틸)
```
