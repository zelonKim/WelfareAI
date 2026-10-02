import { ConsultingItem } from "@/types/consult/ConsultingItem";
import { client } from "../client";

export const getConsultings = async (): Promise<ConsultingItem[]> => {
  const response = await client.get<ConsultingItem[]>("/consulting");
  return response.data;
};
