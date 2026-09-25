import { client } from "@/api/client";
import { getMyInfo } from "@/api/user/getMyInfo";
import Colors from "@/constants/Colors";
import { CrisisReportDetail } from "@/types/crisisReport/CrisisReportDetail";
import { UserProfile } from "@/types/user/UserProfile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ChevronLeft,
  Clock,
  MapPin,
  MessageSquare,
  MoreVertical,
  Send,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ActionSheetIOS,
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CrisisReportDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [commentInput, setCommentInput] = useState("");

  /////////////////////////////////////////////////////////////////////////////////

  // 1. 댓글 작성 Mutation
  const createCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      return await client.post(`/crisis-report/${id}/comment`, { content });
    },
    onSuccess: () => {
      setCommentInput("");
      queryClient.invalidateQueries({ queryKey: ["crisisReport", id] });
    },
    onError: () => {
      Alert.alert("오류", "댓글 등록에 실패했습니다.");
    },
  });

  const handleSendComment = () => {
    if (!commentInput.trim()) return;
    createCommentMutation.mutate(commentInput.trim());
  };

  /////////////////////////////////////////////////////////////////////////////////

  // 2. 제보 상세 데이터 조회
  const {
    data: report,
    isLoading,
    isError,
  } = useQuery<CrisisReportDetail>({
    queryKey: ["crisisReport", id],
    queryFn: async () => {
      const res = await client.get(`/crisis-report/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  /////////////////////////////////////////////////////////////////////////////////

  const { data: myInfo } = useQuery<UserProfile>({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
  });

  // 작성자 여부 확인
  const isAuthor = myInfo?.id === report?.user.id;

  /////////////////////////////////////////////////////////////////////////////////

  // 더보기 메뉴 클릭 핸들러
  const handleMoreMenu = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["취소", "수정하기", "삭제하기"],
          destructiveButtonIndex: 2, // 삭제하기 버튼 (빨간색)
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            handleEdit(); // 수정하기 함수
          } else if (buttonIndex === 2) {
            handleDelete(); // 삭제하기 함수
          }
        },
      );
    } else {
      Alert.alert("제보 관리", "원하시는 작업을 선택해주세요.", [
        { text: "취소", style: "cancel" },
        { text: "수정하기", onPress: handleEdit },
        { text: "삭제하기", onPress: handleDelete, style: "destructive" },
      ]);
    }
  };

  const handleEdit = () => {
    // 수정 모달 페이지
  };

  const handleDelete = () => {
    Alert.alert("제보 삭제", "정말 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => {
          // 삭제 Mutation 호출
        },
      },
    ]);
  };

  /////////////////////////////////////////////////////////////////////////////////

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6E8B8B" />
      </View>
    );
  }

  if (isError || !report) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>제보 내역을 불러올 수 없습니다.</Text>
      </View>
    );
  }

  /////////////////////////////////////////////////////////////////////////////////

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return { label: "제보 접수", style: styles.badgePending };
      case "IN_PROGRESS":
        return { label: "조치 중", style: styles.badgeInProgress };
      case "RESOLVED":
        return { label: "조치 완료", style: styles.badgeResolved };
      default:
        return { label: "접수", style: styles.badgePending };
    }
  };

  const badge = getStatusBadge(report.status);

  /////////////////////////////////////////////////////////////////////////////////

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 6 : 0}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <ChevronLeft size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>위기 제보 상세</Text>

          {isAuthor ? (
            <TouchableOpacity
              onPress={handleMoreMenu}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MoreVertical size={24} color="#1A1A1A" />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 24 }} />
          )}
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* 상태 및 작성 정보 */}
          <View style={styles.metaRow}>
            <View style={[styles.badge, badge.style]}>
              <Text style={styles.badgeText}>{badge.label}</Text>
            </View>
            <View style={styles.timeBox}>
              <Clock size={14} color="#8E8E93" />
              <Text style={styles.timeText}>
                {new Date(report.createdAt).toLocaleDateString("ko-KR")}
              </Text>
            </View>
          </View>

          {/* 제보 제목 & 작성자 */}
          <Text style={styles.title}>{report.title}</Text>

          {/* 이미지 목록 (가로 스크롤) */}
          {report.images && report.images.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.imageGallery}
            >
              {report.images.map((imgUri, index) => (
                <Image
                  key={index}
                  source={{ uri: imgUri }}
                  style={styles.detailImage}
                />
              ))}
            </ScrollView>
          )}

          {/* 상세 내용 */}
          <View style={styles.section}>
            <Text style={styles.contentText}>{report.content}</Text>
          </View>
          {/* <Text style={styles.authorText}>
            {report.user?.nickname || "익명"}
          </Text> */}

          {/* 위치 정보 */}
          <View style={styles.locationCard}>
            <MapPin size={18} color="#6E8B8B" />
            <Text style={styles.locationText}>{report.address}</Text>
          </View>

          <View style={styles.divider} />

          {/* 댓글 섹션 */}
          <View style={styles.commentSectionHeader}>
            <MessageSquare size={18} color="#1A1A1A" />
            <Text style={styles.commentSectionTitle}>
              댓글 ({report.comments ? report.comments.length : 0})
            </Text>
          </View>

          {/* 댓글 목록 */}
          {report.comments && report.comments.length > 0 ? (
            report.comments.map((comment) => (
              <View key={comment.id} style={styles.commentItem}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentAuthor}>
                    {comment.user?.nickname || "사용자"}
                  </Text>
                  <Text style={styles.commentDate}>
                    {new Date(comment.createdAt).toLocaleDateString("ko-KR")}
                  </Text>
                </View>
                <Text style={styles.commentContent}>{comment.content}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyCommentText}>
              첫번째 댓글을 남겨보세요!
            </Text>
          )}
        </ScrollView>

        {/* 하단 댓글 입력창 */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="댓글을 입력해주세요..."
            placeholderTextColor="#A0A0A0"
            value={commentInput}
            onChangeText={setCommentInput}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!commentInput.trim() || createCommentMutation.isPending) &&
                styles.sendButtonDisabled,
            ]}
            onPress={handleSendComment}
            disabled={!commentInput.trim() || createCommentMutation.isPending}
          >
            {createCommentMutation.isPending ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Send size={18} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/////////////////////////////////////////////////////////////////////////////////

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 15,
    color: "#8E8E93",
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 20,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgePending: { backgroundColor: "#FFF3E0" },
  badgeInProgress: { backgroundColor: "#E3F2FD" },
  badgeResolved: { backgroundColor: "#E8F5E9" },
  badgeText: { fontSize: 12, fontWeight: "600", color: "#333333" },
  timeBox: { flexDirection: "row", alignItems: "center", gap: 4 },
  timeText: { fontSize: 12, color: "#8E8E93" },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  authorText: {
    fontSize: 13,
    color: "#666666",
    marginBottom: 12,
    textAlign: "right",
  },
  imageGallery: {
    marginBottom: 20,
  },
  detailImage: {
    width: 210,
    height: 210,
    borderRadius: 12,
    marginRight: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8E8E93",
    marginBottom: 8,
  },
  contentText: {
    fontSize: 15,
    color: "#333333",
    lineHeight: 22,
  },
  locationCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  locationText: {
    fontSize: 14,
    color: "#4A5568",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 16,
  },
  commentSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  commentSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  commentItem: {
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  commentAuthor: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333333",
  },
  commentDate: {
    fontSize: 11,
    color: "#A0A0A0",
  },
  commentContent: {
    fontSize: 14,
    color: "#4A5568",
  },
  emptyCommentText: {
    textAlign: "center",
    color: "#A0A0A0",
    paddingVertical: 50,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    gap: 10,
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 80,
    fontSize: 14,
    color: "#1A1A1A",
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.point,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#CBD5E1",
  },
});
