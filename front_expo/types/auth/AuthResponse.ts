export interface AuthResponse {
  message: string;
  accessToken: string;
  user: {
    id: string;
    email: string;
    nickname: string;
    role: string;
  };
}
