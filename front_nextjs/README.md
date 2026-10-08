# 🌐 WelfareAI - Next.js Web Frontend

> `front_nextjs`는 Next.js App Router 기반의 웹 서비스로서, AI 맞춤 상담, 복지 정책 검색, 커뮤니티 모임 및 실시간 채팅, 위기 이웃 제보 등 서비스 전반의 UI/UX 및 클라이언트 인터랙션을 제공합니다.

---

## 🛠 기술 스택 (Tech Stack)
- **Framework**: Next.js (App Router, React)
- **Language**: TypeScript
- **State Management & Data Fetching**: TanStack Query (React Query)
- **Real-Time Communication**: Socket.io Client (WebSocket)
- **Geolocation & Mapping**: OpenStreetMap Nominatim API
- **Media Storage**: Cloudflare R2
- **Styling**: Tailwind CSS

---

## 🔑 핵심 기능 (Key Features)
### 💬 1. Real-time Chatting
- **WebSocket Gateway 연동**: Socket.io 커넥션을 통해 커뮤니티 참여자 간 실시간 메시지 송수신 및 채팅 내역 동기화 구현

### 🔄 2. Polling Optimization
- **자동 데이터 갱신**: 상대적으로 실시간성이 덜 중요한 모임 상세 및 멤버 현황 등은 React Query의 `refetchInterval` 옵션을 활용하여 10초마다 최신 데이터로 갱신

### 📍 3. Reverse Geocoding
- **Nominatim OpenStreetMap 연동**: 사용자의 현재 위도 및 경도 좌표를 역지오코딩하여 행정구역과 주소 정보로 변환

### ☁️ 4. Cloudflare R2 Upload
- **Direct Image Upload**: 클라이언트에서 Cloudflare R2 객체 스토리지로 프로필 및 커뮤니티 첨부 이미지를 업로드 후 링크 반환

---

## 📂 디렉터리 구조 (Directory Structure)

```text
front_nextjs/
├── api/                   # API 클라이언트 및 엔드포인트 요청 함수
├── app/                   # Next.js App Router 페이지 및 레이아웃
│   ├── (auth)/            # 인증 관련 페이지 (로그인, 회원가입)
│   │   ├── login/
│   │   └── signup/
│   ├── (tabs)/            # 메인 탭 레이아웃 및 주요 서비스 페이지
│   │   ├── agreement/     # 동의서 및 약관
│   │   ├── community/     # 이웃 모임 및 실시간 채팅 
│   │   ├── crisisReport/  # 위기 이웃 제보 및 상세 조회 
│   │   ├── mypage/        # 마이페이지 및 프로필 관리
│   │   ├── policy/        # 맞춤 복지 정책 조회 및 검색
│   │   └── together/      # 동반 참여 및 모임 추천
│   ├── apple-callback/    # Apple 소셜 로그인 콜백
│   ├── privacy/           # 개인정보처리방침
│   ├── terms/             # 이용약관
│   ├── layout.tsx         # 루트 레이아웃
│   └── providers.tsx      # 전역 React Query 및 Provider 설정
├── certificates/          # SSL 및 인증서 관련 파일
├── components/            # 재사용 가능한 UI 공통 컴포넌트
├── constants/             # 라우팅 경로, 카테고리 등 상수 정의
├── hooks/                 # Custom React Hooks
├── public/                # 로고 및 이미지 자원
├── types/                 # TypeScript 타입 정의 파일
└──utils/                  # OpenStreetMap 위치 변환 및 Cloudflare R2 업로드 함수
```
