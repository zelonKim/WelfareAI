import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { CommunityType } from '@prisma/client';

export class CreateCommunityPostDto {
  @IsNotEmpty({ message: '커뮤니티 타입을 선택해주세요.' })
  @IsEnum(CommunityType, { message: '올바른 커뮤니티 타입이 아닙니다.' })
  type!: CommunityType;

  @IsString()
  @IsNotEmpty({ message: '제목을 입력해주세요.' })
  @MaxLength(100, { message: '제목은 최대 100자까지 작성할 수 있습니다.' })
  title!: string;

  @IsString()
  @IsNotEmpty({ message: '내용을 입력해주세요.' })
  @MaxLength(3000, { message: '내용은 최대 3000자까지 작성할 수 있습니다.' })
  content!: string;

  @IsOptional()
  @IsString()
  notice?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsInt({ message: '최대 인원수는 정수여야 합니다.' })
  @Min(2, { message: '최대 인원수는 최소 2명 이상이어야 합니다.' })
  maxMembers?: number;
}
