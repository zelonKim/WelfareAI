import { CreateCommentPayload } from "@/types/crisisReport/CreateCommentPayload";
import { client } from "../client";

export const createComment = async ({
  reportId,
  content,
}: CreateCommentPayload) => {
  const { data } = await client.post(`/crisis-report/${reportId}/comment`, {
    content,
  });
  return data;
};
