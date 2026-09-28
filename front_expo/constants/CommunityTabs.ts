export const CommunityTabs = [
  { label: "전체 모임", value: "ALL" },
  { label: "나의 모임", value: "MY" },
] as const;

export type TabType = (typeof CommunityTabs)[number]["value"];
