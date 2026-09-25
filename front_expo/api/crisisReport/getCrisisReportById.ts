import { CrisisReport } from "@/types/crisisReport/CrisisReport";
import { client } from "../client";

export const getReportById = async (id: string): Promise<CrisisReport> => {
  const { data } = await client.get<CrisisReport>(`/crisis-report/${id}`);
  return data;
};