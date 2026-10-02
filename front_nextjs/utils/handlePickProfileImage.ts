export const handlePickProfileImage = (
  setSelectedImageUri: (uri: string) => void,
) => {
  // 1. 파일 선택 input 생성
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*"; // 이미지 파일만 선택 가능

  // 2. 파일 선택 시 이벤트 핸들러
  input.onchange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) return;

    // 이미지 용량 및 확장자 체크 (옵션)
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    // 3. 선택한 파일로 미리보기 URL 생성 (Data URL 방식)
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setSelectedImageUri(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // 3. 파일 선택 창 열기
  input.click();
};
