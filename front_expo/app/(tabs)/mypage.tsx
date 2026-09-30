import { client } from "@/api/client";
import { deleteTokenFromServer } from "@/api/common/deleteTokenFromServer";
import { saveTokenToServer } from "@/api/common/saveTokenToServer";
import { removeAccessToken } from "@/api/token";
import { getMyInfo } from "@/api/user/getMyInfo";
import { BlockModal } from "@/components/BlockModal";
import { ProfileEditModal } from "@/components/ProfileEditModal"; // 경로에 맞춰 수정
import { ReportModal } from "@/components/ReportModal";
import Colors from "@/constants/Colors";
import { UserProfile } from "@/types/user/UserProfile";
import { registerForPushNotificationsAsync } from "@/utils/registerForPushNotificationsAsync";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { Settings, User } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface UpdateProfileDto {
  profileImage?: string;
  nickname?: string;
}

////////////////////////////////////////////////////////////////////////

export default function MyPageScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // 모달 상태 및 모달 내 입력값 상태
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [nicknameInput, setNicknameInput] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [targetUserId, setTargetUserId] = useState<string>("");
  const [isPushEnabled, setIsPushEnabled] = useState(false);

  // 모달 안에서 임시로 선택된 이미지 객체
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

  useEffect(() => {
    const checkNotificationPermission = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      setIsPushEnabled(status === "granted");
    };

    checkNotificationPermission();
  }, []);

  // 내 정보 조회 (useQuery)
  const { data: myInfo, isPending: myInfoPending } = useQuery<UserProfile>({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
  });

  useEffect(() => {
    if (myInfo) {
      setNicknameInput(myInfo.nickname || "");
      setProfileImage(myInfo.profileImage || "");
    }
  }, [myInfo]);

  ////////////////////////////////////////////////////////////////////////

  // 모달 열기
  const handleOpenEditModal = () => {
    setNicknameInput(myInfo?.nickname || "");
    setProfileImage(myInfo?.profileImage || "");
    setSelectedImageUri(null); // 선택했던 임시 이미지 초기화
    setIsEditModalOpen(true);
  };

  // 모달 닫기
  const handleCloseEditModal = () => {
    setSelectedImageUri(null);
    setIsEditModalOpen(false);
  };

  ////////////////////////////////////////////////////////////////////////

  // 2. 모달 내에서 이미지 고르기 (업로드는 하지 않고, 미리보기만 설정)
  const handlePickModalImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("권한 필요", "사진첩 접근 권한이 필요합니다.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImageUri(result.assets[0].uri);
    }
  };

  ////////////////////////////////////////////////////////////////////////

  // 3. 프로필 수정 Mutation
  const { mutate: updateProfileMutation, isPending: updateProfilePending } =
    useMutation({
      mutationFn: async (dto: UpdateProfileDto) => {
        const res = await client.patch("/user/profile", dto);
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["myInfo"] });
        handleCloseEditModal();
        Alert.alert("성공", "프로필이 변경되었습니다.");
      },
      onError: (error: any) => {
        Alert.alert(
          "오류",
          error?.response?.data?.message || "프로필 변경에 실패했습니다.",
        );
      },
    });

  ////////////////////////////////////////////////////////////////////////

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async () => {
    if (nicknameInput.trim().length < 2 || nicknameInput.trim().length > 12) {
      Alert.alert("알림", "닉네임은 2~12자 사이로 입력해 주세요.");
      return;
    }

    try {
      setIsSaving(true);
      let uploadedImageUrl = myInfo?.profileImage || undefined;

      // 새 이미지가 선택되어 있다면 백엔드로 업로드 (POST /user/image)
      if (selectedImageUri) {
        const formData = new FormData();
        const filename = selectedImageUri.split("/").pop() || "profile.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        formData.append("image", {
          uri: selectedImageUri,
          name: filename,
          type,
        } as any);

        const imageRes = await client.post("/user/image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (imageRes.data?.imageUrl) {
          uploadedImageUrl = imageRes.data.imageUrl;
        }
      }

      // 프로필 정보 서버로 전송
      updateProfileMutation({
        nickname: nicknameInput.trim(),
        profileImage: uploadedImageUrl,
      });
    } catch (error) {
      Alert.alert("오류", "이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  ////////////////////////////////////////////////////////////////////////

  // 푸시 알림 토글
  const handleTogglePush = async (value: boolean) => {
    setIsPushEnabled(value);

    if (value) {
      const { status } = await Notifications.getPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "알림 권한 필요",
          "메시지 알림을 받으려면 기기 설정에서 알림 권한을 허용해 주세요.",
          [
            { text: "취소", style: "cancel" },
            { text: "설정으로 이동", onPress: () => Linking.openSettings() },
          ],
        );
        setIsPushEnabled(false);
        return;
      }

      // 권한이 정상이라면 토큰 다시 발급받아 서버에 저장
      const token = await registerForPushNotificationsAsync();
      if (token) await saveTokenToServer(token);
    } else {
      await deleteTokenFromServer();
    }
  };

  ////////////////////////////////////////////////////////////////////////

  // 회원 탈퇴 Mutation
  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      const res = await client.delete("/user/account");
      return res.data;
    },
    onSuccess: async () => {
      Alert.alert("완료", "회원 탈퇴가 처리되었습니다.");
      queryClient.clear();
      await removeAccessToken();
      router.replace("/(auth)/login");
    },
    onError: () => {
      Alert.alert("오류", "회원 탈퇴 처리 중 오류가 발생했습니다.");
    },
  });

  // 회원 탈퇴 핸들러
  const handleDeleteAccount = () => {
    Alert.alert(
      "회원 탈퇴",
      "정말로 탈퇴하시겠습니까? 계정 정보는 복구할 수 없습니다.",
      [
        { text: "취소", style: "cancel" },
        {
          text: "탈퇴하기",
          style: "destructive",
          onPress: () => deleteAccountMutation.mutate(),
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
                {/* 아이콘 + 제목을 가로 한 줄로 배치 */}
                <View style={styles.titleRow}>
                  <Ionicons
                    name="notifications-outline"
                    size={20}
                    color={Colors.primary}
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
                onValueChange={handleTogglePush}
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
              onPress={() => {}}
              activeOpacity={0.7}
            >
              <View style={styles.leftContent}>
                <View style={styles.titleRow}>
                  <Ionicons
                    name="heart-outline"
                    size={20}
                    color="#E53E3E"
                    style={styles.titleIcon}
                  />
                  <Text style={styles.settingTitle}>후원하기</Text>
                </View>
                <Text style={styles.settingDesc}>
                  서비스 운영을 위해 후원합니다.
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
                  <Ionicons
                    name="warning-outline"
                    size={20}
                    color="#DD6B20"
                    style={styles.titleIcon}
                  />
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
                  <Ionicons
                    name="ban-outline"
                    size={20}
                    color="#718096"
                    style={styles.titleIcon}
                  />
                  <Text style={styles.settingTitle}>차단하기</Text>
                </View>
                <Text style={styles.settingDesc}>
                  악성 댓글 및 대화를 차단합니다.
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
            disabled={deleteAccountMutation.isPending}
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

        {/* 프로필 수정 모달 (이미지 + 닉네임) */}
        <ProfileEditModal
          visible={isEditModalOpen}
          initialNickname={myInfo?.nickname ?? ""}
          initialAvatarUri={myInfo?.profileImage}
          selectedImageUri={selectedImageUri}
          isLoading={myInfoPending}
          onClose={handleCloseEditModal}
          onPickImage={handlePickModalImage}
          onSave={handleSaveProfile}
          onPending={updateProfilePending}
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
  // 큰제목 + 아이콘 한 줄 배치
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4, // 부제목과의 간격
  },
  titleIcon: {
    marginLeft: 8,
    marginRight: 6, // 아이콘과 제목 글자 사이 간격
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
  // 끊기지 않고 가로로 길게 이어지는 디바이더
  divider: {
    height: 1,
    backgroundColor: "#EDF2F7",
    width: "100%", // 좌우 여백 없이 카드 내부 전체 폭을 채움
  },
  accountActions: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginTop: Platform.OS === "ios" ? 3 : -12,
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
