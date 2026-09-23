import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreatePolicyDto {
  @IsString()
  @IsNotEmpty({ message: '정책명을 입력해주세요.' })
  title!: string;

  @IsString()
  @IsNotEmpty({ message: '정책 내용을 입력해주세요.' })
  content!: string;

  @IsString()
  @IsOptional()
  summary?: string;

  @IsString()
  @IsOptional()
  target?: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsUrl({}, { message: '올바른 URL 형식이어야 합니다.' })
  @IsOptional()
  applicationUrl?: string;
}