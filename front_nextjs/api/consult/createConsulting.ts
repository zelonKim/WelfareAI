import { ConsultingItem } from "@/types/consult/ConsultingItem";
import { CreateConsultingDto } from "@/types/consult/CreateConsultingDto";
import { client } from "../client";

export const createConsulting = async (
  dto: CreateConsultingDto,
): Promise<ConsultingItem> => {
  const response = await client.post<ConsultingItem>("/consulting", dto);
  return response.data;
};
