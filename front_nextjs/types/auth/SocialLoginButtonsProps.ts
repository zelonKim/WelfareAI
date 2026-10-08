export interface SocialLoginButtonsProps {
  onGoogleSuccess: (idToken: string) => void;
  onAppleLogin: () => void;
  isSocialPending: boolean;
}
