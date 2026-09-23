import { IsOptional, IsString } from 'class-validator';

export class SearchPolicyDto {
  @IsString()
  @IsOptional()
  keyword?: string; 
}
