export interface UpdateCrisisReportDto {
  title?: string;
  content?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  images?: string[];
}