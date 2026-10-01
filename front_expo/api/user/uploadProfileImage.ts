import { client } from "../client";

export const uploadProfileImage = async (imageUri: string): Promise<string> => {
  const formData = new FormData();
  const filename = imageUri.split("/").pop() || "profile.jpg";
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : "image/jpeg";

  formData.append("image", {
    uri: imageUri,
    name: filename,
    type,
  } as any);

  const res = await client.post<{ imageUrl: string }>("/user/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.imageUrl;
};