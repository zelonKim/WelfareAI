import { client } from "../client";

export const deleteAllConsulting = async (): Promise<{
  message: string;
}> => {
  const response = await client.delete("/consulting/all");
  return response.data;
};
