# 📱 WelfareAI - React Native(Expo) Mobile App

> `front_expo`은 React Native 및 Expo Router로 구축된 모바일 앱으로서, AI 맞춤 상담, 커뮤니티 및 실시간 채팅 기능, 푸시 알림, iOS 및 Android 위치 기반 제보 기능 등을 제공합니다.

---

## 🛠 기술 스택 (Tech Stack)

- **Framework**: React Native (Expo)
- **Routing**: Expo Router (File-based Routing)
- **Language**: TypeScript
- **State & Data Fetching**: TanStack Query (React Query)
- **Location & Geocoding**: `expo-location`
- **Media & Image Picker**: `expo-image-picker`
- **Push Notification**: `expo-notifications`

---

## 🔑 핵심 기능 (Key Features)

### 🖼 1. Native Image Picker

- **`expo-image-picker` 연동**: 모바일 앨범 접근 권한 관리, 프로필 이미지 변경 및 제보 이미지 첨부

### 📍 2. Native Location Access

- **`expo-location` 연동**: 기기의 GPS 권한을 요청하고, 사용자의 현재 위도 및 경도 좌표와 행정구역 주소를 조회

### 🔔 3. Push Notification Integration

- **`expo-notifications` 연동**: Expo Push Token 발급 및 푸시 알림 수신 권한 설정 핸들러 구현

### 🍏 4. Apple Native Authentication

- **`expo-apple-authentication` 연동**: iOS 환경에서의 네이티브 Apple Sign-In 인증 및 토큰 교환

---

## 📂 디렉터리 구조 (Directory Structure)

```text
front_expo/
├── api/                     # API 클라이언트 및 엔드포인트 요청 함수
├── app/                     # Expo Router 기반 파일 시스템 라우팅
│   ├── (auth)/              # 인증 화면
│   ├── (tabs)/              # 하단 탭 네비게이션
│   │   ├── community.tsx    # 이웃 모임 목록
│   │   ├── crisisReport.tsx # 위기 이웃 제보
│   │   ├── index.tsx        # 홈 메인 화면
│   │   ├── mypage.tsx       # 마이페이지
│   │   └── policy.tsx       # 맞춤 복지 정책 검색
│   ├── agreement/           # 약관 및 동의서 화면
│   ├── communityDetail/     # 커뮤니티 상세
│   ├── crisisReportDetail/  # 위기 제보 상세
│   ├── +html.tsx            # 웹 보조 HTML 템플릿
│   ├── +not-found.tsx       # 404 예외 처리 화면
│   ├── _layout.tsx          # 루트 네비게이션 레이아웃
│   └── modal.tsx            # 공통 모달 스크린
├── assets/                  # 앱 아이콘, 스플래시 이미지 등 정적 자원
├── components/              # React Native 재사용 UI 컴포넌트
├── constants/               # 색상 테마, 상숫값 정의
├── hooks/                   # 커스텀 React Hooks
├── types/                   # TypeScript 타입 정의
├── utils/                   # 위치 조회, 이미지 선택, Apple 로그인, 푸시 알림 핸들러
├── app.json                 # Expo 프로젝트 글로벌 설정
├── eas.json                 # EAS 빌드 및 배포 설정
├── google-services.json     # Android Firebase 설정 파일
└── GoogleService-Info.plist # iOS Firebase 설정 파일
```
