import { CustomAppleLoginButton } from "@/components/CustomAppleLoginButton";
import { CustomGoogleLoginButton } from "@/components/CustomGoogleLoginButton";
import Colors from "@/constants/Colors";
import { useLogin } from "@/hooks/auth/useLogin";
import { useSocialLogin } from "@/hooks/auth/useSocialLogin";
import { handleAppleLogin } from "@/utils/handleAppleLogin";
import { handleGoogleLogin } from "@/utils/handleGoogleLogin";

import { useRouter } from "expo-router";
import { Eye, EyeOff, Lock, Mail } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: loginMutation, isPending: loginPending } = useLogin();

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("알림", "이메일과 비밀번호를 모두 입력해 주세요.");
      return;
    }
    loginMutation({ email: email.trim(), password });
  };

  const { mutate: socialLoginMutation, isPending: socialLoginPending } =
    useSocialLogin();

  //////////////////////////////////////////////////////////////////////

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerContainer}>
            <Image
              source={require("../../assets/images/icon.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.title}>
              <Text style={{ color: Colors.point }}>W</Text>elfare
              <Text style={{ color: Colors.point }}>A</Text>I
            </Text>
            <Text style={styles.subtitle}>도움이 필요할때 언제든지 와요</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>이메일</Text>
              <View style={styles.inputContainer}>
                <Mail size={18} color="#6E8B8B" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="example@email.com"
                  placeholderTextColor="#A3B8B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>비밀번호</Text>
              <View style={styles.inputContainer}>
                <Lock size={18} color="#6E8B8B" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="비밀번호 입력"
                  placeholderTextColor="#A3B8B8"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  {showPassword ? (
                    <EyeOff size={18} color="#6E8B8B" />
                  ) : (
                    <Eye size={18} color="#6E8B8B" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                loginPending && styles.disabledButton,
              ]}
              onPress={handleLogin}
              disabled={loginPending}
            >
              {loginPending ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>로그인</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>계정이 없으신가요?</Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
                <Text style={styles.signupLink}>회원가입</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>간편 로그인</Text>
              <View style={styles.dividerLine} />
            </View>

            {socialLoginPending ? (
              <ActivityIndicator />
            ) : (
              <>
                <View style={styles.socialGroup}>
                  <CustomGoogleLoginButton
                    onPress={() => handleGoogleLogin(socialLoginMutation)}
                  />

                  {Platform.OS === "ios" && (
                    <CustomAppleLoginButton
                      onPress={() => handleAppleLogin(socialLoginMutation)}
                    />
                  )}
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

//////////////////////////////////////////////////////////////////////

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F6F6",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    paddingVertical: 40,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 36,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 127, 102, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.primary,
  },
  subtitle: {
    fontSize: Platform.OS === "ios" ? 13.5 : 12.5,
    color: "#6E8B8B",
    marginTop: Platform.OS === "ios" ? 6 : 3,
    fontWeight: Platform.OS === "ios" ? "500" : "400",
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(26, 58, 58, 0.08)",
  },
  inputWrapper: {
    marginBottom: 16,
  },
  textPoint: { color: Colors.point },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1A3A3A",
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFA",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(26, 58, 58, 0.1)",
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 14,
    color: "#1A3A3A",
  },
  eyeIcon: {
    padding: 6,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    gap: 6,
  },
  footerText: {
    fontSize: 13,
    color: "#6E8B8B",
  },
  signupLink: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.point,
  },
  logoImage: {
    width: 68,
    height: 68,
    marginBottom: 10,
    borderRadius: 24,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 13,
    color: "#9CA3AF",
  },
  socialGroup: {
    gap: 12,
    width: "100%",
  },
  socialButton: {
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  googleButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  googleButtonText: {
    color: "#1F2937",
    fontSize: 15,
    fontWeight: "600",
  },
  appleButton: {
    backgroundColor: "#000000",
  },
  appleButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
