export interface PolicyItem {
  id: string;                 // servId
  title: string;              // servNm
  summary: string;            // servDgst
  department: string;         // jurMnofNm
  organization: string;       // jurOrgNm
  inquiryCount: number;       // inqNum
  detailUrl: string;          // servDtlLink
  registeredAt: string;       // svcfrstRegTs
  lifeCycle: string;          // lifeArray
  category: string;           // intrsThemaArray
  targetGroup: string;        // trgterIndvdlArray
  supportCycle: string;       // sprtCycNm
  provisionType: string;      // srvPvsnNm
  contact: string;            // rprsCtadr
  isOnlineApply: boolean;     // onappPsbltYn
}