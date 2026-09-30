import { Colors } from "@/constants/Colors"; // 프로젝트 컬러 상수 경로
import { User } from "lucide-react-native"; // 또는 사용 중이신 아이콘 라이브러리
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ProfileEditModalProps {
  visible: boolean;
  initialNickname: string;
  initialAvatarUri?: string | null;
  isLoading: boolean;
  onClose: () => void;
  onPickImage: () => void;
  onSave: (data: { nickname: string; imageUri?: string | null }) => void;
  onPending: boolean;
  selectedImageUri?: string | null;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  visible,
  initialNickname,
  initialAvatarUri,
  isLoading,
  onClose,
  onPickImage,
  onSave,
  onPending,
  selectedImageUri,
}) => {
  const [nicknameInput, setNicknameInput] = useState(initialNickname);

  // 모달이 열릴 때 기존 닉네임으로 초기화
  useEffect(() => {
    if (visible) {
      setNicknameInput(initialNickname);
    }
  }, [visible, initialNickname]);

  const handleSave = () => {
    if (!nicknameInput.trim()) return;
    onSave({ nickname: nicknameInput.trim(), imageUri: selectedImageUri });
  };

  // 현재 표시할 이미지 URI (새로 선택한 이미지 > 기존 이미지)
  const displayAvatarUri = selectedImageUri || initialAvatarUri;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        {/* 바깥 어두운 배경 터치 시 모달 닫기 */}
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>내 정보 변경</Text>

          {/* 프로필 이미지 선택 */}
          <TouchableOpacity
            style={styles.modalAvatarWrapper}
            onPress={onPickImage}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            {displayAvatarUri ? (
              <Image
                source={{ uri: displayAvatarUri }}
                style={styles.modalAvatarImage}
              />
            ) : (
              <View style={styles.modalAvatarPlaceholder}>
                <User size={50} color={Colors.primary} />
              </View>
            )}
            <View style={styles.cameraBadge}>
              <Text style={styles.cameraIcon}>📷</Text>
            </View>
          </TouchableOpacity>

          {/* 닉네임 입력 영역 */}
          <View style={styles.modalInputGroup}>
            <Text style={styles.label}>닉네임</Text>
            <TextInput
              style={styles.input}
              value={nicknameInput}
              onChangeText={setNicknameInput}
              placeholder="닉네임 (2~12자)"
              maxLength={12}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          {/* 버튼 영역 */}
          <View style={styles.modalActionButtons}>
            <TouchableOpacity
              style={[styles.modalBtn, styles.modalCancelBtn]}
              onPress={onClose}
              disabled={onPending}
            >
              <Text style={styles.modalCancelBtnText}>취소</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalBtn, styles.modalSaveBtn]}
              onPress={handleSave}
              disabled={!nicknameInput.trim() || onPending}
            >
              {onPending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.modalSaveBtnText}>변경하기</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

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
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0f172a",
    marginVertical: 16,
  },
  profileCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
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
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
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
    paddingVertical: 10,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1e293b",
  },
  settingDesc: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  accountActions: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginTop: 12,
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
