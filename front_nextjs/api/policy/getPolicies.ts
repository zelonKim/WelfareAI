import { PolicyResponse } from "@/types/policy/PolicyResponse";
import { PolicySearchParams } from "@/types/policy/PolicySearchParams";
import { client } from "../client";


export const getPolicies = async (
  params?: PolicySearchParams,
): Promise<PolicyResponse> => {
  const response = await client.get("/policy", { params });
  return response.data;
};
