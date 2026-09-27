import { UpdateCrisisReportDto } from "@/types/crisisReport/UpdateCrisisReportDto";
import { client } from "../client";

export const updateCrisisReport = async (
  id: string,
  dto: UpdateCrisisReportDto,
) => {
  const { data } = await client.patch(`/crisis-report/${id}`, dto);
  return data;
};
