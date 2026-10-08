import os
import requests
import xmltodict
import httpx

async def search_welfare_policy(keyword: str) -> str:
    service_key = os.getenv("PUBLIC_WELFARE_API_KEY")

    list_url = "https://apis.data.go.kr/B554287/NationalWelfareInformationsV001/NationalWelfarelistV001"
    detail_url = "https://apis.data.go.kr/B554287/NationalWelfareInformationsV001/NationalWelfaredetailedV001"

    list_params = {
        "serviceKey": service_key,
        "callTp": "L",  # 목록 조회
        "pageNo": "1",
        "numOfRows": "1",  # 가장 연관성 높은 1건만 조회
        "srchKeyCode": "003",  # 검색분류: 001(제목), 002(내용), 003(제목+내용)
        "searchWrd": keyword,  # 검색어
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            list_res = await client.get(list_url, params=list_params)
            if list_res.status_code != 200:
                return f"목록 API 호출 실패 (상태 코드: {list_res.status_code})"

            list_data = xmltodict.parse(list_res.text)
            wanted_list = list_data.get("wantedList", {})

            result_code = wanted_list.get("resultCode")
            if result_code != "0":
                msg = wanted_list.get("resultMessage", "알 수 없는 오류")
                return f"목록 조회 오류: {msg}"

            serv_list = wanted_list.get("servList")
            if not serv_list:
                return f"'{keyword}'에 대한 검색 결과가 없습니다."

            if isinstance(serv_list, dict):
                serv_list = [serv_list]

            # 첫 번째 검색 결과의 서비스 ID 가져오기
            target_serv_id = serv_list[0].get("servId")
            if not target_serv_id:
                return "서비스 ID(servId)를 찾을 수 없습니다."

            # 상세 정보 조회 요청 (callTp="D")
            detail_params = {
                "serviceKey": service_key,
                "callTp": "D",  # 상세 조회
                "servId": target_serv_id,  # 추출한 서비스 ID
            }

            # 추출한 servId로 상세 조회 요청
            detail_res = await client.get(detail_url, params=detail_params)
            if detail_res.status_code != 200:
                return f"상세 API 호출 실패 (상태 코드: {detail_res.status_code})"

            # 상세 조회 XML 응답을 그대로 반환
            detail_data = xmltodict.parse(detail_res.text)
            wanted_detail = detail_data.get("wantedDtl", {})

            # 주요 상세 정보와 함께 링크 URL도 가져오기
            serv_name = wanted_detail.get("servNm", "")
            serv_purpose = wanted_detail.get("servPpo", "")

            raw_url = (
                wanted_detail.get("servDtlUrl")
                or wanted_detail.get("servDtlLink")
                or wanted_detail.get("inqplUrl")
                or wanted_detail.get("alwServDtlURL")
            )

            if raw_url and str(raw_url).strip():
                url_link = str(raw_url).strip()
                if not url_link.startswith("http"):
                    url_link = f"https://www.bokjiro.go.kr{url_link}"
            else:
                url_link = "https://www.bokjiro.go.kr"

            return f"""
                [복지로 상세 정보]
                - 정책명: {serv_name}
                - 주요내용: {serv_purpose}
                - 상세 URL: {url_link}

                ※ 답변 작성 시 위 '상세 URL'을 바탕으로 마크다운 링크([신청 바로가기]({url_link}))를 답변 맨 아래에 반드시 작성해 주세요.
            """

    except Exception as e:  # noqa: BLE001
        return f"복지 API 연동 처리 중 오류 발생: {e}"
