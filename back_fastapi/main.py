import os
from fastapi import FastAPI, HTTPException
from schemas import ConsultRequest, ConsultResponse
from openai import OpenAI
from dotenv import load_dotenv
import uvicorn

load_dotenv()

app = FastAPI()

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])


@app.get("/")
def read_root():
    return {"message": "AI server is running"}


@app.post("/consult", response_model=ConsultResponse)
async def consult(payload: ConsultRequest):

    # 시스템 프롬프트 정의
    system_prompt = """
    당신은 대한민국 국민을 위한 전문 복지 정책 AI 상담사 'WelfareAI'입니다.
    사용자의 질문과 고민을 분석하여 가장 적절한 복지 혜택과 신청 방법을 안내해야 합니다.

    답변할 때 다음 지침을 반드시 준수하세요:
    1. 친절하고 공감하는 어조를 유지하세요.
    2. 답변 구조:
        - [공감 및 요약]: 사용자의 상황에 대한 간략한 공감
        - [추천 복지 정책]: 관련 복지 제도의 명칭과 주요 지원 내용
        - [자격 요건 및 신청 방법]: 신청 대상 조건 및 신청처 (예: 복지로, 주민센터 등)
        - [추가 필요 정보 안내]: 더 정확한 안내를 위해 필요한 정보(소득 수준, 가구 구성, 연령 등) 질문
    3. 불확실한 정보나 법적/행정적 확답은 피하고, 최종 확인은 '복지로(bokjiro.go.kr)' 혹은 '129 보건복지상담센터'를 이용하도록 안내하세요.
    4. 가독성을 위해 Markdown 형식(불릿 포인트, 강조)을 적극 활용하세요.
    """

    user_prompt = payload.question

    try:
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.5,  # 정확도와 일관성을 위해 낮게 설정
            max_tokens=1000,
        )

        ai_answer = completion.choices[0].message.content
        return {"answer": ai_answer}

    except Exception as e:
        print(f"OpenAI API Error: {e}")
        raise HTTPException(status_code=500, detail="AI 상담 중 오류가 발생했습니다.")
