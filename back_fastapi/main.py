import os
from fastapi import FastAPI, HTTPException
from schemas import ConsultRequest, ConsultResponse
from openai import AsyncOpenAI
from dotenv import load_dotenv
from openai.types.chat import ChatCompletionToolParam
from tools import search_welfare_policy
import json
from typing import Any

load_dotenv()

app = FastAPI()

client = AsyncOpenAI(api_key=os.environ["OPENAI_API_KEY"])

@app.get("/")
def read_root():
    return {"message": "AI server is running"}


@app.post("/consult", response_model=ConsultResponse)
async def consult(payload: ConsultRequest):

    system_prompt = """
    당신은 대한민국 국민을 위한 전문 복지 정책 AI 상담사 'WelfareAI'입니다.
    사용자의 질문과 고민을 분석하여 가장 적절한 복지 혜택과 신청 방법을 안내해야 합니다.
    사용자의 질문에  지원금, 수당, 복지혜택 등에 대한 내용이 포함되어 있다면, 추측하여 임의로 계산하지 말고 **반드시 search_welfare_policy 도구를 호출하여 정확한 법적/행정적 지원 기준 데이터를 기반으로 답변**해야 합니다.

    답변할 때 다음 지침을 반드시 준수하세요:
    1. 친절하고 공감하는 어조를 유지하세요.
    2. 답변 구조:
        - 사용자의 상황에 대한 간략한 공감
        - [추천 복지 정책]: 관련 복지 제도의 명칭과 주요 지원 내용
        - [자격 요건 및 신청 방법]: 신청 대상 조건 및 신청처 (예: 복지로, 주민센터 등)
        - [추가 필요 정보 안내]: 더 정확한 안내를 위해 필요한 정보(소득 수준, 가구 구성, 연령 등) 질문
        - [신청 홈페이지 링크]: 바로 접속하여 신청하거나 상세 정보를 볼 수 있는 URL 링크
    3. 불확실한 정보나 법적/행정적 확답은 피하세요.
    4. 가독성을 위해 Markdown 형식(불릿 포인트, 강조)을 적극 활용하세요.
    
    [핵심 답변 지침]
    1. 사용자가 청년월세, 수당, 지원금, 복지 정책에 대해 물어보면 '반드시' search_welfare_policy 도구를 실행하여 정확한 상세 정보를 조회한 후 답변하세요.
    2. 금액 안내 시 절대 임의의 비율(예: 30%, 50% 등)이나 잘못된 수학적 계산 과정을 지어내지 마세요.
       - 청년월세 특별지원은 '실제 납부하는 임차료(월세) 범위 내에서 월 최대 20만원'까지 지급되는 구조입니다. (관리비 제외)
       - 예시: 월세가 35만원이면 한도인 '월 20만원' 지원, 월세가 15만원이면 실제 월세인 '15만원' 전액 지원.
    3. 고정된 양식([추천 복지 정책], [자격 요건] 등)을 매번 고정 목차로 반복하지 말고, 사용자의 질문에 맞춰 자연스럽고 명확하게 필요한 핵심 정보만 답변하세요.
    4. 매 답변 끝에 "복지로나 129에 문의하세요"라는 정형화된 안내 문구를 기계적으로 반복하지 마세요.
    5. 소득 기준 판정이나 정확한 수급 가능 여부 문의처럼 '사용자의 개별 자산/소득 조회가 필수적인 경우'에만, 필요한 서류나 복지로/주민센터 방문 확인이 필요하다는 점을 대화 맥락에 맞게 자연스럽게 언급하세요.
    """

    tools: list[ChatCompletionToolParam] = [
        {
            "type": "function",
            "function": {
                "name": "search_welfare_policy",
                "description": "사용자가 지원금, 수당, 급여 등 특정 복지 정책의 금액이나 조건에 대해 문의할 때 복지로 API에서 실제 지원 상세 정보를 조회하기 위해 '반드시' 실행해야 하는 도구입니다.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "keyword": {
                            "type": "string",
                            "description": "검색할 정책 핵심 키워드 (예: 청년월세, 육아휴직, 부모급여 등)",
                        }
                    },
                    "required": ["keyword"],
                },
            },
        }
    ]

    try:
        formatted_messages: list[Any] = [{"role": "system", "content": system_prompt}]

        # 이전 대화 기록(history)을 messages에 추가
        if payload.history:
            for msg in payload.history:
                if msg.role in ["user", "assistant"] and msg.content:
                    formatted_messages.append(
                        {"role": msg.role, "content": msg.content}
                    )

        # 현재 사용자의 질문 추가
        formatted_messages.append({"role": "user", "content": payload.question})

        # OpenAI API 호출
        completion = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=formatted_messages,
            tools=tools,
            tool_choice="auto",
            temperature=0.3,
            max_tokens=1000,
        )

        response_message = completion.choices[0].message

        if response_message.tool_calls:
            formatted_messages.append(response_message.model_dump())

            for tool_call in response_message.tool_calls:
                tool_call_id = tool_call.id
                func = getattr(tool_call, "function", None)
                keyword = ""

                if func and hasattr(func, "arguments"):
                    try:
                        args = json.loads(func.arguments)
                        keyword = args.get("keyword", "")
                    except Exception:
                        keyword = ""

                print(f"====================================")
                print(f" [Tool Call 실행] 키워드: {keyword} (ID: {tool_call_id})")
                print(f"====================================")

            # tools.py의 search_welfare_policy 실행
            try:
                search_result = await search_welfare_policy(keyword)
            except Exception as e:
                print(f" [Tool Call 에러 발생] {keyword}: {e}")
                search_result = (
                    f" 해당 정책({keyword}) 정보를 조회하는 중 오류가 발생했습니다."
                )

            # 이전 AI 응답 및 결과를 메시지에 추가
            formatted_messages.append(
                {
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": search_result,
                }
            )

            # 검색 결과를 바탕으로 최종 답변 작성
            second_completion = await client.chat.completions.create(
                model="gpt-4o-mini",
                messages=formatted_messages,
                temperature=0.3,
                max_tokens=1000,
            )
            ai_answer = second_completion.choices[0].message.content
        else:
            print("도구 검색 없이 바로 나온 답변입니다.")
            ai_answer = response_message.content

        return {"answer": ai_answer}

    except Exception as e: # noqa: BLE001
        print(f"OpenAI API Error: {e}")
        raise HTTPException(
            status_code=500, detail="AI 응답 처리 중 오류가 발생했습니다."
        )
