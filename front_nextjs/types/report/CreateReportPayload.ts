export type ReportReason =
  | "SPAM"
  | "INAPPROPRIATE"
  | "ABUSE"
  | "IMPERSONATION"
  | "OTHER";

export interface CreateReportPayload {
  reportedUserName: string;
  reason: ReportReason;
  details: string;
}
