import { ReportReason } from "@/types/report/CreateReportPayload";

export const REPORT_REASONS: { label: string; value: ReportReason }[] = [
  { label: "불법 광고 및 도배", value: "SPAM" },
  { label: "부적절한 콘텐츠", value: "INAPPROPRIATE" },
  { label: "욕설, 비방, 혐오 발언", value: "ABUSE" },
  { label: "사칭 및 허위 정보", value: "IMPERSONATION" },
  { label: "기타", value: "OTHER" },
];
