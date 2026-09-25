import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCrisisReportDto {
  @IsString()
  @IsNotEmpty({ message: '제목을 입력해주세요' })
  @MaxLength(100, { message: '제목은 최대 100자까지 작성할 수 있습니다.' })
  title!: string;

  @IsString()
  @IsNotEmpty({ message: '내용을 입력해주세요' })
  @MaxLength(2000, { message: '내용은 최대 2000자까지 작성할 수 있습니다.' })
  content!: string;

  @IsString()
  @IsNotEmpty({ message: '위치를 입력해주세요' })
  address!: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
