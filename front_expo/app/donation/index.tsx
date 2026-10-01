import { Colors } from "@/constants/Colors"; // 프로젝트 컬러 경로에 맞게 조정
import { Stack, useRouter } from "expo-router";
import {
  ChevronLeft,
  Coffee,
  ExternalLink,
  Heart,
  ShieldCheck,
} from "lucide-react-native";
import React from "react";
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DonationScreen() {
  const router = useRouter();

  const DONATION_WEB_URL = "https://ko-fi.com/zelonkim";

  const handleOpenWebPage = async () => {
    try {
      const supported = await Linking.canOpenURL(DONATION_WEB_URL);
      if (supported) {
        await Linking.openURL(DONATION_WEB_URL);
      } else {
        Alert.alert("안내", "웹페이지를 열 수 없습니다. 링크를 확인해 주세요.");
      }
    } catch (error) {
      Alert.alert("오류", "페이지 연결 중 문제가 발생했습니다.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.customHeader}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.backButton}
        >
          <ChevronLeft size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>후원하기</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 중앙 아이콘 영역 */}
        <View style={styles.iconContainer}>
          <View style={styles.iconBg}>
            <Heart size={40} color="#FF3B30" fill="#FF3B30" />
          </View>
        </View>

        {/* 타이틀 및 설명 */}
        <Text style={styles.title}>WelfareAI와 함께해 주세요</Text>
        <Text style={styles.description}>
          WelfareAI는 누구나 쉽고 편리하게 복지 서비스에 접근할 수 있도록 돕는
          비영리 오픈소스 플랫폼입니다.
        </Text>

        {/* 상세 안내 카드 */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Coffee size={20} color={Colors.point} style={styles.cardIcon} />
            <Text style={styles.cardText}>
              소중한 후원금은 서버 유지비, AI 토큰비, 개발 및 유지보수비 등으로
              사용됩니다.
            </Text>
          </View>

          <View style={[styles.cardRow, { marginTop: 16 }]}>
            <ShieldCheck size={20} color="#34C759" style={styles.cardIcon} />
            <Text style={styles.cardText}>
              안전한 서드파티 플랫폼을 통해 개인정보 노출 없이 마음을 전하실 수
              있습니다.
            </Text>
          </View>
        </View>

        {/* 외부 웹페이지 연결 버튼 */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleOpenWebPage}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>함께하러 가기</Text>
          <ExternalLink size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
        </TouchableOpacity>

        <Text style={styles.footerNotice}>
          * 버튼을 누르면 후원 웹페이지로 이동합니다.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  customHeader: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  scrollContent: {
    padding: 24,
    alignItems: "center",
  },
  iconContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  iconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFF0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 15,
    color: "#666666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
  },
  card: {
    width: "100%",
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  cardIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  cardText: {
    flex: 1,
    fontSize: 14,
    color: "#4A4A4A",
    lineHeight: 20,
  },
  primaryButton: {
    width: "100%",
    height: 52,
    backgroundColor: Colors.primary || "#007AFF",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.primary || "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  footerNotice: {
    fontSize: 12,
    color: "#999999",
    marginTop: 14,
    textAlign: "center",
  },
});
