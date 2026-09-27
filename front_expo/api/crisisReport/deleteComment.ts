import { client } from "../client";

export const deleteComment = async (commentId: string) => {
  const { data } = await client.delete(`/crisis-report/comment/${commentId}`);
  return data;
};
