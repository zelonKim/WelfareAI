import { HandlePickImageProps } from "@/types/common/HandlePickImageProps";

export const handlePickImage = async ({
  files,
  setImages,
  uploadImageMutation,
}: HandlePickImageProps) => {
  if (!files || files.length === 0) return;

  Array.from(files).forEach((file) => {
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert("파일 크기는 최대 10MB까지 선택 가능합니다.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    uploadImageMutation(formData, {
      onSuccess: (imageUrl) => {
        const imageUrlWithCacheBust = `${imageUrl}?t=${Date.now()}`;
        setImages((prev) => [...prev, imageUrlWithCacheBust]);
      },
      onError: (error) => {
        console.error("이미지 업로드 실패:", error);
        alert("이미지 업로드 중 오류가 발생했습니다.");
      },
    });
  });
};
