# 📱 WelfareAI - React Native / Expo Mobile App (모바일 앱)

> `front_expo` is a mobile application built with React Native and Expo Router, providing AI-tailored consulting, community meetups, real-time chat, push notifications, and location-based crisis reporting for iOS and Android.
>
> `front_expo`는 React Native 및 Expo Router로 구축된 모바일 앱으로서, AI 맞춤 상담, 커뮤니티 및 실시간 채팅 기능, 푸시 알림, iOS 및 Android 위치 기반 제보 기능 등을 제공합니다.

---

## 🛠 Tech Stack (기술 스택)

- **Framework**: React Native (Expo 55)
- **Routing**: Expo Router (File-based Routing)
- **Language**: TypeScript
- **State & Data Fetching**: TanStack Query (React Query)
- **Location & Geocoding**: `expo-location`
- **Media & Image Picker**: `expo-image-picker`
- **Push Notification**: `expo-notifications`
- **Authentication**: `expo-apple-authentication`

---

## 🔑 Key Features (핵심 기능)

### 🖼 1. Native Image Picker (네이티브 이미지 선택)

- **`expo-image-picker` Integration (미디어 관리)**: Handles mobile photo library access permissions, profile image updates, and attaching photos to crisis reports. (`expo-image-picker` 연동: 모바일 앨범 접근 권한 관리, 프로필 이미지 변경 및 제보 이미지 첨부)

### 📍 2. Native Location Access (네이티브 위치 접근)

- **`expo-location` Integration (위치 조회)**: Requests device GPS permissions and fetches current latitude/longitude coordinates along with administrative address data. (`expo-location` 연동: 기기의 GPS 권한을 요청하고, 사용자의 현재 위도 및 경도 좌표와 행정구역 주소를 조회)

### 🔔 3. Push Notification Integration (푸시 알림 연동)

- **`expo-notifications` Integration (푸시 토큰 핸들러)**: Generates Expo Push Tokens and manages push notification permission settings and handlers. (`expo-notifications` 연동: Expo Push Token 발급 및 푸시 알림 수신 권한 설정 핸들러 구현)

### 🍏 4. Apple Native Authentication (Apple 네이티브 인증)

- **`expo-apple-authentication` Integration (iOS 소셜 로그인)**: Implements native Apple Sign-In authentication and server-side token exchange flow for iOS environments. (`expo-apple-authentication` 연동: iOS 환경에서의 네이티브 Apple Sign-In 인증 및 토큰 교환)

---

## 📂 디렉터리 구조 (Directory Structure)

```text
front_expo/
├── api/                     # API clients & request functions (API 클라이언트 및 요청 함수)
├── app/                     # Expo Router file-based routing (Expo Router 기반 파일 시스템 라우팅)
│   ├── (auth)/              # Authentication screens (인증 화면)
│   ├── (tabs)/              # Bottom tab navigation (하단 탭 네비게이션)
│   │   ├── community.tsx    # Neighborhood meetup list (이웃 모임 목록)
│   │   ├── crisisReport.tsx # Crisis reporting screen (위기 이웃 제보)
│   │   ├── index.tsx        # Main home screen (홈 메인 화면)
│   │   ├── mypage.tsx       # User profile & mypage (마이페이지)
│   │   └── policy.tsx       # Tailored policy search (맞춤 복지 정책 검색)
│   ├── agreement/           # Terms & agreement screens (약관 및 동의서 화면)
│   ├── communityDetail/     # Community meetup details (커뮤니티 상세)
│   ├── crisisReportDetail/  # Crisis report details (위기 제보 상세)
│   ├── +html.tsx            # Web fallback HTML template (웹 보조 HTML 템플릿)
│   ├── +not-found.tsx       # 404 Exception fallback screen (404 예외 처리 화면)
│   ├── _layout.tsx          # Root navigation layout (루트 네비게이션 레이아웃)
│   └── modal.tsx            # Shared modal screen (공통 모달 스크린)
├── assets/                  # App icons, splash images & static assets (앱 아이콘 및 스플래시 정적 자원)
├── components/              # Reusable React Native UI components (재사용 UI 컴포넌트)
├── constants/               # Color themes & system constants (색상 테마 및 상숫값 정의)
├── hooks/                   # Custom React Hooks (커스텀 리액트 훅)
├── types/                   # TypeScript type definitions (타입 정의)
├── utils/                   # Location, image picker, Apple Auth, & notification handlers (위치, 이미지, 푸시 헬퍼)
├── app.json                 # Global Expo configuration (Expo 프로젝트 글로벌 설정)
├── eas.json                 # EAS Build & Submit configuration (EAS 빌드 및 배포 설정)
├── google-services.json     # Android Firebase configuration (Android Firebase 설정 파일)
└── GoogleService-Info.plist # iOS Firebase configuration (iOS Firebase 설정 파일)
```
