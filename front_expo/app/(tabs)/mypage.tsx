import { removeAccessToken } from "@/api/token";
import { getMyInfo } from "@/api/user/getMyInfo";
import { BlockModal } from "@/components/BlockModal";
import { ProfileEditModal } from "@/components/ProfileEditModal"; // 경로에 맞춰 수정
import { ReportModal } from "@/components/ReportModal";
import Colors from "@/constants/Colors";
import { useDeleteAccount } from "@/hooks/user/useDeleteAccount";
import { useSaveProfile } from "@/hooks/user/useSaveProfile";
import { UserProfile } from "@/types/user/UserProfile";
import { handlePickProfileImage } from "@/utils/handlePickProfileImage";
import { handleTogglePush } from "@/utils/handleTogglePush";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import {
  Ban,
  Bell,
  Heart,
  Info,
  Settings,
  Siren,
  User,
  UserKey,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyPageScreen() {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [targetUserId, setTargetUserId] = useState<string>("");
  const [isPushEnabled, setIsPushEnabled] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

  useEffect(() => {
    const checkNotificationPermission = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      setIsPushEnabled(status === "granted");
    };

    checkNotificationPermission();
  }, []);

  ////////////////////////////////////////////////////////////////////////

  // 내 정보 조회
  const { data: myInfo, isPending: myInfoPending } = useQuery<UserProfile>({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
  });

  ////////////////////////////////////////////////////////////////////////

  // 모달 열기
  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  // 모달 닫기
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  ////////////////////////////////////////////////////////////////////////

  // 내 정보 수정하기
  const { saveProfile, isSaving } = useSaveProfile({
    onSuccessCallback: handleCloseEditModal,
  });

  const handleSaveProfile = (data: {
    nickname: string;
    imageUri?: string | null;
  }) => {
    saveProfile({
      nickname: data.nickname,
      selectedImageUri: data.imageUri ?? selectedImageUri,
      currentProfileImage: myInfo?.profileImage,
    });
  };

  const handleRemoveProfileImage = () => {
    setSelectedImageUri(null);
  };

  ////////////////////////////////////////////////////////////////////////

  // 회원 탈퇴하기
  const { mutate: deleteAccountMutation, isPending: deleteAccountPending } =
    useDeleteAccount();

  const handleDeleteAccount = () => {
    Alert.alert(
      "회원 탈퇴",
      "정말로 탈퇴하시겠습니까? 계정 정보는 복구할 수 없습니다.",
      [
        { text: "취소", style: "cancel" },
        {
          text: "탈퇴하기",
          style: "destructive",
          onPress: () => deleteAccountMutation(),
        },
      ],
    );
  };

  ////////////////////////////////////////////////////////////////////////

  // 로그아웃
  const onPressLogout = async () => {
    await removeAccessToken();
    router.replace("/(auth)/login");
  };

  const handleLogout = () => {
    Alert.alert("로그아웃", "정말 로그아웃 하시겠습니까? ", [
      { text: "취소", style: "cancel" },
      {
        text: "로그아웃",
        style: "destructive",
        onPress: onPressLogout,
      },
    ]);
  };

  ////////////////////////////////////////////////////////////////////////

  if (myInfoPending) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  // 모달 내 이미지 미리보기 경로
  const modalPreviewUri = selectedImageUri
    ? selectedImageUri
    : myInfo?.profileImage;

  ////////////////////////////////////////////////////////////////////////

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <View style={styles.aiBadge}>
            <Settings size={22} color="#FF7F66" />
          </View>
          <Text style={styles.headerTitle}>환경 설정</Text>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {/* 프로필 카드 */}
        <View style={styles.profileCard}>
          <TouchableOpacity
            style={styles.editProfileBtn}
            onPress={handleOpenEditModal}
          >
            <Text style={styles.editProfileBtnText}>변경하기</Text>
          </TouchableOpacity>

          <View style={styles.avatarWrapper}>
            {myInfo?.profileImage ? (
              <Image
                source={{ uri: myInfo.profileImage }}
                style={styles.avatarImage}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <User size={50} color={Colors.primary} />
              </View>
            )}
          </View>

          <View style={styles.profileDetails}>
            <View style={styles.readOnlyForm}>
              <View style={styles.nicknameRow}>
                <Text style={styles.nicknameText}>{myInfo?.nickname}</Text>
              </View>
            </View>
            <Text style={styles.emailText}>{myInfo?.email}</Text>
          </View>
        </View>

        {/* 알림 설정 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>앱 설정</Text>

          <View style={styles.card}>
            {/* 1. 메시지 알림 수신 */}
            <View style={styles.settingRow}>
              <View style={styles.leftContent}>
                <View style={styles.titleRow}>
                  <Bell
                    size={20}
                    color={Colors.warning}
                    style={styles.titleIcon}
                  />
                  <Text style={styles.settingTitle}>메시지 알림 수신</Text>
                </View>
                <Text style={styles.settingDesc}>
                  댓글 및 대화 알림을 받습니다
                </Text>
              </View>

              <Switch
                value={isPushEnabled}
                onValueChange={(val) => handleTogglePush(val, setIsPushEnabled)}
                trackColor={{
                  false: "#E0E0E0",
                  true: Colors.point,
                }}
                thumbColor={Platform.OS === "android" ? "#FFFFFF" : undefined}
                ios_backgroundColor="#E0E0E0"
              />
            </View>

            <View style={styles.divider} />

            {/* 2. 후원하기 */}
            <TouchableOpacity
              style={styles.settingRow}
              activeOpacity={0.7}
              onPress={() => {
                router.push("https://www.welfareai.co.kr/together");
              }}
            >
              <View style={styles.leftContent}>
                <View style={styles.titleRow}>
                  <Heart size={20} color="#fb2c36" style={styles.titleIcon} />
                  <Text style={styles.settingTitle}>함께하기</Text>
                </View>
                <Text style={styles.settingDesc}>
                  서비스 운영과 발전에 함께합니다.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#CBD5E0" />
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* 3. 신고하기 */}
            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => setIsReportModalOpen(true)}
              activeOpacity={0.7}
            >
              <View style={styles.leftContent}>
                <View style={styles.titleRow}>
                  <Siren size={20} color="red" style={styles.titleIcon} />
                  <Text style={styles.settingTitle}>신고하기</Text>
                </View>
                <Text style={styles.settingDesc}>
                  악성 댓글 및 대화를 신고합니다.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#CBD5E0" />
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* 4. 차단하기 */}
            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => setIsBlockModalOpen(true)}
              activeOpacity={0.7}
            >
              <View style={styles.leftContent}>
                <View style={styles.titleRow}>
                  <Ban size={20} color="#718096" style={styles.titleIcon} />
                  <Text style={styles.settingTitle}>차단하기</Text>
                </View>
                <Text style={styles.settingDesc}>
                  악성 댓글 및 대화를 차단합니다.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#CBD5E0" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => router.push("https://www.welfareai.co.kr/terms")}
              activeOpacity={0.7}
            >
              <View style={styles.leftContent}>
                <View style={styles.titleRow}>
                  <Info
                    size={20}
                    color={Colors.point}
                    style={styles.titleIcon}
                  />
                  <Text style={styles.settingTitle}>서비스 이용약관</Text>
                </View>
                <Text style={styles.settingDesc}>
                  이용약관에 대해 살펴봅니다.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#CBD5E0" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => router.push("https://www.welfareai.co.kr/privacy")}
              activeOpacity={0.7}
            >
              <View style={styles.leftContent}>
                <View style={styles.titleRow}>
                  <UserKey
                    size={20}
                    color={"#193cb8"}
                    style={styles.titleIcon}
                  />
                  <Text style={styles.settingTitle}>개인정보 처리방침</Text>
                </View>
                <Text style={styles.settingDesc}>
                  개인정보 처리에 대해 살펴봅니다.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#CBD5E0" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 계정 관리 */}
        <View style={styles.accountActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>로그아웃</Text>
          </TouchableOpacity>
          <Text style={styles.actionDivider}>|</Text>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={handleDeleteAccount}
            disabled={deleteAccountPending}
          >
            <Text style={styles.deleteAccountText}>회원탈퇴</Text>
          </TouchableOpacity>
        </View>

        <BlockModal
          visible={isBlockModalOpen}
          onClose={() => setIsBlockModalOpen(false)}
        />

        <ReportModal
          visible={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          reportedUserId={targetUserId}
        />

        {/* 프로필 수정 모달 */}
        <ProfileEditModal
          visible={isEditModalOpen}
          initialNickname={myInfo?.nickname ?? ""}
          initialAvatarUri={myInfo?.profileImage}
          selectedImageUri={selectedImageUri}
          isLoading={myInfoPending}
          onClose={handleCloseEditModal}
          onPickImage={() => handlePickProfileImage(setSelectedImageUri)}
          onSave={handleSaveProfile}
          onRemoveImage={handleRemoveProfileImage}
          onPending={isSaving}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

////////////////////////////////////////////////////////////////////////

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(26, 58, 58, 0.06)",
    backgroundColor: "#f8fafc",
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
    fontSize: 21,
    fontWeight: "700",
    color: "#0f172a",
  },
  profileCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarWrapper: {
    marginBottom: 12,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2563eb",
  },
  profileDetails: {
    width: "100%",
  },
  emailText: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 8,
  },
  readOnlyForm: {
    alignItems: "center",
  },
  nicknameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  nicknameText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  editProfileBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  editProfileBtnText: {
    fontSize: 11,
    color: "#475569",
    fontWeight: "600",
  },
  bioText: {
    fontSize: 13,
    color: "#475569",
    textAlign: "center",
    marginTop: 2,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#475569",
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
    marginHorizontal: 6,
    marginVertical: 8,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14.5,
  },
  leftContent: {
    flex: 1,
    marginRight: 12,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  titleIcon: {
    marginLeft: 8,
    marginRight: 6,
  },
  settingTitle: {
    fontSize: 15,

    fontWeight: "600",
    color: "#1A202C",
  },
  settingDesc: {
    fontSize: 12,
    marginLeft: 10,
    color: "#718096",
    lineHeight: 16,
  },

  divider: {
    height: 1,
    backgroundColor: "#EDF2F7",
    width: "100%",
  },
  accountActions: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginTop: Platform.OS === "ios" ? 3 : -1,
  },
  actionBtn: {
    padding: 6,
  },
  actionDivider: {
    color: "#cbd5e1",
  },
  logoutText: {
    fontSize: 13,
    color: "#64748b",
    textDecorationLine: "underline",
  },
  deleteAccountText: {
    fontSize: 13,
    color: "#ef4444",
    textDecorationLine: "underline",
  },

  /* 모달 스타일 */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 16,
    textAlign: "center",
  },
  modalAvatarWrapper: {
    alignSelf: "center",
    position: "relative",
    marginBottom: 16,
  },
  modalAvatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  modalAvatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraBadge: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 5,
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  cameraIcon: {
    fontSize: 12,
  },
  modalInputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#0f172a",
  },
  bioInput: {
    height: 80,
    textAlignVertical: "top",
  },
  modalActionButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  modalCancelBtn: {
    backgroundColor: "#f1f5f9",
  },
  modalCancelBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  modalSaveBtn: {
    backgroundColor: Colors.point,
  },
  modalSaveBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
});
