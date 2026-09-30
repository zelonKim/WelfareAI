import { SocialLoginData } from "@/types/auth/SocialLoginData";
import * as AppleAuthentication from "expo-apple-authentication";
import { Alert, Platform } from "react-native";

let isSigningIn = false;

export const handleAppleLogin = async (
  socialLoginMutation: (data: SocialLoginData) => void,
) => {
  if (Platform.OS !== "ios") {
    Alert.alert("안내", "Apple 로그인은 iOS 기기에서만 지원됩니다.");
    return;
  }
  if (isSigningIn) return;
  isSigningIn = true;

  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    if (credential.identityToken) {
      socialLoginMutation({
        idToken: credential.identityToken,
        provider: "apple",
      });
    } else {
      Alert.alert("오류", "애플 인증 토큰을 가져오지 못했습니다.");
    }
  } catch (e: any) {
    if (
      e.code === "ERR_REQUEST_CANCELED" ||
      e.code === "ERR_CANCELED" ||
      e.code === "1001"
    ) {
      console.log("애플 로그인 취소됨");
    } else {
      console.log("=== 애플 로그인 에러 상세 ===", e);
      Alert.alert("오류", "애플 로그인 중 문제가 발생했습니다.");
    }
  } finally {
    isSigningIn = false;
  }
};
