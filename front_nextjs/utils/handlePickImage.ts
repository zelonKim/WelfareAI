import { UseMutateFunction } from "@tanstack/react-query";

interface HandlePickImageProps {
  files: File[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  uploadImageMutation: UseMutateFunction<string, Error, FormData, unknown>;
}

export const handlePickImage = async ({
  files,
  setImages,
  uploadImageMutation,
}: HandlePickImageProps) => {
  if (!files || files.length === 0) return;

  // 선택한 파일들을 순회하며 업로드 처리
  Array.from(files).forEach((file) => {
    // 1. 이미지 파일 확장자 검증
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    // 2. 파일 크기 제한 (예: 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert("파일 크기는 최대 10MB까지 선택 가능합니다.");
      return;
    }

    // 3. 웹 표준 FormData 생성 및 파일 추가
    const formData = new FormData();
    formData.append("image", file);

    // 4. React Query mutation 호출
    uploadImageMutation(formData, {
      onSuccess: (imageUrl) => {
        // 캐시 방지 쿼리 파라미터 추가
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
