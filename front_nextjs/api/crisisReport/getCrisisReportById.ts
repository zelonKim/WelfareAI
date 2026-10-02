import { CrisisReportDetail } from "@/types/crisisReport/CrisisReportDetail";
import { client } from "../client";

export const getCrisisReportById = async (
  id: string,
): Promise<CrisisReportDetail> => {
  const { data } = await client.get<CrisisReportDetail>(`/crisis-report/${id}`);
  return data;
};
