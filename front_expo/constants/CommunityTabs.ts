import { CommunityType } from "@/types/community/CommunityPost";

export const CommunityTabs: { label: string; value: CommunityType }[] = [
  { label: "전체 모임", value: "ALL" },
  { label: "소통 모임", value: "SELF_HELP" },
  { label: "봉사 모임", value: "VOLUNTEER" },
];
