import { PolicyItem } from "./PolicyItem";

export interface PolicyResponse {
  totalCount: number;
  pageNo: number;
  numOfRows: number;
  items: PolicyItem[];
}