import Colors from "@/constants/Colors";
import { Camera, MapPin, X } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ImageItem } from "./ImageItem";

interface CrisisReportModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  setTitle: (text: string) => void;
  content: string;
  setContent: (text: string) => void;
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  setLatitude: React.Dispatch<React.SetStateAction<number | undefined>>;
  setLongitude: React.Dispatch<React.SetStateAction<number | undefined>>;
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  uploadImageMutation: any;
  uploadImagePending?: boolean;
  createReportPending?: boolean;
  handleGetCurrentLocation: (setters: {
    setLatitude: React.Dispatch<React.SetStateAction<number | undefined>>;
    setLongitude: React.Dispatch<React.SetStateAction<number | undefined>>;
    setAddress: React.Dispatch<React.SetStateAction<string>>;
  }) => void;
  handlePickImage: (props: {
    setImages: React.Dispatch<React.SetStateAction<string[]>>;
    uploadImageMutation: any;
  }) => void;
  handleRemoveImage: (index: number) => void;
  handleCreateReport: () => void;
}

export default function CrisisReportModal({
  visible,
  onClose,
  title,
  setTitle,
  content,
  setContent,
  address,
  setAddress,
  setLatitude,
  setLongitude,
  images,
  setImages,
  uploadImageMutation,
  uploadImagePending = false,
  createReportPending = false,
  handleGetCurrentLocation,
  handlePickImage,
  handleRemoveImage,
  handleCreateReport,
}: CrisisReportModalProps) {
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
              <Text style={styles.modalTitle}>위기 이웃 제보하기</Text>
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
              {/* 1. 제보 제목 */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>제목</Text>
                <TextInput
                  style={styles.input}
                  placeholder="예: 단전/단수가 의심되는 가구 제보"
                  placeholderTextColor="#A0A0A0"
                  value={title}
                  onChangeText={setTitle}
                />
              </View>

              {/* 2. 상세 내용 */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>상세 내용</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="위기 상황에 대해 자세히 적어주세요."
                  placeholderTextColor="#A0A0A0"
                  multiline
                  textAlignVertical="top"
                  value={content}
                  onChangeText={setContent}
                />
              </View>

              {/* 3. 위치 정보 */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>위치</Text>
                <View style={styles.locationInputRow}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="위치를 입력해주세요"
                    placeholderTextColor="#A0A0A0"
                    value={address}
                    onChangeText={setAddress}
                  />
                  <TouchableOpacity
                    style={styles.locationBtn}
                    onPress={() =>
                      handleGetCurrentLocation({
                        setLatitude,
                        setLongitude,
                        setAddress,
                      })
                    }
                    activeOpacity={0.7}
                  >
                    <MapPin size={16} color="#FFFFFF" />
                    <Text style={styles.locationBtnText}>현위치</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* 4. 사진 업로드 */}
              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>현장 사진 </Text>
                  <Text style={styles.label}>({images.length})</Text>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.imagePickerRow}
                >
                  <TouchableOpacity
                    disabled={uploadImagePending}
                    onPress={() =>
                      handlePickImage({
                        setImages,
                        uploadImageMutation,
                      })
                    }
                    style={styles.addImageBtn}
                    activeOpacity={0.7}
                  >
                    {uploadImagePending ? (
                      <ActivityIndicator size="small" color="#6E8B8B" />
                    ) : (
                      <>
                        <Camera size={22} color="#6E8B8B" />
                        <Text style={styles.addImageText}>사진 추가</Text>
                      </>
                    )}
                  </TouchableOpacity>

                  {images.map((uri, index) => (
                    <ImageItem
                      key={`${uri}-${index}`}
                      uri={uri}
                      onRemove={() => handleRemoveImage(index)}
                    />
                  ))}
                </ScrollView>
              </View>

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
                    createReportPending && styles.disabledButton,
                  ]}
                  onPress={handleCreateReport}
                  disabled={createReportPending}
                  activeOpacity={0.7}
                >
                  {createReportPending ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.submitButtonText}>제출하기</Text>
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
    flex: 1,
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
    flex: 2,
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
});
