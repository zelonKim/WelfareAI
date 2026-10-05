import { client } from "../client";

export const uploadProfileImage = async (imageUri: string): Promise<string> => {
  const formData = new FormData();
  const filename = imageUri.split("/").pop() || "profile.jpg";
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : "image/jpeg";

  // 이미지 URI(blob: / data: / http)를 실제 Blob 객체로 변환
  const response = await fetch(imageUri);
  const blob = await response.blob();

  // 웹 표준 File 객체 생성 후 FormData에 추가
  const file = new File([blob], filename, { type });
  formData.append("image", file);

  // NestJS 백엔드로 업로드 요청
  const res = await client.post<{ imageUrl: string }>("/user/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.imageUrl;
};
