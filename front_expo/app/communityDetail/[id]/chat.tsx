import { getChatMessages } from "@/api/community/getChatMessages";
import { getCommunityDetail } from "@/api/community/getCommunityDetail";
import { getMyInfo } from "@/api/user/getMyInfo";
import { ChatItem } from "@/components/ChatItem";
import Colors from "@/constants/Colors";
import { SOCKET_URL } from "@/constants/SOCKET_URL";
import { ChatMessage } from "@/types/community/ChatMessage";
import { UserProfile } from "@/types/user/UserProfile";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Send } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { io, Socket } from "socket.io-client";

export default function CommunityChatScreen() {
  const { id: postId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const flatListRef = useRef<FlatList>(null);
  const socketRef = useRef<Socket | null>(null);

  const [inputText, setInputText] = useState("");

  useEffect(() => {
    if (!postId) return;

    // 소켓 초기화 및 연결
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("joinRoom", { postId });
    });

    // 실시간 신규 메시지 수신
    socket.on("newMessage", (newMessage: ChatMessage) => {
      queryClient.setQueryData<ChatMessage[]>(
        ["chatMessages", postId],
        (old = []) => [...old, newMessage],
      );
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    // 실시간 메시지 삭제 수신
    socket.on("messageDeleted", ({ messageId }: { messageId: string }) => {
      queryClient.setQueryData<ChatMessage[]>(
        ["chatMessages", postId],
        (old = []) => old.filter((msg) => msg.id !== messageId),
      );
    });

    return () => {
      // 채팅방 퇴장 및 소켓 연결 해제
      socket.emit("leaveRoom", { postId });
      socket.disconnect();
    };
  }, [postId, queryClient]);

  //////////////////////////////////////////////////////////////////////////

  const { data: myInfo } = useQuery<UserProfile>({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
  });

  const currentUserId = myInfo?.id;

  //////////////////////////////////////////////////////////////////////////

  const { data: post } = useQuery({
    queryKey: ["communityDetail", postId],
    queryFn: () => getCommunityDetail(postId!),
    enabled: !!postId,
  });

  const postTitle = post?.title || "모임 대화방";

  //////////////////////////////////////////////////////////////////////////

  //  메시지 조회
  const {
    data: messages = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["chatMessages", postId],
    queryFn: () => getChatMessages(postId!),
    enabled: !!postId,
  });

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages.length]);

  //////////////////////////////////////////////////////////////////////////

  // 메시지 전송
  const handleSend = () => {
    if (!inputText.trim() || !postId || !socketRef.current) return;

    socketRef.current.emit("sendMessage", {
      postId,
      userId: currentUserId,
      message: inputText.trim(),
    });

    setInputText("");
  };

  //////////////////////////////////////////////////////////////////////////

  // 메시지 삭제
  const handleDelete = (messageId: string) => {
    Alert.alert("메시지 삭제", "이 메시지를 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => {
          if (postId && socketRef.current) {
            socketRef.current.emit("deleteMessage", {
              postId,
              userId: currentUserId,
              messageId,
            });
          }
        },
      },
    ]);
  };

  //////////////////////////////////////////////////////////////////////////

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"} // 👈 android는 'height' 적용
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#1A202C" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{postTitle}</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* 채팅 메시지 목록 */}
        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#FF6C4B" />
          </View>
        ) : isError ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>
              채팅 내역을 불러오지 못했습니다.
            </Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ChatItem
                item={item}
                currentUserId={currentUserId}
                handleDelete={handleDelete}
              />
            )}
            contentContainerStyle={styles.chatListContent}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: false })
            }
          />
        )}

        {/* 메시지 입력창 */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="메시지를 입력하세요."
            placeholderTextColor="#A0AEC0"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!inputText.trim()}
            activeOpacity={0.8}
          >
            <Send size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

//////////////////////////////////////////////////////////////////////////

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A202C",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#E53E3E",
    fontSize: 14,
  },
  chatListContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageRow: {
    marginBottom: 12,
    maxWidth: "80%",
  },
  myMessageRow: {
    alignSelf: "flex-end",
  },
  otherMessageRow: {
    alignSelf: "flex-start",
  },
  senderName: {
    fontSize: 12,
    color: "#718096",
    marginBottom: 4,
    marginLeft: 2,
  },
  messageBubbleContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
  },
  deleteButton: {
    padding: 4,
  },
  messageBubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  myBubble: {
    backgroundColor: "#FF6C4B",
    borderBottomRightRadius: 2,
  },
  otherBubble: {
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  myMessageText: {
    color: "#FFFFFF",
  },
  otherMessageText: {
    color: "#2D3748",
  },
  timeText: {
    fontSize: 10,
    color: "#A0AEC0",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    gap: 8,
    paddingBottom: -30,
  },
  textInput: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 15,
    color: "#1A202C",
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FF6C4B",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#CBD5E1",
  },

  otherMessageContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.inactive,
  },
  defaultProfileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EDF2F7",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
});
