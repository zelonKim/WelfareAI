import { CrisisReport } from "@/types/crisisReport/CrisisReport";
import { client } from "../client";

export const getMyCrisisReports = async (): Promise<CrisisReport[]> => {
  const { data } = await client.get<CrisisReport[]>("/crisis-report/me");
  return data;
};
