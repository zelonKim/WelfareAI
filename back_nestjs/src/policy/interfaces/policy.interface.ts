export interface PolicyItem {
  id: string; // servId: 서비스 ID
  title: string; // servNm: 서비스명
  summary: string; // servDgst: 서비스 요약
  department: string; // jurMnofNm: 소관부처명
  organization: string; // jurOrgNm: 소관조직명
  inquiryCount: number; // inqNum: 조회수
  detailUrl: string; // servDtlLink: 서비스 상세링크
  registeredAt: string; // svcfrstRegTs: 서비스 등록일
  lifeCycle: string; // lifeArray: 생애주기
  category: string; // intrsThemaArray: 관심주제
  targetGroup: string; // trgterIndvdlArray: 가구유형
  supportCycle: string; // sprtCycNm: 지원주기 
  provisionType: string; // srvPvsnNm: 제공유형 
  contact: string; // rprsCtadr: 문의처
  isOnlineApply: boolean; // onappPsbltYn: 온라인신청 가능 여부 
}

export interface PolicyResponse {
  totalCount: number; // 전체 데이터 수
  pageNo: number; // 현재 페이지 번호
  numOfRows: number; // 한 페이지 결과 수
  items: PolicyItem[]; // 복지 정책 목록
}
