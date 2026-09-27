import { CommunityMember } from "./CommunityMember";

export interface CommunityDetail {
  id: string;
  hostId: string;
  type: "VOLUNTEER" | "SELF_HELP";
  title: string;
  content: string;
  notice?: string;
  images?: string[];
  maxMembers?: number;
  createdAt: string;
  host: {
    id: string;
    nickname: string;
    profileImage?: string;
  };
  members?: CommunityMember[];
}
