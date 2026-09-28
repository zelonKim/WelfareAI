import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchPolicyDto {
  @IsOptional()
  @IsString()
  keyword?: string; // 검색어

  @IsOptional()
  @IsString()
  category?: string; // 관심주제 (예: '주거', '일자리', '신체건강')

  @IsOptional()
  @IsString()
  lifeCycle?: string; // 생애주기 (예: '청년', '영유아')

  @IsOptional()
  @IsString()
  targetGroup?: string; // 가구유형 (예: '저소득', '장애인')

  @IsOptional()
  @Type(() => Number) // Query Parameter(문자열) -> Number 자동 변환
  @IsNumber()
  age?: number; // 나이 (예: 20)

  @IsOptional()
  @IsString()
  onappPsbltYn?: 'Y' | 'N'; // 온라인신청 가능 여부 ('Y' 또는 'N')

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pageNo?: number = 1; // 요청할 페이지 번호 (기본값: 1)

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  numOfRows?: number = 10; // 한 페이지당 결과 수 (기본값: 10)[cite: 20]
}
