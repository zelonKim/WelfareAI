export interface PolicyItem {
  id: string; // servId: 서비스 ID[cite: 20]
  title: string; // servNm: 서비스명[cite: 20]
  summary: string; // servDgst: 서비스 요약[cite: 20]
  department: string; // jurMnofNm: 소관부처명[cite: 20]
  organization: string; // jurOrgNm: 소관조직명[cite: 20]
  inquiryCount: number; // inqNum: 조회수[cite: 20]
  detailUrl: string; // servDtlLink: 서비스 상세링크[cite: 20]
  registeredAt: string; // svcfrstRegTs: 서비스 등록일[cite: 20]
  lifeCycle: string; // lifeArray: 생애주기
  category: string; // intrsThemaArray: 관심주제[cite: 21]
  targetGroup: string; // trgterIndvdlArray: 가구유형[cite: 21]
  supportCycle: string; // sprtCycNm: 지원주기 (예: 1회성, 수시)[cite: 21]
  provisionType: string; // srvPvsnNm: 제공유형 (예: 전자바우처, 현금지급)[cite: 21]
  contact: string; // rprsCtadr: 문의처[cite: 21]
  isOnlineApply: boolean; // onappPsbltYn: 온라인신청 가능 여부 (Y/N -> boolean)[cite: 21]
}

export interface PolicyResponse {
  totalCount: number; // 전체 데이터 수
  pageNo: number; // 현재 페이지 번호
  numOfRows: number; // 한 페이지 결과 수[cite: 20]
  items: PolicyItem[]; // 복지 정책 목록[cite: 20]
}
