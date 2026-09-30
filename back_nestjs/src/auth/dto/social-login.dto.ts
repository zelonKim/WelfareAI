import { IsString, IsIn, IsNotEmpty } from 'class-validator';

export class SocialLoginDto {
  @IsString()
  @IsNotEmpty()
  token!: string;

  @IsIn(['google', 'apple'])
  @IsNotEmpty()
  provider!: 'google' | 'apple';
}
