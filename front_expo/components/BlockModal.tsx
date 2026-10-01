import { getBlockedUsers } from "@/api/block/getBlockedUsers";
import Colors from "@/constants/Colors";
import { useBlockUser } from "@/hooks/block/useBlockUser";
import { useUnblockUser } from "@/hooks/block/useUnblockUser";
import { BlockedItem } from "@/types/block/BlockedItem";
import { BlockModalProps } from "@/types/block/BlockModalProps";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { User } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

export const BlockModal: React.FC<BlockModalProps> = ({ visible, onClose }) => {
  const [usernameInput, setUsernameInput] = useState("");

  const { data: blockedList = [], isLoading } = useQuery<BlockedItem[]>({
    queryKey: ["blockedUsers"],
    queryFn: getBlockedUsers,
    enabled: !!visible,
  });

  ////////////////////////////////////////////////////////////////////////

  const { mutate: blockUserMutation, isPending: blockUserPending } =
    useBlockUser();

  // 신규 차단 제출
  const handleBlockSubmit = () => {
    const trimmedUsername = usernameInput.trim();
    if (!trimmedUsername) {
      Alert.alert("알림", "차단할 유저의 별명을 입력해주세요.");
      return;
    }
    blockUserMutation(trimmedUsername, {
      onSuccess: () => {
        setUsernameInput("");
        Alert.alert("완료", `'${trimmedUsername}' 님을 차단했습니다.`);
      },
    });
  };

  ////////////////////////////////////////////////////////////////////////

  const { mutate: unblockUserMutation, isPending: unblockUserPending } =
    useUnblockUser();

  // 차단 해제 클릭
  const handleUnblock = (blockedId: string, username: string) => {
    Alert.alert("차단 해제", `'${username}' 님의 차단을 해제하시겠습니까?`, [
      { text: "취소", style: "cancel" },
      {
        text: "해제",
        style: "destructive",
        onPress: () => {
          unblockUserMutation(blockedId);
        },
      },
    ]);
  };

  ////////////////////////////////////////////////////////////////////////

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={modalStyles.overlay}>
        {/* 바깥 배경 터치 시 키보드/모달 닫기 */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={StyleSheet.absoluteFillObject} />
        </TouchableWithoutFeedback>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={modalStyles.keyboardView}
        >
          <View style={modalStyles.container}>
            {/* 모달 헤더 */}
            <View style={modalStyles.header}>
              <Text style={modalStyles.title}>🚫 차단 관리</Text>

              <TouchableOpacity
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={22} color="#718096" />
              </TouchableOpacity>
            </View>

            {/* 별명 입력 & 차단하기 영역 */}
            <Text style={modalStyles.label}>유저 차단하기</Text>
            <View style={modalStyles.inputRow}>
              <TextInput
                style={modalStyles.input}
                placeholder="차단할 유저 별명 입력"
                placeholderTextColor="#A0AEC0"
                value={usernameInput}
                onChangeText={setUsernameInput}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={modalStyles.blockButton}
                onPress={handleBlockSubmit}
                disabled={blockUserPending}
              >
                {blockUserPending ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <Text style={modalStyles.blockButtonText}>차단하기</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* 차단된 유저 목록 영역 */}
            <Text style={[modalStyles.label, { marginTop: 16 }]}>
              차단된 유저 목록 ({blockedList.length})
            </Text>
            {isLoading ? (
              <ActivityIndicator style={{ marginVertical: 20 }} />
            ) : (
              <FlatList
                data={blockedList}
                keyExtractor={(item) => item.id}
                style={modalStyles.list}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="always"
                ListEmptyComponent={
                  <Text style={modalStyles.emptyText}>
                    차단된 유저가 없습니다.
                  </Text>
                }
                renderItem={({ item }) => (
                  <View style={modalStyles.listItem}>
                    <View style={modalStyles.userInfo}>
                      <View style={modalStyles.avatarWrapper}>
                        {item.blockedUser.profileImage ? (
                          <Image
                            source={{ uri: item.blockedUser.profileImage }}
                            style={modalStyles.avatarImage}
                          />
                        ) : (
                          <View style={modalStyles.avatarPlaceholder}>
                            <User size={20} color={Colors.primary} />
                          </View>
                        )}
                      </View>
                      <Text style={modalStyles.username}>
                        {item.blockedUser.nickname}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={modalStyles.unblockButton}
                      onPress={() =>
                        handleUnblock(item.blockedId, item.blockedUser.nickname)
                      }
                    >
                      <Text style={modalStyles.unblockButtonText}>
                        해제하기
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            )}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(26, 58, 58, 0.06)",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A202C",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2D3748",
    marginTop: 8,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: "#F7FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#1A202C",
  },
  blockButton: {
    backgroundColor: "#E53E3E",
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  blockButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  list: {
    maxHeight: 240,
  },
  emptyText: {
    textAlign: "center",
    backgroundColor: "#F7FAFC",

    color: "#A0AEC0",
    borderRadius: 8,
    fontSize: 13,
    paddingVertical: 22,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF2F7",
    backgroundColor: "#F7FAFC",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  username: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2D3748",
  },
  unblockButton: {
    backgroundColor: "#EDF2F7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  unblockButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4A5568",
  },
  avatarWrapper: {
    marginBottom: 3,
    marginLeft: 2,
  },
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 40,
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#f6e6e6",
    marginVertical: 16,
  },
});
