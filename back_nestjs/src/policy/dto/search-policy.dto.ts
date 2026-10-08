import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchPolicyDto {
  @IsOptional()
  @IsString()
  keyword?: string; // 검색어

  @IsOptional()
  @IsString()
  category?: string; // 관심주제

  @IsOptional()
  @IsString()
  lifeCycle?: string; // 생애주기

  @IsOptional()
  @IsString()
  targetGroup?: string; // 가구유형

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  age?: number; // 나이

  @IsOptional()
  @IsString()
  onappPsbltYn?: 'Y' | 'N'; // 온라인신청 가능 여부

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pageNo?: number = 1; // 요청할 페이지 번호

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  numOfRows?: number = 10; // 한 페이지당 결과 수
}
