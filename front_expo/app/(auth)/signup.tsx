import Colors from "@/constants/Colors";
import { useSignup } from "@/hooks/auth/useSignup";
import { useRouter } from "expo-router";
import {
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  RefreshCw,
  User,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

export default function SignupScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isTermsAgreed, setIsTermsAgreed] = useState(false);
  const [isPrivacyAgreed, setIsPrivacyAgreed] = useState(false);
  const [isMarketingAgreed, setIsMarketingAgreed] = useState(false);

  const isAllAgreed = isTermsAgreed && isPrivacyAgreed && isMarketingAgreed;

  const handleAllAgree = () => {
    const newValue = !isAllAgreed;
    setIsTermsAgreed(newValue);
    setIsPrivacyAgreed(newValue);
    setIsMarketingAgreed(newValue);
  };

  //////////////////////////////////////////////////////////////////////

  const { signupMutation, signupPending } = useSignup();

  const handleSignup = () => {
    if (!email.trim() || !nickname.trim() || !password || !passwordConfirm) {
      Alert.alert("알림", "모든 정보를 입력해 주세요.");
      return;
    }

    if (nickname.trim().length < 2) {
      Alert.alert("알림", "닉네임은 최소 2자 이상이어야 합니다.");
      return;
    }

    if (nickname.trim().length > 12) {
      Alert.alert("알림", "닉네임은 최대 12자 이하이어야 합니다.");
      return;
    }

    if (password !== passwordConfirm) {
      Alert.alert("알림", "비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    if (!isTermsAgreed || !isPrivacyAgreed) {
      Alert.alert("알림", "필수 약관에 동의해 주세요.");
      return;
    }

    signupMutation({
      email: email.trim(),
      nickname: nickname.trim(),
      password,
      passwordConfirm,
      isTermsAgreed,
      isPrivacyAgreed,
      isMarketingAgreed,
    });
  };

  //////////////////////////////////////////////////////////////////////

  // 랜덤 닉네임 목록
  const ADJECTIVES = [
    "따뜻한",
    "행복한",
    "스마트한",
    "든든한",
    "다정한",
    "미소짓는",
    "희망찬",
  ];
  const NOUNS = [
    "사람",
    "지킴이",
    "도우미",
    "이웃",
    "동반자",
    "가이드",
    "친구",
  ];

  const generateRandomNickname = () => {
    const randomAdj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const randomNoun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // 3자리 숫자 추가 (중복 방지)

    return `${randomAdj}${randomNoun}${randomNumber}`;
  };

  const handleAutoGenerateNickname = () => {
    const newNickname = generateRandomNickname();
    setNickname(newNickname);
  };

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
            <Text style={styles.title}>환영해요 🦊</Text>
            <Text style={styles.subtitle}>
              지금 가입하고, 맞춤형 복지를 누려보세요.
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>이메일 </Text>
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
              <Text style={styles.label}>비밀번호 </Text>
              <View style={styles.inputContainer}>
                <Lock size={18} color="#6E8B8B" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="숫자와 영문 포함 8자 이상"
                  placeholderTextColor="#A3B8B8"
                  secureTextEntry={!showPassword}
                  value={password}
                  autoCapitalize="none"
                  onChangeText={setPassword}
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

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>비밀번호 확인 </Text>
              <View style={styles.inputContainer}>
                <Lock size={18} color="#6E8B8B" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="비밀번호 재입력"
                  placeholderTextColor="#A3B8B8"
                  secureTextEntry={!showPassword}
                  value={passwordConfirm}
                  autoCapitalize="none"
                  onChangeText={setPasswordConfirm}
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>닉네임</Text>

                {/* 입력창과 버튼을 옆으로 배치하는 Container */}
                <View style={styles.nicknameRow}>
                  <View style={styles.nicknameInputContainer}>
                    <User size={18} color="#6E8B8B" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="최소 2자 이상"
                      placeholderTextColor="#A3B8B8"
                      value={nickname}
                      onChangeText={setNickname}
                    />
                  </View>

                  {/* 외부에 분리된 랜덤 생성 버튼 */}
                  <TouchableOpacity
                    onPress={handleAutoGenerateNickname}
                    style={styles.randomButton}
                    activeOpacity={0.7}
                  >
                    <RefreshCw size={16} color={Colors.point} />
                    <Text style={styles.randomButtonText}>추천</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.termsSection}>
              <Text style={styles.label}>약관 동의</Text>

              {/* 전체 동의 버튼 */}
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={handleAllAgree}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.checkbox,
                    isAllAgreed && styles.checkboxChecked,
                  ]}
                >
                  {isAllAgreed && <Check size={12} color="#FFFFFF" />}
                </View>
                <Text style={[styles.checkboxText, styles.allAgreeText]}>
                  약관 전체 동의
                </Text>
              </TouchableOpacity>

              {/* 구분선 */}
              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.checkboxRowEach}
                onPress={() => setIsTermsAgreed(!isTermsAgreed)}
              >
                <View
                  style={[
                    styles.checkboxEach,
                    isTermsAgreed && styles.checkboxChecked,
                  ]}
                >
                  {isTermsAgreed && <Check size={12} color="#FFFFFF" />}
                </View>
                <Text style={styles.checkboxText}>
                  [필수] 서비스 이용약관 동의
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkboxRowEach}
                onPress={() => setIsPrivacyAgreed(!isPrivacyAgreed)}
              >
                <View
                  style={[
                    styles.checkboxEach,
                    isPrivacyAgreed && styles.checkboxChecked,
                  ]}
                >
                  {isPrivacyAgreed && <Check size={12} color="#FFFFFF" />}
                </View>
                <Text style={styles.checkboxText}>
                  [필수] 개인정보 수집 및 이용 동의
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkboxRowEach}
                onPress={() => setIsMarketingAgreed(!isMarketingAgreed)}
              >
                <View
                  style={[
                    styles.checkboxEach,
                    isMarketingAgreed && styles.checkboxChecked,
                  ]}
                >
                  {isMarketingAgreed && <Check size={12} color="#FFFFFF" />}
                </View>
                <Text style={styles.checkboxText}>
                  [선택] 마케팅 정보 수신 동의
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                signupPending && styles.disabledButton,
              ]}
              onPress={handleSignup}
              disabled={signupPending}
            >
              {signupPending ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>시작하기</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>이미 계정이 있으신가요?</Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.loginLink}>로그인</Text>
              </TouchableOpacity>
            </View>
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
    paddingVertical: 32,
  },
  headerContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1A3A3A",
  },
  subtitle: {
    fontSize: 14,
    color: "#6E8B8B",
    marginTop: Platform.OS === "ios" ? 10 : 3,
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(26, 58, 58, 0.08)",
  },
  inputWrapper: {
    marginBottom: 14,
  },
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
    height: 46,
    fontSize: 14,
    color: "#1A3A3A",
  },
  eyeIcon: {
    padding: 6,
  },
  termsSection: {
    marginTop: 8,
    marginBottom: 16,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  checkboxRowEach: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
    marginLeft: 6,
  },
  checkbox: {
    width: 21,
    height: 21,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.muted,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkboxEach: {
    width: 17,
    height: 17,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.muted,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: Colors.point,
    borderColor: Colors.point,
  },
  checkboxText: {
    fontSize: 13,
    color: Colors.primary,
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
    marginTop: 18,
    gap: 6,
  },
  footerText: {
    fontSize: 13,
    color: "#6E8B8B",
  },
  loginLink: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.point,
  },
  allAgreeText: {
    fontWeight: Platform.OS === "ios" ? "700" : "600",
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 8,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  autoGenerateBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 127, 102, 0.1)", // Colors.point 기반 옅은 배경
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  autoGenerateText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.point,
  },
  nicknameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8, // 입력창과 버튼 사이 간격 (RN 0.71+ 지원, 미지원 시 marginRight 활용)
  },
  nicknameInputContainer: {
    flex: 1, // 남은 공간을 입력창이 모두 차지
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFA",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(26, 58, 58, 0.1)",
    paddingHorizontal: 12,
    height: 46,
  },
  randomButton: {
    height: 46,
    paddingHorizontal: 14,
    backgroundColor: "rgba(255, 127, 102, 0.1)", // Colors.point 기반 옅은 배경
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 127, 102, 0.2)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  randomButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.point,
  },
});
