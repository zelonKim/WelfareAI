import { UploadImageResponse } from "@/types/common/UploadImageResponse";
import { client } from "../client";

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
