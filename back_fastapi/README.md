# 🤖 WelfareAI - FastAPI AI Server (FastAPI AI 서버)

> `back_fastapi` is a FastAPI-based backend server dedicated to LLM integration. By applying OpenAI's `gpt-4o-mini` model and Function Calling (Tool Call) mechanisms, it provides AI welfare consulting with real-time public data fetching and context-aware conversation history.
>
> `back_fastapi`는 FastAPI 기반의 LLM 전용 백엔드 서버로서, OpenAI의 `gpt-4o-mini` 모델과 Function Calling (Tool Call) 메커니즘을 적용하여, 실제 공공데이터 기반 답변 및 대화 맥락 유지 기능이 포함된 AI 상담을 제공합니다.

---

## 🛠 Tech Stack (기술 스택)

- **Framework**: FastAPI 0.141 (Python 3.13+)
- **LLM Client**: `AsyncOpenAI` (OpenAI Python SDK)
- **Model**: `gpt-4o-mini`
- **Asynchronous HTTP Client**: `httpx`
- **Data Validation**: Pydantic
- **XML Parsing**: `xmltodict`

---

## 🔑 Key Features (핵심 기능)

### 💬 1. Context-Aware Chat Completion (맥락 유지 대화 생성)

- **Conversation history mapping (대화 맥락 매핑)**: Sequential binding of previous conversation history (`payload.history`) to `messages` to ensure conversational continuity. (이전 대화 기록(`payload.history`)을 `messages`에 순차적으로 바인딩함으로써 대화의 연속성 보장)
- **Asynchronous processing (비동기 처리)**: Minimizes I/O bottlenecks and achieves high-performance asynchronous response handling using the `AsyncOpenAI` client. (`AsyncOpenAI` 클라이언트를 사용하여 입출력 IO 병목 현상을 최소화하고 고성능 비동기 응답 처리)

### 🔧 2. Function Calling / Tool Call (함수 호출 메커니즘)

- **`search_welfare_policy` Tool Definition (도구 정의)**: Automatically extracts search parameters (`keyword`) via LLM Tool Calls when users inquire about specific subsidies, allowances, or eligibility requirements. (사용자가 지원금, 수당, 자격요건 등 특정 복지 정책을 문의할 때 LLM이 자동으로 파라미터(`keyword`)를 추출하여 도구 호출)
- **2-Step Synthesis Pipeline (2단계 응답 합성)**:
  1. Detects `tool_calls` during the initial API completion request. (1차 API 호출 시 `tool_calls` 여부 판별)
  2. Executes `tools.py` to fetch real-time public welfare data if a tool call is required. (도구 호출 필요 시 `tools.py` 실행 ➔ 실시간 공공데이터 검색)
  3. Synthesizes fetched data in a secondary API call to generate tailored final responses. (검색된 최신 정보를 기반으로 2차 API 호출 및 최종 맞춤형 답변 생성)

### 🏛 3. Public Data Portal Integration (공공 데이터 포털 API 연동)

- **Asynchronous requests (비동기 HTTP 요청)**: Sends async HTTP requests to the South Korean Public Data Portal welfare API using `httpx.AsyncClient`. (`httpx.AsyncClient` 기반으로 공공데이터 포털 복지서비스 조회 API에 비동기 HTTP 요청 전송)

- **XML Parsing (XML 데이터 파싱)**: Parses XML-formatted public data responses into JSON/Dict objects via `xmltodict` for real-time welfare policy extraction. (XML 형식의 공공데이터 응답을 `xmltodict`를 이용함으로써 JSON/Dict 객체로 파싱 후 실시간 상세 정책 정보 추출)

---

## 📂 Directory Structure (디렉터리 구조)

```text
back_fastapi/
├── main.py              # FastAPI endpoints & AsyncOpenAI chat completion logic (서버 엔드포인트 및 대화 생성 로직)
├── tools.py             # External API tools used in OpenAI Function Calling (외부 API 연동 도구)
├── schemas.py           # Pydantic Request/Response validation schemas (데이터 모델 검증)
├── requirements.txt     # Python package dependencies (파이썬 의존성 패키지 리스트)
├── Procfile             # Deployment configuration file (서버 실행 배포 설정 파일)
└── README.md
```
