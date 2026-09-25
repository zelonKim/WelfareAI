import { CrisisReportUser } from "./CrisisReportUser";

export interface CrisisReport {
  id: string;
  userId: string;
  title: string;
  content: string;
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
  images: string[];
  createdAt: string;
  user?: CrisisReportUser;
}
