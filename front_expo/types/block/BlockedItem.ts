export interface BlockedItem {
  id: string;
  blockedId: string;
  blockedUser: {
    id: string;
    nickname: string;
    profileImage: string;
  };
}