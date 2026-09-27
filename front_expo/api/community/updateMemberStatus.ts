import { CommunityMemberStatus } from "@/types/community/CommunityMemberStatus";
import { client } from "../client";

export const updateMemberStatus = async ({
  postId,
  targetUserId,
  status,
}: {
  postId: string;
  targetUserId: string;
  status: CommunityMemberStatus;
}) => {
  const { data } = await client.patch(
    `/community/${postId}/members/${targetUserId}/status`,
    { status },
  );
  return data;
};
