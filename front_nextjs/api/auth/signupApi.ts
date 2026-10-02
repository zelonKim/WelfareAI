import { AuthResponse } from "@/types/auth/AuthResponse";
import { SignupDto } from "@/types/auth/SignupDto";
import { client } from "../client";

export const signupApi = async (dto: SignupDto): Promise<AuthResponse> => {
  const response = await client.post<AuthResponse>("/auth/signup", dto);
  return response.data;
};
