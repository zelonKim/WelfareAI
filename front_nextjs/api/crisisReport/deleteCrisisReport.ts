import { client } from "../client";

export const deleteCrisisReport = async (reportId: string) => {
  const { data } = await client.delete(`/crisis-report/${reportId}`);
  return data;
};
