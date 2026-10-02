import { SocialLoginData } from "@/types/auth/SocialLoginData";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { Alert } from "react-native";

GoogleSignin.configure({
  webClientId:
    "139186638108-bj6h9a6lkk7ra3ut2hvq8hlo0ip54kov.apps.googleusercontent.com",
  iosClientId:
    "139186638108-pue8l2an00gop2e0hku7e8cakm49rm49.apps.googleusercontent.com",
  offlineAccess: true,
});

let isSigningIn = false;

export const handleGoogleLogin = async (
  socialLoginMutation: (data: SocialLoginData) => void,
) => {
  if (isSigningIn) return;
  isSigningIn = true;

  try {
    await GoogleSignin.hasPlayServices();

    try {
      await GoogleSignin.signOut();
    } catch (err) {
      console.log(err);
    }

    const response = await GoogleSignin.signIn();

    const idToken = response.data?.idToken || (response as any).idToken;

    if (idToken) {
      socialLoginMutation({ idToken, provider: "google" });
    } else {
      Alert.alert("오류", "구글 인증 토큰을 가져오지 못했습니다.");
    }
  } catch (error: any) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log("구글 로그인 취소됨");
    } else if (error.code === statusCodes.IN_PROGRESS) {
      console.log("구글 로그인이 이미 진행 중입니다.");
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      Alert.alert("오류", "Google Play Services를 사용할 수 없습니다.");
    } else {
      console.log("=== 구글 로그인 에러 상세 ===", {
        code: error.code,
        message: error.message,
        fullError: JSON.stringify(error, null, 2),
      });
      Alert.alert(
        "오류",
        error.message || "구글 로그인 중 문제가 발생했습니다.",
      );
    }
  } finally {
    isSigningIn = false;
  }
};
