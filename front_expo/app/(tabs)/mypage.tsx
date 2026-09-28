import Colors from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyPageScreen() {
  // 알림 설정 상태
  const [pushNotification, setPushNotification] = useState(true);
  const [dDayAlert, setDDayAlert] = useState(true);

  // 사용자 관심 카테고리 (예시)
  const [userCategories] = useState<string[]>([
    "생활지원",
    "주거",
    "청년",
    "일자리",
  ]);

  const handleEditProfile = () => {
    Alert.alert(
      "프로필 수정",
      "프로필 및 사용자 정보 수정 화면으로 이동합니다.",
    );
  };

  const handleCategorySetting = () => {
    Alert.alert(
      "관심 분야 설정",
      "관심 있는 복지 카테고리를 변경할 수 있습니다.",
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* 헤더 타이틀 */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <View style={styles.aiBadge}>
            <Feather name="settings" size={22} color={Colors.point} />
          </View>
          <Text style={styles.headerTitle}>환경 설정</Text>
        </View>
      </View>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* 프로필 카드 */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>김</Text>
          </View>
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>김성진</Text>
              <View style={styles.userBadge}>
                <Text style={styles.userBadgeText}>일반 회장</Text>
              </View>
            </View>
            <Text style={styles.userSubText}>관심 정책 알림 수신 중</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditProfile}
          >
            <Text style={styles.editButtonText}>수정</Text>
          </TouchableOpacity>
        </View>

        {/* 나의 활동 요약 (스크랩, 신청 내역 등) */}
        <View style={styles.statsContainer}>
          <TouchableOpacity style={styles.statItem} activeOpacity={0.7}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>스크랩 정책</Text>
          </TouchableOpacity>
          <View style={styles.statDivider} />
          <TouchableOpacity style={styles.statItem} activeOpacity={0.7}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>D-Day 알림</Text>
          </TouchableOpacity>
          <View style={styles.statDivider} />
          <TouchableOpacity style={styles.statItem} activeOpacity={0.7}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>최근 본 정책</Text>
          </TouchableOpacity>
        </View>

        {/* 관심 카테고리 섹션 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>나의 관심 카테고리</Text>
            <TouchableOpacity onPress={handleCategorySetting}>
              <Text style={styles.sectionAction}>설정</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tagContainer}>
            {userCategories.map((cate) => (
              <View key={cate} style={styles.tag}>
                <Text style={styles.tagText}>#{cate}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 서비스 설정 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>알림 설정</Text>
          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View>
                <Text style={styles.settingTitle}>맞춤 정책 혜택 알림</Text>
                <Text style={styles.settingDesc}>
                  새로운 관심 정책이 등록되면 알려드려요
                </Text>
              </View>
              <Switch
                value={pushNotification}
                onValueChange={setPushNotification}
                trackColor={{ false: "#e5e7eb", true: "#93c5fd" }}
                thumbColor={pushNotification ? "#2563eb" : "#f3f4f6"}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View>
                <Text style={styles.settingTitle}>신청 기한 D-Day 알림</Text>
                <Text style={styles.settingDesc}>
                  스크랩한 정책의 마감일을 놓치지 않게 알려드려요
                </Text>
              </View>
              <Switch
                value={dDayAlert}
                onValueChange={setDDayAlert}
                trackColor={{ false: "#e5e7eb", true: "#93c5fd" }}
                thumbColor={dDayAlert ? "#2563eb" : "#f3f4f6"}
              />
            </View>
          </View>
        </View>

        {/* 기타 정보 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>앱 정보 및 고객지원</Text>
          <View style={styles.menuCard}>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <Text style={styles.menuText}>공지사항</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <Text style={styles.menuText}>자주 묻는 질문 (FAQ)</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
              <Text style={styles.menuText}>약관 및 개인정보 처리방침</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <View style={styles.menuItem}>
              <Text style={styles.menuText}>앱 버전</Text>
              <Text style={styles.versionText}>v1.0.0</Text>
            </View>
          </View>
        </View>

        {/* 로그아웃 / 회원탈퇴 */}
        <View style={styles.footerButtons}>
          <TouchableOpacity activeOpacity={0.6}>
            <Text style={styles.footerButtonText}>로그아웃</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  container: {
    flex: 1,
    marginTop: 12,
    marginBottom: 90,
    backgroundColor: "#f8fafc",
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(26, 58, 58, 0.06)",
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  aiBadge: {
    width: 32,
    height: 32,
    borderRadius: 24,
    backgroundColor: "#FFEFEA",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A3A3A",
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.pointCard,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.point,
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  userName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1e293b",
  },
  userBadge: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  userBadgeText: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: "500",
  },
  userSubText: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 2,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.point,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#f1f5f9",
    height: "60%",
    alignSelf: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 10,
  },
  sectionAction: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: "600",
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: Colors.pointCard,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.pointCard,
  },
  tagText: {
    fontSize: 13,
    color: Colors.point,
    fontWeight: "500",
  },
  settingCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
  },
  settingDesc: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginVertical: 12,
  },
  menuCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  menuText: {
    fontSize: 14,
    color: "#334155",
    fontWeight: "500",
  },
  menuArrow: {
    fontSize: 16,
    color: "#94a3b8",
  },
  versionText: {
    fontSize: 13,
    color: "#94a3b8",
  },
  footerButtons: {
    alignItems: "center",
    marginTop: 8,
  },
  footerButtonText: {
    fontSize: 13,
    color: "#94a3b8",
    textDecorationLine: "underline",
  },
});
