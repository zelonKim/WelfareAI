import { getConsultings } from "@/api/consult/getConsultings";
import { AutoPrompts } from "@/constants/AutoPrompts";
import Colors from "@/constants/Colors";
import { useCreateConsulting } from "@/hooks/consult/useCreateConsulting";
import { useDeleteConsulting } from "@/hooks/consult/useDeleteConsulting";
import { ConsultingItem } from "@/types/consult/ConsultingItem";
import { Message } from "@/types/consult/Message";
import { useQuery } from "@tanstack/react-query";
import {
  Bot,
  BotMessageSquare,
  RefreshCw,
  Send,
  User,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Markdown from "react-native-markdown-display";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function AIConsultScreen() {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  // useEffect(() => {
  //   router.push("/login");
  // }, []);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // 상담 내역 가져오기
  const {
    data: consultings,
    isPending: isFetchingHistory,
    refetch: refetchConsultings,
  } = useQuery<ConsultingItem[]>({
    queryKey: ["consultings"],
    queryFn: getConsultings,
  });

  useEffect(() => {
    if (!consultings) return;

    const formattedMessages: Message[] = [
      {
        id: "welcome",
        sender: "ai",
        text: "안녕하세요! WelfareAI 맞춤 상담원입니다. 🤖\n현재 연령, 가구 상황, 또는 궁금한 복지 혜택을 편하게 말씀해 주세요.",
      },
    ];

    const historyItems = [...consultings].reverse();

    historyItems.forEach((item) => {
      formattedMessages.push({
        id: `q-${item.id}`,
        sender: "user",
        text: item.question,
      });
      formattedMessages.push({
        id: `a-${item.id}`,
        sender: "ai",
        text: item.answer,
      });
    });

    setMessages(formattedMessages);
  }, [consultings]);

  ////////////////////////////////////////////////////////////////////////////////

  // AI에게 문의하기
  const { mutate: consultMutation, isPending: consultPending } =
    useCreateConsulting({
      setMessages,
      setInputText,
    });

  const handleSend = () => {
    if (!inputText.trim() || consultPending) return;
    consultMutation(inputText.trim());
  };

  ////////////////////////////////////////////////////////////////////////////////

  const { mutate: deleteConsulting } = useDeleteConsulting();

  const handleLongPressMessage = (id: string) => {
    const rawId = id.replace(/^(a-|q-|user-|ai-)/, "");

    Alert.alert(
      "메시지 삭제",
      "정말로 해당 상담내역을 삭제하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: () => deleteConsulting(rawId),
        },
      ],
      { cancelable: true },
    );
  };

  ////////////////////////////////////////////////////////////////////////////////
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* 1. 상단 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <View style={styles.aiBadge}>
            <BotMessageSquare size={23} color="#FF7F66" />
          </View>
          <Text style={styles.headerTitle}>AI 복지 상담</Text>
        </View>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => refetchConsultings()}
        >
          <RefreshCw size={18} color="#6E8B8B" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={"padding"}
        keyboardVerticalOffset={-110}
      >
        {/* 2. 대화 목록 영역 */}
        {isFetchingHistory ? (
          <View style={styles.loadingCenter}>
            <ActivityIndicator size="large" color={Colors.point} />
            <Text style={styles.loadingText}>
              이전 상담 내역을 가져오는 중...
            </Text>
          </View>
        ) : (
          <ScrollView
            ref={scrollViewRef}
            style={styles.chatContainer}
            contentContainerStyle={[
              styles.chatContent,
              { paddingBottom: insets.bottom + 80 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.messageRow,
                  item.sender === "user" ? styles.userRow : styles.aiRow,
                ]}
              >
                {item.sender === "ai" && (
                  <View style={styles.aiAvatar}>
                    <Bot size={18} color="#FFFFFF" />
                  </View>
                )}

                <View style={{ maxWidth: "83%" }}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onLongPress={() => handleLongPressMessage(item.id)}
                  >
                    <View
                      style={[
                        styles.bubble,
                        item.sender === "user"
                          ? styles.userBubble
                          : styles.aiBubble,
                      ]}
                    >
                      {item.sender === "user" ? (
                        <Text
                          style={[styles.messageText, styles.userMessageText]}
                        >
                          {item.text}
                        </Text>
                      ) : (
                        <Markdown style={markdownStyles}>{item.text}</Markdown>
                      )}
                    </View>
                  </TouchableOpacity>
                </View>

                {item.sender === "user" && (
                  <View style={styles.userAvatar}>
                    <User size={16} color="#6E8B8B" />
                  </View>
                )}
              </View>
            ))}

            {/* AI 답변 대기 로딩 표시 */}
            {consultPending && (
              <View style={[styles.messageRow, styles.aiRow]}>
                <View style={styles.aiAvatar}>
                  <Bot size={18} color="#FFFFFF" />
                </View>
                <View
                  style={[styles.bubble, styles.aiBubble, styles.loadingBubble]}
                >
                  <ActivityIndicator size="small" color={Colors.point} />
                  <Text style={styles.aiLoadingText}>
                    AI가 관련 복지 정책을 찾아보고 있어요...
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>
        )}

        {/* 3. 하단 입력 영역 */}
        <View style={[styles.inputWrapper, { bottom: 96 }]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.autoPromptScroll}
            contentContainerStyle={styles.quickPromptContainer}
          >
            {AutoPrompts.map((prompt, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickChip}
                onPress={() => setInputText(prompt.replace(/^[^\s]+\s/, ""))}
              >
                <Text style={styles.quickChipText}>{prompt}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="상담받고 싶은 내용을 입력해 보세요..."
              placeholderTextColor="#A3B8B8"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSend}
              returnKeyType="send"
              editable={!consultPending}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                {
                  backgroundColor:
                    inputText.trim() && !consultPending ? "#FF7F66" : "#E2E8F0",
                },
              ]}
              onPress={handleSend}
              disabled={!inputText.trim() || consultPending}
            >
              <Send
                size={18}
                color={
                  inputText.trim() && !consultPending ? "#FFFFFF" : "#A3B8B8"
                }
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

////////////////////////////////////////////////////////////////////////////////

const markdownStyles = StyleSheet.create({
  body: {
    color: "#1A3A3A",
    fontSize: 14,
    lineHeight: 22,
  },
  heading3: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A3A3A",
    marginTop: 10,
    marginBottom: 3,
  },
  strong: {
    fontWeight: "700",
    color: "#1A3A3A",
  },
  list_item: {
    marginVertical: 2,
  },
  bullet_list: {
    marginVertical: 4,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F6F6",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(26, 58, 58, 0.06)",
    backgroundColor: "#F2F6F6",
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
    backgroundColor: "rgba(255, 127, 102, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A3A3A",
  },
  resetButton: {
    padding: 6,
  },
  loadingCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: "#6E8B8B",
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: 18,
    gap: 8,
  },
  aiRow: {
    justifyContent: "flex-start",
  },
  userRow: {
    justifyContent: "flex-end",
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#1A3A3A",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  aiBubble: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(26, 58, 58, 0.08)",
  },
  userBubble: {
    backgroundColor: "#1A3A3A",
    borderTopRightRadius: 4,
  },
  loadingBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  aiLoadingText: {
    fontSize: 13,
    color: "#6E8B8B",
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  aiMessageText: {
    color: "#1F2937",
  },
  userMessageText: {
    color: "#FFFFFF",
  },
  inputWrapper: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  autoPromptScroll: {
    maxHeight: 36,
    marginBottom: 8,
  },
  quickPromptContainer: {
    gap: 8,
  },
  quickChip: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(26, 58, 58, 0.1)",
  },
  quickChipText: {
    fontSize: 12,
    color: "#1A3A3A",
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(26, 58, 58, 0.12)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 0,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: "#1A3A3A",
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});
