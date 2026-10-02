export const CATEGORIES = [
  "전체",
  "신체건강",
  "정신건강",
  "생활지원",
  "주거",
  "일자리",
  "문화/여가",
  "안전/위기",
  "임신/출산",
  "보육",
  "교육",
  "보호/돌봄",
  "서민금융",
  "법률",
  "관계개선",
  "에너지",
] as const;

export type Category = (typeof CATEGORIES)[number];
