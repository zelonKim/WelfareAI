import { AuthResponse } from "@/types/auth/AuthResponse";
import { LoginDto } from "@/types/auth/LoginDto";
import { client } from "../client";

export const loginApi = async (dto: LoginDto): Promise<AuthResponse> => {
  const response = await client.post<AuthResponse>("/auth/login", dto);
  return response.data;
};
