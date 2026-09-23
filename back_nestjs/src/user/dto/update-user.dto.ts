import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: '닉네임은 최소 2글자 이상이어야 합니다.' })
  @MaxLength(12, { message: '닉네임은 최대 12글자 이하이어야 합니다.' })
  nickname?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  profileImage?: string;

  @IsOptional()
  @IsString()
  termsAgreedAt?: string;

  @IsOptional()
  @IsString()
  privacyAgreedAt?: string;

  @IsOptional()
  @IsString()
  marketingAgreedAt?: string;
}
