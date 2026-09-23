import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryWelfarePlaceDto {
  @IsOptional()
  @IsString()
  search?: string; // 검색어

  // 지도 화면 범위 검색용 (선택)
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  swLatitude?: number; // 남서쪽 위도

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  swLongitude?: number; // 남서쪽 경도

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  neLatitude?: number; // 북동쪽 위도

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  neLongitude?: number; // 북동쪽 경도
}
