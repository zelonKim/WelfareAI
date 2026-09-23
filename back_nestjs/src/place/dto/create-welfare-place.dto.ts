import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateWelfarePlaceDto {
  @IsString()
  @IsNotEmpty({ message: '장소 또는 행사명을 입력해주세요.' })
  @MaxLength(100, { message: '이름은 최대 100자까지 입력 가능합니다.' })
  name!: string;

  @IsString()
  @IsNotEmpty({ message: '카테고리를 입력해주세요.' })
  category!: string;

  @IsString()
  @IsNotEmpty({ message: '주소를 입력해주세요.' })
  address!: string;

  @IsNumber({}, { message: '위도는 숫자 형태여야 합니다.' })
  @IsNotEmpty({ message: '위도를 입력해주세요.' })
  latitude!: number;

  @IsNumber({}, { message: '경도는 숫자 형태여야 합니다.' })
  @IsNotEmpty({ message: '경도를 입력해주세요.' })
  longitude!: number;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString({}, { message: '올바른 날짜 형식이어야 합니다.' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: '올바른 날짜 형식이어야 합니다.' })
  endDate?: string;
}