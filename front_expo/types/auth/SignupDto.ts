export interface SignupDto {
  email: string;
  nickname: string;
  password: string;
  passwordConfirm: string;
  isTermsAgreed: boolean;
  isPrivacyAgreed: boolean;
  isMarketingAgreed?: boolean;
}
