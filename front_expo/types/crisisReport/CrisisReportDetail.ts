import { Comment } from "./Comment";

export interface CrisisReportDetail {
  id: string;
  title: string;
  content: string;
  address: string;
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED";
  images: string[];
  createdAt: string;
  user: {
    id: string;
    nickname: string;
    profileImage?: string;
  };
  comments: Comment[];
}
