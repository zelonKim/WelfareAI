import { uploadImage } from "@/api/common/uploadImage";
import { useMutation } from "@tanstack/react-query";

export const useUploadImage = () => {
  return useMutation({
    mutationFn: uploadImage,
    onError: (err) => {
      console.error("클라우드 이미지 업로드 실패:", err);
      alert("이미지를 업로드하지 못했습니다.");
    },
  });
};
