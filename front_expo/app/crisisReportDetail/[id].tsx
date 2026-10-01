import { getBlockedUsers } from "@/api/block/getBlockedUsers";
import { getCrisisReportById } from "@/api/crisisReport/getCrisisReportById";
import { getMyInfo } from "@/api/user/getMyInfo";
import CrisisReportModal from "@/components/CrisisReportModal";
import { ReportModal } from "@/components/ReportModal";
import { UserProfileAvatar } from "@/components/UserProfileAvatar";
import Colors from "@/constants/Colors";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/constants/ScreenSize";
import { useBlockUser } from "@/hooks/block/useBlockUser";
import { useUploadImage } from "@/hooks/common/useUploadImage";
import { useCreateCrisisComment } from "@/hooks/crisisReport/useCreateCrisisComment";
import { useDeleteCrisisComment } from "@/hooks/crisisReport/useDeleteCrisisComment";
import { useDeleteCrisisReport } from "@/hooks/crisisReport/useDeleteCrisisReport";
import { useUpdateCrisisReport } from "@/hooks/crisisReport/useUpdateCrisisReport";
import { BlockedItem } from "@/types/block/BlockedItem";
import { Comment } from "@/types/crisisReport/Comment";
import { CrisisReportDetail } from "@/types/crisisReport/CrisisReportDetail";
import { UserProfile } from "@/types/user/UserProfile";
import { formatDate } from "@/utils/formatDate";
import { handleGetCurrentLocation } from "@/utils/handleGetCurrentLocation";
import { handlePickImage } from "@/utils/handlePickImage";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ChevronLeft,
  Clock,
  MapPin,
  MoreVertical,
  Send,
  Siren,
  Trash,
  User,
} from "lucide-react-native";
import { MessageCircleMore } from "lucide-react-native/icons";
import React, { useState } from "react";
import {
  ActionSheetIOS,
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CrisisReportDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  // 모달 열림 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [images, setImages] = useState<string[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [initialUserName, setInitialUserName] = useState("");
  const [activePopoverCommentId, setActivePopoverCommentId] = useState<
    string | null
  >(null);

  /////////////////////////////////////////////////////////////////////////////////

  // 제보 상세 조회
  const {
    data: report,
    isLoading,
    isError,
  } = useQuery<CrisisReportDetail>({
    queryKey: ["crisisReport", id],
    queryFn: () => getCrisisReportById(id),
    enabled: !!id,
    refetchInterval: 5000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  });

  /////////////////////////////////////////////////////////////////////////////////

  const { data: myInfo } = useQuery<UserProfile>({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
  });

  const isAuthor = myInfo?.id === report?.user.id;

  /////////////////////////////////////////////////////////////////////////////////

  const { data: blockedList = [] } = useQuery<BlockedItem[]>({
    queryKey: ["blockedUsers"],
    queryFn: getBlockedUsers,
  });

  /////////////////////////////////////////////////////////////////////////////////

  // 프로필 이미지 클릭 핸들러
  const handleProfilePress = (comment: Comment) => {
    if (comment.user.id === myInfo?.id) return;
    setActivePopoverCommentId((prev) =>
      prev === comment.id ? null : comment.id,
    );
  };

  /////////////////////////////////////////////////////////////////////////////////

  // 더보기 메뉴 클릭 핸들러
  const handleMoreMenu = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["취소", "수정하기", "삭제하기"],
          destructiveButtonIndex: 2, // 삭제하기 버튼
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            handleEditReport(); // 수정하기
          } else if (buttonIndex === 2) {
            handleDeleteReport(); // 삭제하기
          }
        },
      );
    } else {
      Alert.alert("제보 관리", "원하시는 작업을 선택해주세요.", [
        { text: "취소", style: "cancel" },
        { text: "수정하기", onPress: handleEditReport },
        { text: "삭제하기", onPress: handleDeleteReport, style: "destructive" },
      ]);
    }
  };

  /////////////////////////////////////////////////////////////////////////////////

  const { mutate: uploadImageMutation, isPending: uploadImagePending } =
    useUploadImage();

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  /////////////////////////////////////////////////////////////////////////////////

  // 제보 수정
  const { mutate: updateReportMutation, isPending: updateReportPending } =
    useUpdateCrisisReport({
      id,
      onSuccessCallback: () => setIsModalOpen(false),
    });

  const handleUpdateReport = () => {
    updateReportMutation({
      title,
      content,
      address,
      latitude,
      longitude,
      images,
    });
  };

  const handleEditReport = () => {
    if (!report) return;
    setTitle(report.title ?? "");
    setContent(report.content ?? "");
    setAddress(report.address ?? "");
    setLatitude(report.latitude);
    setLongitude(report.longitude);
    setImages(report.images ?? []);
    setIsModalOpen(true);
  };

  /////////////////////////////////////////////////////////////////////////////////

  // 제보 삭제
  const { mutate: deleteReportMutation, isPending: deleteReportPending } =
    useDeleteCrisisReport();

  const handleDeleteReport = () => {
    Alert.alert("제보 삭제", "정말 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => {
          deleteReportMutation(id);
        },
      },
    ]);
  };

  /////////////////////////////////////////////////////////////////////////////////

  // 댓글 작성
  const { mutate: createCommentMutation, isPending: createCommentPending } =
    useCreateCrisisComment({
      reportId: id,
      onSuccessCallback: () => setCommentInput(""),
    });

  const handleSendComment = () => {
    if (!commentInput.trim()) return;
    createCommentMutation(commentInput.trim());
  };

  /////////////////////////////////////////////////////////////////////////////////

  // 댓글 삭제
  const { mutate: deleteCommentMutation, isPending: deleteCommentPending } =
    useDeleteCrisisComment({
      reportId: id,
    });

  const handleDeleteComment = (commentId: string) => {
    Alert.alert("댓글 삭제", "정말 이 댓글을 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => deleteCommentMutation(commentId),
      },
    ]);
  };

  /////////////////////////////////////////////////////////////////////////////////

  // 차단하기
  const { mutate: blockUserMutation, isPending: blockUserPending } =
    useBlockUser();

  const handleBlockPress = (nickname: string) => {
    setShowPopover(false);
    Alert.alert(
      "회원 차단",
      `정말 ${nickname}님을 차단하시겠습니까?\n 차단한 사용자의 댓글은 더 이상 보이지 않습니다.`,
      [
        { text: "취소", style: "cancel" },
        {
          text: "차단",
          style: "destructive",
          onPress: () => {
            blockUserMutation(nickname);
          },
        },
      ],
    );
  };

  /////////////////////////////////////////////////////////////////////////////////

  // 신고하기
  const handleReportPress = (nickname: string) => {
    setShowPopover(false);
    setIsReportModalVisible(true);
    setInitialUserName(nickname);
  };

  /////////////////////////////////////////////////////////////////////////////////

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.point} />
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
        behavior={"padding"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
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
            <TouchableOpacity
              onPress={() => {
                setIsReportModalVisible(true);
                setInitialUserName(report.user.nickname);
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Siren size={22} color="#FF3B30" />
            </TouchableOpacity>
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

          {/* 제보 제목 */}
          <Text style={styles.title}>{report.title}</Text>

          {/* 이미지 목록  */}
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

          {/* 위치 정보 */}
          <View style={styles.metaCard}>
            {/* 위치 */}
            <View style={styles.reportMetaRow}>
              <MapPin size={18} color={Colors.primary} />
              <Text style={styles.metaLabel}>제보 위치</Text>
              <Text style={styles.reportLocationText}>{report.address}</Text>
            </View>

            <View style={styles.reportDivider} />

            {/* 제보자 */}
            <View style={styles.reportMetaRow}>
              <User size={18} color={Colors.primary} />
              <Text style={styles.metaLabel}>제보자</Text>
              <Text style={styles.metaValue}>{report.user.nickname}</Text>
            </View>
          </View>

          {/* 댓글 섹션 */}
          <View style={styles.commentSectionHeader}>
            <MessageCircleMore size={20} color={Colors.point} />
            <Text style={styles.commentSectionTitle}>
              댓글 ({report.comments ? report.comments.length : 0})
            </Text>
          </View>

          {/* 댓글 목록 */}
          {report.comments && report.comments.length > 0 ? (
            report.comments
              // 차단된 유저의 댓글은 필터링하여 제외
              .filter(
                (comment) =>
                  !blockedList.some(
                    (b) => b.blockedUser.nickname === comment.user.nickname,
                  ),
              ) // 또는 comment.user.id
              .map((comment) => (
                <View key={comment.id} style={styles.commentItem}>
                  <View style={styles.commentHeader}>
                    <UserProfileAvatar
                      profileImage={comment.user?.profileImage}
                      nickname={comment.user?.nickname}
                      isPopoverVisible={activePopoverCommentId === comment.id}
                      onProfilePress={() => handleProfilePress(comment)}
                      onClosePopover={() => setActivePopoverCommentId(null)}
                      onReportPress={handleReportPress}
                      onBlockPress={handleBlockPress}
                    />

                    <Text style={styles.commentAuthor}>
                      {comment.user?.nickname || "사용자"}
                    </Text>

                    {comment.user.id === myInfo?.id ? (
                      <>
                        <Text
                          style={[styles.CommentcreatedAt, { marginRight: 24 }]}
                        >
                          {formatDate(comment.createdAt)}
                        </Text>
                        <TouchableOpacity
                          onPress={() => handleDeleteComment(comment.id)}
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                          style={{ position: "absolute", right: 5, top: 5 }}
                        >
                          <Trash size={16} color={Colors.inactive} />
                        </TouchableOpacity>
                      </>
                    ) : (
                      <Text style={styles.CommentcreatedAt}>
                        {formatDate(comment.createdAt)}
                      </Text>
                    )}
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
        <View style={[styles.inputContainer]}>
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
              (!commentInput.trim() || createCommentPending) &&
                styles.sendButtonDisabled,
            ]}
            onPress={handleSendComment}
            disabled={!commentInput.trim() || createCommentPending}
          >
            {createCommentPending ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Send size={18} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>

        <ReportModal
          visible={isReportModalVisible}
          onClose={() => setIsReportModalVisible(false)}
          initialUserName={initialUserName}
        />

        <CrisisReportModal
          visible={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          address={address}
          setAddress={setAddress}
          setLatitude={setLatitude}
          setLongitude={setLongitude}
          images={images}
          setImages={setImages}
          uploadImageMutation={uploadImageMutation}
          uploadImagePending={uploadImagePending}
          createReportPending={updateReportPending}
          handleGetCurrentLocation={handleGetCurrentLocation}
          handlePickImage={handlePickImage}
          handleRemoveImage={handleRemoveImage}
          handleCreateReport={handleUpdateReport}
        />
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
  commentItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F3F5",
    overflow: "visible",
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    overflow: "visible",
    position: "relative",
  },
  profileWrapper: {
    position: "relative",
    width: 36,
    height: 36,
    marginRight: 8,
    zIndex: 999,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  defaultProfileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F1F3F5",
    justifyContent: "center",
    alignItems: "center",
  },

  // 화면 전체를 가로채는 투명 오버레이
  fullScreenOverlay: {
    position: "absolute",
    top: -SCREEN_HEIGHT,
    left: -SCREEN_WIDTH,
    width: SCREEN_WIDTH * 2,
    height: SCREEN_HEIGHT * 2,
    backgroundColor: "transparent",
    zIndex: 1000,
  },

  // 프로필 바로 옆 플로팅 메뉴
  popoverMenu: {
    position: "absolute",
    top: 25,
    left: 40,
    width: 130,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#E9ECEF",
    zIndex: 1001, // 오버레이보다 위에 렌더링

    // 그림자 (iOS & Android)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  popoverItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  popoverText: {
    fontSize: 13,
    color: "#FF3B30",
    fontWeight: "600",
  },
  popoverDivider: {
    width: 1,
    height: 14,
    backgroundColor: "#E9ECEF",
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
    gap: 6,
    marginTop: 20,
    marginBottom: 12,
  },
  commentSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },

  commentAuthor: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333333",
    marginLeft: 12,
  },
  commentDate: {
    fontSize: 11,
    color: "#A0A0A0",
  },
  commentContent: {
    fontSize: 14,
    color: "#4A5568",
    marginStart: 48,
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
    paddingBottom: Platform.OS === "ios" ? -12 : 12,
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
  // styles
  reporterBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start", // 왼쪽 정렬
    backgroundColor: Colors.pointCard || "#F1F3F5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  avatarCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 11,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  reporterText: {
    fontSize: 13,
    color: "#6C757D",
  },
  reporterName: {
    color: "#1C1C1E",
    fontWeight: "600",
  },
  metaCard: {
    backgroundColor: Colors.card || "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E9ECEF",
    gap: 12,
  },
  reportMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  reportDivider: {
    height: 1,
    backgroundColor: "#F1F3F5",
  },
  reportLocationText: {
    fontSize: 13,
    color: "#1C1C1E",
    flex: 1,
    fontWeight: "400",
  },
  metaLabel: {
    fontSize: 13,
    color: "#8E8E93",
  },
  metaValue: {
    fontSize: 13,
    color: "#1C1C1E",
    fontWeight: "600",
  },
  CommentcreatedAt: {
    fontSize: 11,
    color: "#A0A0A0",
    position: "absolute",
    right: 5,
    top: 5,
  },

  commentContainer: {
    flexDirection: "row",
    paddingVertical: 12,
    alignItems: "flex-start",
  },

  popoverOverlay: {
    position: "absolute",
    top: -500,
    bottom: -500,
    left: -500,
    right: -500,
    zIndex: 1,
  },
  // 플로팅 메뉴 바

  modalOverlay: {
    flex: 1,
    backgroundColor: "transparent", // 배경을 투명하게 설정
    justifyContent: "center", // 또는 절대 좌표에 맞게 조정
    alignItems: "center",
  },
});
