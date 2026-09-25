import { CrisisReport } from "@/types/crisisReport/CrisisReport";
import { client } from "../client";

export const getAllCrisisReports = async (): Promise<CrisisReport[]> => {
  const { data } = await client.get<CrisisReport[]>("/crisis-report");
  return data;
};
