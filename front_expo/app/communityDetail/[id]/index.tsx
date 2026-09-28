import { applyCommunity } from "@/api/community/applyCommunity";
import { deleteCommunityPost } from "@/api/community/deleteCommunityPost";
import { getCommunityDetail } from "@/api/community/getCommunityDetail";
import { updateMemberStatus } from "@/api/community/updateMemberStatus";
import { getMyInfo } from "@/api/user/getMyInfo";
import CommunityModal from "@/components/CommunityModal";
import Colors from "@/constants/Colors";
import { Width } from "@/constants/Width";
import { useUpdateCommunity } from "@/hooks/community/useUpdateCommunity";
import { CommunityMemberStatus } from "@/types/community/CommunityMemberStatus";
import { UserProfile } from "@/types/user/UserProfile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ChevronLeft,
  HeartHandshake,
  MessagesCircle,
  MoreVertical,
  UserCheck,
  Users,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ActionSheetIOS,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CommunityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isModalVisible, setIsModalVisible] = useState(false);

  // 폼 입력 상태들
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [notice, setNotice] = useState<string>("");

  // 게시글 조회
  const {
    data: post,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["communityDetail", id],
    queryFn: () => getCommunityDetail(id!),
    enabled: !!id,
  });

  //////////////////////////////////////////////////////////////////////////

  const { data: myInfo } = useQuery<UserProfile>({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
  });

  const myMemberInfo = post?.members?.find(
    (member) => member.userId === myInfo?.id,
  );

  const isApprovedMember = myMemberInfo?.status === "APPROVED";

  const isHost = post?.hostId === myInfo?.id;

  const pendingMembers =
    post?.members?.filter((member) => member.status === "PENDING") || [];

  //////////////////////////////////////////////////////////////////////////

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setTitle("");
    setContent("");
    setNotice("");
  };

  // 더보기 메뉴 클릭 핸들러
  const handleMoreMenu = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["취소", "수정하기", "삭제하기"],
          destructiveButtonIndex: 2,
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            handleEditCommunity();
          } else if (buttonIndex === 2) {
            handleDeleteCommunity();
          }
        },
      );
    } else {
      Alert.alert("모임 관리", "원하시는 작업을 선택해주세요.", [
        { text: "취소", style: "cancel" },
        { text: "수정하기", onPress: handleEditCommunity },
        {
          text: "삭제하기",
          onPress: handleDeleteCommunity,
          style: "destructive",
        },
      ]);
    }
  };

  //////////////////////////////////////////////////////////////////////////

  // 제보 수정
  const { mutate: updateCommunityMutation, isPending: updateCommunityPending } =
    useUpdateCommunity({
      id,
      onSuccessCallback: () => setIsModalVisible(false),
    });

  const handleUpdateCommunity = () => {
    updateCommunityMutation({
      title,
      content,
      notice,
    });
  };

  const handleEditCommunity = () => {
    if (!post) return;
    setTitle(post.title ?? "");
    setContent(post.content ?? "");
    setNotice(post.notice ?? "");
    setIsModalVisible(true);
  };

  //////////////////////////////////////////////////////////////////////////

  // 게시글 삭제
  const { mutate: CommunityDeleteMutation, isPending: CommunityDeletePending } =
    useMutation({
      mutationFn: () => deleteCommunityPost(id),
      onSuccess: () => {
        Alert.alert("삭제 완료", "모임 게시글이 삭제되었습니다.");
        queryClient.invalidateQueries({ queryKey: ["communityPosts"] });
        router.back();
      },
      onError: (error: any) => {
        Alert.alert(
          "삭제 실패",
          error?.response?.data?.message || "삭제 중 오류가 발생했습니다.",
        );
      },
    });

  const handleDeleteCommunity = () => {
    Alert.alert("모임 삭제", "정말로 이 모임을 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => CommunityDeleteMutation(),
      },
    ]);
  };

  //////////////////////////////////////////////////////////////////////////

  // 참여 신청
  const CommunityApplyMutation = useMutation({
    mutationFn: () => applyCommunity(id),
    onSuccess: (data) => {
      Alert.alert("신청 완료", data.message || "참여 신청이 완료되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["communityDetail", id] });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "참여 신청 중 오류가 발생했습니다.";
      Alert.alert("신청 실패", errorMessage);
    },
  });

  // 참여 신청 핸들러
  const handleJoinCommunity = () => {
    CommunityApplyMutation.mutate();
  };

  //////////////////////////////////////////////////////////////////////////

  // 멤버 상태 변경
  const updateStatusMutation = useMutation({
    mutationFn: updateMemberStatus,
    onSuccess: (data) => {
      Alert.alert("성공", data.message || "상태가 변경되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["communityDetail", id] });
      queryClient.invalidateQueries({ queryKey: ["communityPosts"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "상태 변경 중 오류가 발생했습니다.";
      Alert.alert("오류", errorMessage);
    },
  });

  // 멤버 상태 변경 핸들러
  const handleUpdateMemberStatus = (
    targetUserId: string,
    newStatus: CommunityMemberStatus,
  ) => {
    const statusText = newStatus === "APPROVED" ? "승인" : "강퇴";

    Alert.alert(
      `멤버 ${statusText}`,
      `해당 회원을 ${statusText}하시겠습니까?`,
      [
        { text: "취소", style: "cancel" },
        {
          text: "확인",
          onPress: () => {
            updateStatusMutation.mutate({
              postId: id,
              targetUserId,
              status: newStatus,
            });
          },
        },
      ],
    );
  };
  //////////////////////////////////////////////////////////////////////////

  if (isPending) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6C4B" />
      </View>
    );
  }

  if (isError || !post) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>게시글을 불러오는 데 실패했습니다.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>돌아가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const approvedMembersCount =
    post.members?.filter((m) => m.status === "APPROVED").length || 0;

  //////////////////////////////////////////////////////////////////////////

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ChevronLeft size={24} color="#1A252C" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>모임 상세</Text>
          {isHost ? (
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
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* 모임 성격 배지 */}
          <View style={styles.badgeRow}>
            <View
              style={[
                styles.typeBadge,
                post.type === "VOLUNTEER"
                  ? styles.volunteerBadge
                  : styles.selfHelpBadge,
              ]}
            >
              {post.type === "VOLUNTEER" ? (
                <>
                  <HeartHandshake size={14} color="#FF6C4B" />
                  <Text style={styles.typeBadgeTextVolunteer}>봉사 모임</Text>
                </>
              ) : (
                <>
                  <MessagesCircle size={14} color="#FF6C4B" />
                  <Text style={styles.typeBadgeTextSelfHelp}>소통 모임</Text>
                </>
              )}
            </View>
            <Text style={styles.dateText}>
              개설일:{" "}
              {new Date(post.createdAt).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>

          {/* 제목 */}
          <Text style={styles.title}>{post.title}</Text>

          {/* 호스트 및 모집인원 카드 정보 */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Users size={18} color="#6B7A85" />
              <Text style={styles.infoText}>
                참여 인원:{" "}
                <Text style={styles.highlightText}>
                  {approvedMembersCount}명
                </Text>
                {post.maxMembers ? ` / ${post.maxMembers}명` : ""}
              </Text>
            </View>
          </View>

          {/* ────────────────────────────────────────────── */}
          {/* 방장 전용: 참여 신청 관리 섹션 */}
          {/* ────────────────────────────────────────────── */}
          {isHost && (
            <View style={styles.hostManagementSection}>
              <View style={styles.hostManagementHeader}>
                <UserCheck size={18} color="#6B7A85" />
                <Text style={styles.infoText}>
                  참여 신청 관리 ({pendingMembers.length})
                </Text>
              </View>

              {pendingMembers.length === 0 ? (
                <View style={styles.emptyPendingCard}>
                  <Text style={styles.emptyPendingText}>
                    현재 대기 중인 신청자가 없습니다.
                  </Text>
                </View>
              ) : (
                pendingMembers.map((member) => (
                  <View key={member.id} style={styles.pendingMemberCard}>
                    <View style={styles.pendingUserInfo}>
                      {/* 유저 프로필 이미지/닉네임 */}
                      <Text style={styles.pendingUserName}>
                        {member.user?.nickname || "익명 회원"}
                      </Text>
                      <Text style={styles.pendingUserEmail}>
                        {member.user?.email}
                      </Text>
                    </View>

                    {/* 승인 / 거절 버튼 영역 */}
                    <View style={styles.actionButtonGroup}>
                      <TouchableOpacity
                        style={[styles.manageBtn, styles.approveBtn]}
                        onPress={() =>
                          handleUpdateMemberStatus(member.userId, "APPROVED")
                        }
                        disabled={updateStatusMutation.isPending}
                      >
                        <Text style={styles.approveBtnText}>승인</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>
          )}

          {/* 모임 소개 내용 */}
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>👥 모임 소개</Text>
            <Text style={styles.contentText}>{post.content}</Text>
          </View>

          {/* ────────────────────────────────────────────── */}
          {/* 승인 상태에 따른 조건부 영역 */}
          {/* ────────────────────────────────────────────── */}
          {isApprovedMember ? (
            <>
              {/* 1. 모임 공지사항 섹션 */}
              <View style={styles.noticeSection}>
                <Text style={styles.sectionTitle}>📢 모임 공지사항</Text>
                <View style={styles.noticeCard}>
                  <Text style={styles.noticeText}>
                    {post.notice || "등록된 공지사항이 없습니다."}
                  </Text>
                </View>
              </View>

              {/* 2. 모임 채팅방 섹션 및 버튼 */}
              <View style={styles.chatSection}>
                <View style={styles.chatHeaderRow}>
                  <Text style={styles.sectionTitle}>💬 모임 채팅방</Text>
                </View>

                <TouchableOpacity
                  style={styles.goToChatRoomBtn}
                  onPress={() =>
                    router.push(`/communityDetail/${post.id}/chat`)
                  }
                >
                  <Text style={styles.goToChatRoomBtnText}>
                    모임 채팅방 입장하기
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            /* 3. 미승인/비회원인 경우: 참여 신청하기 버튼 표시 */
            <View style={styles.actionSection}>
              <TouchableOpacity
                style={[
                  styles.joinButton,
                  myMemberInfo?.status === "PENDING" && styles.pendingButton,
                ]}
                onPress={handleJoinCommunity}
                disabled={myMemberInfo?.status === "PENDING"}
              >
                <Text style={styles.joinButtonText}>
                  {myMemberInfo?.status === "PENDING"
                    ? "승인 대기 중입니다"
                    : "모임 참여하기"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <CommunityModal
        modalType="detail"
        visible={isModalVisible}
        onClose={handleCloseModal}
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        notice={notice}
        setNotice={setNotice}
        createCommunityPending={updateCommunityPending}
        handleCreateCommunity={handleUpdateCommunity}
      />
    </SafeAreaView>
  );
}

//////////////////////////////////////////////////////////////////////////

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F5F6",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A252C",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  badgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  volunteerBadge: {
    backgroundColor: "#FFEFEA",
  },
  selfHelpBadge: {
    backgroundColor: "#FFEFEA",
  },
  typeBadgeTextVolunteer: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FF6C4B",
  },
  typeBadgeTextSelfHelp: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FF6C4B",
  },
  dateText: {
    fontSize: 13,
    color: "#8E99A3",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A252C",
    lineHeight: 30,
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: "#F8FAFB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#4A5568",
  },
  highlightText: {
    fontWeight: "700",
    color: Colors.point,
  },
  imageCarousel: {
    marginBottom: 20,
    borderRadius: 16,
  },
  carouselImage: {
    width: Width - 40,
    height: 220,
    borderRadius: 16,
  },
  contentSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A252C",
  },
  contentText: {
    fontSize: 15,
    color: "#334155",
    lineHeight: 24,
    marginTop: 10,
  },
  chatSection: {
    marginTop: 32,
  },
  chatHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  chatCountText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FF6C4B",
  },
  chatBoxCard: {
    backgroundColor: "#F8FAFB",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  emptyChatBox: {
    paddingVertical: 80,
    alignItems: "center",
  },
  emptyChatText: {
    fontSize: 13,
    color: "#8E99A3",
  },
  chatItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#EDF2F7",
  },
  chatItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  chatUserNickname: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2D3748",
  },
  chatTimeText: {
    fontSize: 11,
    color: "#A0AEC0",
  },
  chatMessageContent: {
    fontSize: 14,
    color: "#4A5568",
    lineHeight: 18,
  },
  chatInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  chatInput: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: "#1A252C",
  },
  sendButton: {
    backgroundColor: "#FF6C4B",
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledSendBtn: {
    backgroundColor: "#CBD5E1",
  },
  errorText: {
    fontSize: 15,
    color: "#6B7A85",
    marginBottom: 12,
  },
  backBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#F2F5F6",
    borderRadius: 8,
  },
  backBtnText: {
    fontSize: 14,
    color: "#1A252C",
    fontWeight: "600",
  },
  noticeSection: {
    marginTop: 24,
  },
  noticeCard: {
    backgroundColor: "#FFF9F5",
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#FFE0D3",
  },
  noticeText: {
    fontSize: 14,
    color: "#2D3748",
    lineHeight: 20,
  },
  goToChatRoomBtn: {
    marginTop: 12,
    backgroundColor: "#FF6C4B",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  goToChatRoomBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  actionSection: {
    marginTop: 32,
    marginBottom: 20,
  },
  joinButton: {
    backgroundColor: "#FF6C4B",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  pendingButton: {
    backgroundColor: "#A0AEC0",
  },
  joinButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  hostManagementSection: {
    marginTop: 3,
    marginBottom: 24,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  hostManagementHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 6,
    marginBottom: 12,
  },
  badgeCount: {
    backgroundColor: "#FF6C4B",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeCountText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  emptyPendingCard: {
    paddingVertical: 20,
    alignItems: "center",
  },
  emptyPendingText: {
    color: "#94A3B8",
    fontSize: 14,
  },
  pendingMemberCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#EDF2F7",
  },
  pendingUserInfo: {
    flex: 1,
    marginRight: 8,
  },
  pendingUserName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A202C",
  },
  pendingUserEmail: {
    fontSize: 12,
    color: "#718096",
    marginTop: 2,
  },
  actionButtonGroup: {
    flexDirection: "row",
    gap: 6,
  },
  manageBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  approveBtn: {
    backgroundColor: "#FF6C4B",
  },
  rejectBtn: {
    backgroundColor: "#EDF2F7",
  },
  approveBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  rejectBtnText: {
    color: "#4A5568",
    fontSize: 13,
    fontWeight: "600",
  },
});
