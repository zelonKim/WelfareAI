import { getCommunityPosts } from "@/api/community/getCommunityPosts";
import { CommunityItem } from "@/components/CommunityItem";
import CommunityModal from "@/components/CommunityModal";
import Colors from "@/constants/Colors";
import { CommunityTabs } from "@/constants/CommunityTabs";
import { useUploadImage } from "@/hooks/common/useUploadImage";
import { useCreateCommunity } from "@/hooks/community/useCreateCommunity";
import { CommunityType } from "@/types/community/CommunityPost";
import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CommunityScreen() {
  // 모달 열림 및 입력 폼 상태 정의
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [communityType, setCommunityType] =
    useState<CommunityType>("SELF_HELP");

  const [selectedType, setSelectedType] = useState<CommunityType>("ALL");

  // 모임 게시글 조회
  const {
    data: posts = [],
    isPending,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["communityPosts", selectedType],
    queryFn: () => getCommunityPosts(selectedType),
  });

  //////////////////////////////////////////////////////////////////////////

  // 모임 게시글 작성
  const { mutate: createCommunityMutation, isPending: createCommunityPending } =
    useCreateCommunity(() => {
      handleCloseModal();
    });

  // 모임 생성 제출 핸들러
  const handleCreateCommunity = () => {
    if (!title.trim()) {
      Alert.alert("알림", "제목을 입력해 주세요.");
      return;
    }

    if (!content.trim()) {
      Alert.alert("알림", "상세 내용을 입력해 주세요.");
      return;
    }

    // 커스텀 훅 Mutation 호출
    createCommunityMutation({
      title,
      content,
      images,
      type: communityType,
    });

    // 폼 및 모달 상태 초기화
    setModalVisible(false);
    setTitle("");
    setContent("");
    setImages([]);
    setCommunityType("SELF_HELP");
  };

  //////////////////////////////////////////////////////////////////////////

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setTitle("");
    setContent("");
    setImages([]);
  };


  //////////////////////////////////////////////////////////////////////////

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 1. 상단 타이틀 헤더 */}
        <View style={styles.header}>
          <View style={styles.bellIconWrapper}>
            <Feather name="users" size={22} color={Colors.point} />
          </View>
          <Text style={styles.headerTitle}>소통 및 봉사 모임</Text>
        </View>

        {/* 2. 세그먼트형 필터 탭 */}
        <View style={styles.segmentedControlWrapper}>
          <View style={styles.segmentedControl}>
            {CommunityTabs.map((tab) => {
              const isActive = selectedType === tab.value;
              return (
                <TouchableOpacity
                  key={tab.value}
                  style={[
                    styles.segmentButton,
                    isActive && styles.segmentButtonActive,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setSelectedType(tab.value)}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      isActive && styles.segmentTextActive,
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 3. 모임 카드 목록 */}
        {isPending ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={Colors.point} />
          </View>
        ) : isError ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>목록을 불러오지 못했습니다.</Text>
          </View>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            renderItem={CommunityItem}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
            }
            ListEmptyComponent={
              <View style={styles.centerContainer}>
                <Text style={styles.emptyText}>등록된 모임이 없습니다.</Text>
              </View>
            }
          />
        )}

        <TouchableOpacity
          onPress={handleOpenModal}
          style={styles.fab}
          activeOpacity={0.85}
        >
          <Plus size={20} color="#FFFFFF" strokeWidth={2.5} />
          <Text style={styles.fabText}>모임 만들기</Text>
        </TouchableOpacity>

        <CommunityModal
          modalType="tabs"
          visible={modalVisible}
          onClose={handleCloseModal}
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          communityType={communityType}
          setCommunityType={setCommunityType}
          createCommunityPending={createCommunityPending}
          handleCreateCommunity={handleCreateCommunity}
        />
      </View>
    </SafeAreaView>
  );
}

//////////////////////////////////////////////////////////////////////////

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F2F5F6",
  },
  container: {
    flex: 1,
    backgroundColor: "#F2F5F6",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(26, 58, 58, 0.06)",
  },
  bellIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFEFEA",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A252C",
  },

  segmentedControlWrapper: {
    paddingHorizontal: 16,
    marginBottom: 16,
    marginTop: 12,
  },
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: "#E4ECEF",
    borderRadius: 12,
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  segmentButtonActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7A85",
  },
  segmentTextActive: {
    fontWeight: "700",
    color: "#1A252C",
  },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 90,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A252C",
    flex: 1,
    marginRight: 8,
  },
  cardDate: {
    fontSize: 13,
    color: "#8E99A3",
  },
  cardContent: {
    fontSize: 14,
    color: "#5C6870",
    lineHeight: 20,
    marginBottom: 14,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F5F7F8",
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  volunteerBadge: {
    backgroundColor: "#EAF7ED",
  },
  selfHelpBadge: {
    backgroundColor: "#EBF3FF",
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  volunteerBadgeText: {
    color: "#27A249",
  },
  selfHelpBadgeText: {
    color: "#2A75D3",
  },
  hostText: {
    fontSize: 13,
    color: "#8E99A3",
  },
  memberInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  memberText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#5C6870",
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 120,
  },
  errorText: {
    fontSize: 14,
    color: "#FF5252",
  },
  emptyText: {
    fontSize: 14,
    color: "#8E99A3",
  },

  fab: {
    position: "absolute",
    bottom: 90,
    right: 20,
    backgroundColor: Colors.point,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 6,
    elevation: 4,
  },
  fabText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
