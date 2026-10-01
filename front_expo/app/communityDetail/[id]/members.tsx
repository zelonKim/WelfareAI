import { getCommunityDetail } from "@/api/community/getCommunityDetail";
import { getMyInfo } from "@/api/user/getMyInfo";
import { ReportModal } from "@/components/ReportModal";
import { Colors } from "@/constants/Colors";
import { useUpdateMemberStatus } from "@/hooks/community/useUpdateMemberStatus";
import { UserProfile } from "@/types/user/UserProfile";

import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, Siren, User as UserIcon } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CommunityMembersScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);

  //  모임 상세 정보 조회
  const { data: post } = useQuery({
    queryKey: ["communityDetail", id],
    queryFn: () => getCommunityDetail(id!),
    enabled: !!id,
  });

  //  내 정보 조회
  const { data: myInfo } = useQuery<UserProfile>({
    queryKey: ["myInfo"],
    queryFn: getMyInfo,
  });

  // 방장 여부 확인
  const isHost = post?.hostId === myInfo?.id;

  // APPROVED 상태 멤버 목록
  const approvedMembers =
    post?.members?.filter((member) => member.status === "APPROVED") || [];

  /////////////////////////////////////////////////////////////////////

  // 3. 강퇴 하기
  const { mutate: updateStatusMutation, isPending: updateStatusPending } =
    useUpdateMemberStatus();

  const handleBanMember = (targetUserId: string, nickname: string) => {
    Alert.alert(
      "모임원 강퇴",
      `정말로 '${nickname}' 님을 모임에서 강퇴하시겠습니까?`,
      [
        { text: "취소", style: "cancel" },
        {
          text: "강퇴하기",
          style: "destructive",
          onPress: () => {
            if (!id) return;

            updateStatusMutation({
              postId: id,
              targetUserId,
              status: "BANNED",
            });
          },
        },
      ],
    );
  };

  /////////////////////////////////////////////////////////////////////

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.customHeader}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.backButton}
        >
          <ChevronLeft size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>모임원 목록</Text>
        <TouchableOpacity
          onPress={() => {
            setIsReportModalVisible(true);
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Siren size={22} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={approvedMembers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>참여 중인 모임원이 없습니다.</Text>
        }
        renderItem={({ item }) => {
          const isTargetHost = post?.hostId === item.user?.id;
          const isMe = item.user?.id === myInfo?.id;

          return (
            <View style={styles.memberCard}>
              {item.user?.profileImage ? (
                <Image
                  source={{ uri: item.user.profileImage }}
                  style={styles.avatar}
                />
              ) : (
                <View
                  style={[
                    styles.avatar,
                    { justifyContent: "center", alignItems: "center" },
                  ]}
                >
                  <UserIcon size={22} color={Colors.primary} />
                </View>
              )}

              {/* 별명 및 방장 뱃지 영역 */}
              <View style={styles.infoContainer}>
                <Text style={styles.nickname}>
                  {item.user?.nickname || "알 수 없음"}
                </Text>
                {isTargetHost && (
                  <View style={styles.hostBadge}>
                    <Text style={styles.hostBadgeText}>방장</Text>
                  </View>
                )}
              </View>

              {isHost && !isTargetHost && !isMe && (
                <TouchableOpacity
                  style={styles.banButton}
                  disabled={updateStatusPending}
                  onPress={() =>
                    handleBanMember(
                      item.user?.id || "",
                      item.user?.nickname || "알 수 없음",
                    )
                  }
                >
                  <Text style={styles.banButtonText}>강퇴</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        }}
      />

      <ReportModal
        visible={isReportModalVisible}
        onClose={() => setIsReportModalVisible(false)}
      />
    </SafeAreaView>
  );
}

/////////////////////////////////////////////////////////////////////

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryLight,
    marginRight: 14,
  },
  infoContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  nickname: {
    fontSize: 16,
    color: "#1A1A1A",
    fontWeight: "500",
  },
  hostBadge: {
    marginLeft: 8,
    backgroundColor: Colors.pointCard,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  hostBadgeText: {
    fontSize: 11,
    color: Colors.point,
    fontWeight: "bold",
  },
  banButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#FF3B33",
  },
  banButtonText: {
    fontSize: 13,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  emptyText: {
    textAlign: "center",
    color: "#888888",
    marginTop: 40,
  },
  customHeader: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,

    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1A1A1A",
  },
});
