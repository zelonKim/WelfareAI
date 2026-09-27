export interface CommunityMember {
  id: string;
  userId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  user?: {
    id: string;
    nickname: string;
    email: string;
    profileImage?: string;
  };
}
