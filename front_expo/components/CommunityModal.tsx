import Colors from "@/constants/Colors";
import { CommunityModalProps } from "@/types/community/CommunityModalProps";
import { HeartHandshake, MessagesCircle, X } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";



export default function CommunityModal({
  modalType,
  visible,
  onClose,
  title,
  setTitle,
  content,
  setContent,
  notice,
  setNotice,
  communityType,
  setCommunityType,
  createCommunityPending = false,
  handleCreateCommunity,
}: CommunityModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardAvoidingContainer}
        >
          <View style={styles.modalContentCard}>
            {/* 헤더 */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {modalType === "tabs" ? "모임 만들기" : "모임 수정하기"}
              </Text>
              <TouchableOpacity
                style={styles.closeIconButton}
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X size={20} color="#666666" />
              </TouchableOpacity>
            </View>

            {/* 폼 콘텐츠 */}
            <ScrollView
              contentContainerStyle={styles.modalContentInner}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {modalType === "tabs" && setCommunityType && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>모임 성격</Text>
                  <View style={styles.typeSelectorRow}>
                    <TouchableOpacity
                      style={[
                        styles.typeOptionCard,
                        communityType === "SELF_HELP" &&
                          styles.typeOptionCardActive,
                      ]}
                      activeOpacity={0.8}
                      onPress={() => setCommunityType("SELF_HELP")}
                    >
                      <MessagesCircle
                        size={18}
                        color={
                          communityType === "SELF_HELP" ? "#FF6C4B" : "#8E99A3"
                        }
                      />
                      <Text
                        style={[
                          styles.typeOptionText,
                          communityType === "SELF_HELP" &&
                            styles.typeOptionTextActive,
                        ]}
                      >
                        소통 모임
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.typeOptionCard,
                        communityType === "VOLUNTEER" &&
                          styles.typeOptionCardActive,
                      ]}
                      activeOpacity={0.8}
                      onPress={() => setCommunityType("VOLUNTEER")}
                    >
                      <HeartHandshake
                        size={18}
                        color={
                          communityType === "VOLUNTEER" ? "#FF6C4B" : "#8E99A3"
                        }
                      />
                      <Text
                        style={[
                          styles.typeOptionText,
                          communityType === "VOLUNTEER" &&
                            styles.typeOptionTextActive,
                        ]}
                      >
                        봉사 모임
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* 2. 모임 제목 */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>제목</Text>
                <TextInput
                  style={styles.input}
                  placeholder="예: 치매 어르신 가족 소통방"
                  placeholderTextColor="#A0A0A0"
                  value={title}
                  onChangeText={setTitle}
                />
              </View>

              {/* 3. 상세 내용 */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>내용</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="모임 내용에 대해 적어주세요."
                  placeholderTextColor="#A0A0A0"
                  multiline
                  textAlignVertical="top"
                  value={content}
                  onChangeText={setContent}
                />
              </View>

              {modalType === "detail" && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>공지사항</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="공지사항에 대해 입력해주세요."
                    placeholderTextColor="#A0A0A0"
                    multiline
                    textAlignVertical="top"
                    value={notice}
                    onChangeText={setNotice}
                  />
                </View>
              )}

              {/* 버튼 영역 */}
              <View style={styles.modalButtonRow}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={onClose}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelButtonText}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    createCommunityPending && styles.disabledButton,
                  ]}
                  onPress={handleCreateCommunity}
                  disabled={createCommunityPending}
                  activeOpacity={0.7}
                >
                  {createCommunityPending ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.submitButtonText}>
                      {modalType === "tabs" ? "개설하기" : "보완하기"}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  keyboardAvoidingContainer: {
    width: "90%",
    maxHeight: "85%",
  },
  modalContentCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  closeIconButton: {
    padding: 4,
  },
  modalContentInner: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 6,
  },
  imageCountText: {
    fontSize: 12,
    marginLeft: 5,
    color: "#8E8E93",
  },
  input: {
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#1A1A1A",
  },
  textArea: {
    height: 100,
  },
  locationInputRow: {
    flexDirection: "row",
    gap: 8,
  },
  locationBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6E8B8B",
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  locationBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  imagePickerRow: {
    flexDirection: "row",
    gap: 10,
  },
  addImageBtn: {
    width: 68,
    height: 68,
    borderRadius: 8,
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
  },
  addImageText: {
    fontSize: 11,
    color: "#6E8B8B",
    marginTop: 4,
  },
  modalButtonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  cancelButton: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#64748B",
    fontWeight: "600",
    fontSize: 15,
  },
  submitButton: {
    flex: 3,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },
  disabledButton: {
    backgroundColor: "#CBD5E1",
  },
  typeSelectorRow: {
    flexDirection: "row",
    gap: 8,
  },
  typeOptionCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#F2F5F6",
    borderWidth: 1.5,
    borderColor: "transparent",
    gap: 6,
  },
  typeOptionCardActive: {
    backgroundColor: "#FFEFEA",
    borderColor: "#FF6C4B",
  },
  typeOptionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8E99A3",
  },
  typeOptionTextActive: {
    color: "#FF6C4B",
    fontWeight: "700",
  },
});
