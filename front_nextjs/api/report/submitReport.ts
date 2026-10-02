import { CreateReportPayload } from "@/types/report/CreateReportPayload";
import { ReportResponse } from "@/types/report/ReportResponse";
import { client } from "../client";

export const submitReport = async (
  payload: CreateReportPayload,
): Promise<ReportResponse> => {
  const response = await client.post<ReportResponse>("/report", payload);
  return response.data;
};
