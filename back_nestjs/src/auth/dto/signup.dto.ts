import {
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  IsBoolean,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, {
    message: '비밀번호는 영문과 숫자를 포함하여 8자 이상이어야 합니다.',
  })
  password!: string;

  @IsString()
  @IsNotEmpty()
  passwordConfirm!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: '닉네임은 최소 2글자 이상이어야 합니다.' })
  @MaxLength(12, { message: '닉네임은 최대 12글자 이하이어야 합니다.' })
  nickname!: string;

  @IsBoolean()
  @IsNotEmpty({ message: '서비스 이용 약관에 동의해야 합니다.' })
  isTermsAgreed!: boolean;

  @IsBoolean()
  @IsNotEmpty({ message: '개인정보 처리 방침에 동의해야 합니다.' })
  isPrivacyAgreed!: boolean;

  @IsBoolean()
  @IsOptional()
  isMarketingAgreed?: boolean;
}
