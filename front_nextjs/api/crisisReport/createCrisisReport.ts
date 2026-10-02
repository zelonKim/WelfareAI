import { CreateCrisisReportDto } from "@/types/crisisReport/CreateCrisisReportDto";
import { client } from "../client";
import { CreateCrisisReportResponse } from "@/types/crisisReport/CreateCrisisReportResponse";

export const createCrisisReport = async (
  dto: CreateCrisisReportDto,
): Promise<CreateCrisisReportResponse> => {
  const { data } = await client.post<CreateCrisisReportResponse>(
    "/crisis-report",
    dto,
  );
  return data;
};
