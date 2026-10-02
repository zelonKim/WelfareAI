export interface PolicySearchParams {
  keyword?: string;
  category?: string;
  lifeCycle?: string;
  targetGroup?: string;
  age?: number;
  onappPsbltYn?: 'Y' | 'N';
  pageNo?: number;
  numOfRows?: number;
}