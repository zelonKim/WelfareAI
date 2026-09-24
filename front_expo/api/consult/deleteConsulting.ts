import { client } from "../client";

export const deleteConsulting = async (id: string) => {
  const response = await client.delete(`/consulting/${id}`);
  return response.data;
};