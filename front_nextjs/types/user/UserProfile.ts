export interface UserProfile {
  id: string;
  email: string;
  nickname: string;
  profileImage: string | null;
  bio: string | null;
  termsAgreedAt: string | Date;
  privacyAgreedAt: string | Date;
  marketingAgreedAt: string | Date | null;
}
