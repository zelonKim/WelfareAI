import { REPORT_REASONS } from "@/constants/REPORT_REASONS";
import { useCreateReport } from "@/hooks/report/useCreateReport";
import { ReportReason } from "@/types/report/CreateReportPayload";
import { ReportModalProps } from "@/types/report/ReportModalProps";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export const ReportModal: React.FC<ReportModalProps> = ({
  visible,
  onClose,
  initialUserName = "",
}) => {
  const [reportedUserName, setReportedUserName] = useState(initialUserName);
  const [selectedReason, setSelectedReason] = useState<ReportReason>("SPAM");
  const [details, setDetails] = useState("");

  const resetAndClose = () => {
    setReportedUserName(initialUserName);
    setSelectedReason("SPAM");
    setDetails("");
    onClose();
  };

  const { mutate: createReport, isPending } = useCreateReport(() => {
    resetAndClose();
  });

  const handleSubmit = () => {
    if (!reportedUserName.trim()) {
      Alert.alert("알림", "신고할 대상자의 이름을 입력해주세요.");
      return;
    }

    if (!details.trim()) {
      Alert.alert("알림", "상세 신고 내용을 입력해주세요.");
      return;
    }
    createReport({
      reportedUserName: reportedUserName.trim(),
      reason: selectedReason,
      details: details.trim(),
    });
  };

  ////////////////////////////////////////////////////////////////////////
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={resetAndClose}
    >
      <View style={modalStyles.overlay}>
        {/* 바깥 배경 클릭 시에만 키보드 닫기 */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={StyleSheet.absoluteFillObject} />
        </TouchableWithoutFeedback>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={modalStyles.keyboardView}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
          <View style={modalStyles.container}>
            <Text style={modalStyles.title}>🚨 신고하기</Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardDismissMode="none" // 스크롤 시 키보드 해제 방지
              keyboardShouldPersistTaps="always" // 스크롤/터치 시 키보드 유지
              nestedScrollEnabled={true}
            >
              {/* 1. 신고 대상자 이름 입력 영역 */}
              <Text style={modalStyles.label}>신고 대상</Text>
              <TextInput
                style={modalStyles.nameInput}
                placeholder="신고할 대상자의 이름"
                placeholderTextColor="#999"
                value={reportedUserName}
                onChangeText={setReportedUserName}
              />

              {/* 2. 신고 사유 선택 영역 */}
              <Text style={modalStyles.label}>신고 사유 선택</Text>
              {REPORT_REASONS.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    modalStyles.reasonOption,
                    selectedReason === item.value && modalStyles.reasonSelected,
                  ]}
                  onPress={() => setSelectedReason(item.value)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      modalStyles.reasonText,
                      selectedReason === item.value &&
                        modalStyles.reasonSelectedText,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}

              {/* 3. 상세 내용 입력 영역 */}
              <Text style={modalStyles.label}>상세 내용 입력</Text>
              <TextInput
                style={modalStyles.input}
                multiline
                numberOfLines={4}
                placeholder="신고 사유를 상세하게 작성해주세요."
                placeholderTextColor="#999"
                value={details}
                onChangeText={setDetails}
                textAlignVertical="top"
                scrollEnabled={false}
              />
            </ScrollView>

            {/* 하단 버튼 영역 */}
            <View style={modalStyles.buttonContainer}>
              <TouchableOpacity
                style={[modalStyles.button, modalStyles.cancelButton]}
                onPress={resetAndClose}
                disabled={isPending}
              >
                <Text style={modalStyles.cancelButtonText}>취소</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[modalStyles.button, modalStyles.submitButton]}
                onPress={handleSubmit}
                disabled={isPending}
              >
                {isPending ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={modalStyles.submitButtonText}>접수하기</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

////////////////////////////////////////////////////////////////////////

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  keyboardView: {
    width: "90%",
    maxHeight: "80%",
  },
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    width: "100%",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A202C",
    marginBottom: 16,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2D3748",
    marginTop: 12,
    marginBottom: 6,
  },
  nameInput: {
    backgroundColor: "#F7FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#1A202C",
  },
  reasonOption: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "#F7FAFC",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 6,
  },
  reasonSelected: {
    backgroundColor: "#fff3f3",
    borderColor: "#E53E3E",
  },
  reasonText: {
    fontSize: 13,
    color: "#4A5568",
  },
  reasonSelectedText: {
    color: "#E53E3E",
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#F7FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#1A202C",
    minHeight: 90,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#EDF2F7",
  },
  cancelButtonText: {
    color: "#4A5568",
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#E53E3E",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
