import { updateAgreementAndNickname } from "@/api/auth/updateAgreementAndNickname";
import { client } from "@/api/client";
import TermsModal from "@/components/TermsModal";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AgreementScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [nickname, setNickname] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [marketingAgreed, setMarketingAgreed] = useState(false);
  const [modalType, setModalType] = useState<
    "terms" | "privacy" | "marketing" | null
  >(null);

  const { data: myInfo } = useQuery({
    queryKey: ["myInfo"],
    queryFn: async () => {
      const { data } = await client.get("/user/me");
      return data;
    },
  });

  useEffect(() => {
    if (myInfo?.nickname) {
      setNickname(myInfo.nickname);
    }
  }, [myInfo]);

  /////////////////////////////////////////////////////////////////////

  // 전체 동의 상태 토글
  const handleAllAgree = () => {
    const nextState = !(termsAgreed && privacyAgreed && marketingAgreed);
    setTermsAgreed(nextState);
    setPrivacyAgreed(nextState);
    setMarketingAgreed(nextState);
  };

  /////////////////////////////////////////////////////////////////////

  // 회원가입 최종 완료 및 약관 동의
  const { mutate: signupCompleteMutation, isPending: signupCompletePending } =
    useMutation({
      mutationFn: () => updateAgreementAndNickname(nickname, marketingAgreed),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["myInfo"] });
        router.replace("/(tabs)");
      },
      onError: (error: any) => {
        const message = error.response?.data?.message;
        const displayMessage = Array.isArray(message) ? message[0] : message;
        Alert.alert("알림", displayMessage || "처리 중 오류가 발생했습니다.");
      },
    });

  const handleSubmit = () => {
    if (!nickname.trim()) {
      Alert.alert("경고", "사용하실 별명을 입력해 주세요.");
      return;
    }
    if (!termsAgreed || !privacyAgreed) {
      Alert.alert("경고", "필수 약관에 모두 동의해 주세요.");
      return;
    }
    signupCompleteMutation();
  };

  /////////////////////////////////////////////////////////////////////

  const isFormValid =
    nickname.trim().length > 0 && termsAgreed && privacyAgreed;

  /////////////////////////////////////////////////////////////////////

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* 헤더 섹션 */}
        <View style={styles.header}>
          <Text style={styles.title}>거의 다 완료됐어요 🦊</Text>
          <Text style={styles.subtitle}>
            WelfareAI 시작을 위해 별명과 약관 동의가 필요해요.
          </Text>
        </View>

        {/* 별명 입력 섹션 */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>별명</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="최소 2자 ~ 최대 12자"
              placeholderTextColor="#999999"
              value={nickname}
              onChangeText={setNickname}
              maxLength={12}
              autoCapitalize="none"
            />
            {nickname.length > 0 && (
              <Text style={styles.charCounter}>{nickname.length}/12</Text>
            )}
          </View>
        </View>

        {/* 약관 동의 카드 영역 */}
        <View style={styles.agreementCard}>
          {/* 전체 동의 버튼 */}
          <TouchableOpacity
            style={styles.allAgreeRow}
            onPress={handleAllAgree}
            activeOpacity={0.7}
          >
            <Ionicons
              name={
                termsAgreed && privacyAgreed && marketingAgreed
                  ? "checkbox"
                  : "square-outline"
              }
              size={22}
              color={
                termsAgreed && privacyAgreed && marketingAgreed
                  ? Colors.point
                  : "#CCCCCC"
              }
            />
            <Text style={styles.allAgreeText}>약관 전체 동의하기</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* 개별 약관 목록 */}
          <View style={styles.termsList}>
            {/* 필수 1: 서비스 이용약관 */}
            <View style={styles.rowContainer}>
              <TouchableOpacity
                style={styles.agreementRow}
                onPress={() => setTermsAgreed(!termsAgreed)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={termsAgreed ? "checkbox" : "square-outline"}
                  size={20}
                  color={termsAgreed ? Colors.point : "#CCCCCC"}
                />
                <Text style={styles.agreementText}>
                  <Text style={styles.requiredText}>[필수]</Text> 서비스
                  이용약관 동의
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.viewLinkBtn}
                onPress={() => setModalType("terms")}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.viewLinkText}>보기</Text>
              </TouchableOpacity>
            </View>

            {/* 필수 2: 개인정보 처리방침 */}
            <View style={styles.rowContainer}>
              <TouchableOpacity
                style={styles.agreementRow}
                onPress={() => setPrivacyAgreed(!privacyAgreed)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={privacyAgreed ? "checkbox" : "square-outline"}
                  size={20}
                  color={privacyAgreed ? Colors.point : "#CCCCCC"}
                />
                <Text style={styles.agreementText}>
                  <Text style={styles.requiredText}>[필수]</Text> 개인정보
                  처리방침 동의
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.viewLinkBtn}
                onPress={() => setModalType("privacy")}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.viewLinkText}>보기</Text>
              </TouchableOpacity>
            </View>

            {/* 선택 1: 마케팅 정보 수신 */}
            <View style={styles.rowContainer}>
              <TouchableOpacity
                style={styles.agreementRow}
                onPress={() => setMarketingAgreed(!marketingAgreed)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={marketingAgreed ? "checkbox" : "square-outline"}
                  size={20}
                  color={marketingAgreed ? Colors.point : "#CCCCCC"}
                />
                <Text style={styles.agreementText}>
                  <Text style={styles.optionalText}>[선택]</Text> 마케팅 정보
                  수신 동의
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.viewLinkBtn}
                onPress={() => setModalType("marketing")}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.viewLinkText}>보기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 제출 버튼 */}
        <TouchableOpacity
          style={[
            styles.submitBtn,
            {
              backgroundColor: isFormValid ? Colors.point : "#E5E5EA",
              opacity: isFormValid ? 1 : 0.6,
            },
          ]}
          onPress={handleSubmit}
          disabled={!isFormValid || signupCompletePending}
          activeOpacity={0.8}
        >
          {signupCompletePending ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text
              style={[
                styles.submitBtnText,
                { color: isFormValid ? "#1C1C1E" : "#8E8E93" },
              ]}
            >
              시작하기
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <TermsModal
        visible={modalType !== null}
        type={modalType}
        onClose={() => setModalType(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: Colors.pointCard || "#F8F9FA",
  },
  content: {
    paddingHorizontal: 24,
    gap: 28,
  },
  header: {
    gap: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1C1C1E",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#6C757D",
    lineHeight: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  inputWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  input: {
    backgroundColor: Colors.card || "#FFFFFF",
    height: 52,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingRight: 55,
    color: "#1C1C1E",
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  charCounter: {
    position: "absolute",
    right: 16,
    fontSize: 12,
    color: "#ADB5BD",
  },
  agreementCard: {
    backgroundColor: Colors.card || "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E9ECEF",
    gap: 16,
  },
  allAgreeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  allAgreeText: {
    color: "#1C1C1E",
    fontSize: 16,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F3F5",
  },
  termsList: {
    gap: 14,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  agreementRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  requiredText: {
    color: Colors.point || "#007AFF",
    fontWeight: "600",
  },
  optionalText: {
    color: "#8E8E93",
    fontWeight: "500",
  },
  agreementText: {
    color: "#495057",
    fontSize: 14,
  },
  viewLinkBtn: {
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  viewLinkText: {
    color: "#ADB5BD",
    fontSize: 13,
    textDecorationLine: "underline",
  },
  submitBtn: {
    height: 54,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
