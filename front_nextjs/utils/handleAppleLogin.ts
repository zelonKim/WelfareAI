import {
  APPLE_CLIENT_ID,
  APPLE_REDIRECT_URI,
} from "@/constants/SocialLoginCredentials";

export const handleAppleLogin = () => {
  const appleAuthUrl = `https://appleid.apple.com/auth/authorize?client_id=${APPLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    APPLE_REDIRECT_URI,
  )}&response_type=code id_token&scope=name email&response_mode=form_post`;

  window.location.href = appleAuthUrl;
};
