import { client } from "../client";

// 백엔드 응답 타입 정의
interface UploadImageResponse {
  success: boolean;
  imageUrl: string;
}

export const uploadImage = async (formData: FormData): Promise<string> => {
  const response = await client.post<UploadImageResponse>(
    "/user/image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data.imageUrl;
};
