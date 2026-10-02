export type CommunityType = "ALL" | "VOLUNTEER" | "SELF_HELP";

export interface CommunityPost {
  id: string;
  type: CommunityType;
  title: string;
  content: string;
  images: string[];
  maxMembers: number | null;
  host: {
    id: string;
    nickname?: string;
    profileImage?: string;
  };
  members?: { id: string; status: string }[];
  createdAt: string;
  _count: { members: number };
}
