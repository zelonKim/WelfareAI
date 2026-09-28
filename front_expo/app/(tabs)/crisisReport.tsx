import { getAllCrisisReports } from "@/api/crisisReport/getAllCrisisReports";
import { getMyCrisisReports } from "@/api/crisisReport/getMyCrisisReports";
import CrisisReportModal from "@/components/CrisisReportModal";
import Colors from "@/constants/Colors";
import { useUploadImage } from "@/hooks/common/useUploadImage";
import { useCreateCrisisReport } from "@/hooks/crisisReport/useCreateCrisisReport";
import { CrisisReport } from "@/types/crisisReport/CrisisReport";
import { formatDate } from "@/utils/formatDate";
import { handleGetCurrentLocation } from "@/utils/handleGetCurrentLocation";
import { handlePickImage } from "@/utils/handlePickImage";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { AlertCircle, Bell, MapPin, Plus } from "lucide-react-native";
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

export default function CrisisReportScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"all" | "my">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState<number | undefined>();
  const [images, setImages] = useState<string[]>([]);
  const [longitude, setLongitude] = useState<number | undefined>();

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTitle("");
    setContent("");
    setAddress("");
    setLatitude(undefined);
    setLongitude(undefined);
    setImages([]);
  };

  /////////////////////////////////////////////////////////////////////////////////

  // 위기 제보하기
  const { mutate: createReportMutation, isPending: createReportPending } =
    useCreateCrisisReport();

  const handleCreateReport = () => {
    if (!title.trim()) {
      Alert.alert("알림", "제목을 입력해 주세요.");
      return;
    }

    if (!content.trim()) {
      Alert.alert("알림", "상세 내용을 입력해 주세요.");
      return;
    }

    if (!address.trim()) {
      Alert.alert("알림", "위치를 입력해 주세요.");
      return;
    }

    createReportMutation({
      title,
      content,
      images,
      latitude,
      longitude,
      address,
    });

    setIsModalOpen(false);
    setTitle("");
    setContent("");
    setAddress("");
    setLatitude(undefined);
    setLongitude(undefined);
    setImages([]);
  };

  /////////////////////////////////////////////////////////////////////////////////

  const { mutate: uploadImageMutation, isPending: uploadImagePending } =
    useUploadImage();

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  /////////////////////////////////////////////////////////////////////////////////

  // 1. 전체 제보 조회
  const {
    data: allReports,
    isPending: allReportsPending,
    isRefetching: allReportsRefetching,
    refetch: allReportsRefetch,
  } = useQuery<CrisisReport[]>({
    queryKey: ["crisisReports", "all"],
    queryFn: getAllCrisisReports,
  });

  // 2. 내 제보 조회
  const {
    data: myReports,
    isPending: myReportsPending,
    isRefetching: myReportsRefetching,
    refetch: myReportsRefetch,
  } = useQuery<CrisisReport[]>({
    queryKey: ["crisisReports", "my"],
    queryFn: getMyCrisisReports,
  });

  const reports = activeTab === "all" ? allReports : myReports;
  const isPending = activeTab === "all" ? allReportsPending : myReportsPending;
  const isRefetching =
    activeTab === "all" ? allReportsRefetching : myReportsRefetching;
  const refetch = activeTab === "all" ? allReportsRefetch : myReportsRefetch;

  const handleCardPress = (id: string) => {
    router.push(`/crisisReportDetail/${id}`);
  };

  /////////////////////////////////////////////////////////////////////////////////

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <View style={styles.aiBadge}>
            <Bell size={22} color="#FF7F66" />
          </View>
          <Text style={styles.headerTitle}>위기 이웃 제보</Text>
        </View>
      </View>

      {/* 탭 전환 (전체 제보 / 내 제보) */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "all" && styles.activeTab]}
          onPress={() => setActiveTab("all")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "all" && styles.activeTabText,
            ]}
          >
            전체 제보
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === "my" && styles.activeTab]}
          onPress={() => setActiveTab("my")}
        >
          <Text
            style={[styles.tabText, activeTab === "my" && styles.activeTabText]}
          >
            내가 쓴 제보
          </Text>
        </TouchableOpacity>
      </View>

      {/* 로딩 / 목록 영역 */}
      {isPending ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.point} />
        </View>
      ) : (
        <FlatList
          data={reports || []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <AlertCircle size={40} color="#A3B8B8" />
              <Text style={styles.emptyText}>
                {activeTab === "all"
                  ? "등록된 제보 내역이 없습니다."
                  : "작성한 제보 내역이 없습니다."}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.reportCard}
              activeOpacity={0.7}
              onPress={() => handleCardPress(item.id)}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.createdAtText}>
                  {formatDate(item.createdAt)}
                </Text>
              </View>

              <Text style={styles.cardContent} numberOfLines={2}>
                {item.content}
              </Text>

              {item.address && (
                <View style={styles.addressRow}>
                  <MapPin size={14} color="#6E8B8B" />
                  <Text style={styles.addressText}>{item.address}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        />
      )}

      {/* 제보하기 */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => setIsModalOpen(true)}
      >
        <Plus size={22} color="#FFFFFF" />
        <Text style={styles.fabText}>제보하기</Text>
      </TouchableOpacity>

      <CrisisReportModal
        visible={isModalOpen}
        onClose={handleCloseModal}
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
        createReportPending={createReportPending}
        handleGetCurrentLocation={handleGetCurrentLocation}
        handlePickImage={handlePickImage}
        handleRemoveImage={handleRemoveImage}
        handleCreateReport={handleCreateReport}
      />
    </SafeAreaView>
  );
}

/////////////////////////////////////////////////////////////////////////////////

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F6F6" },
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
    backgroundColor: "#FFEFEA",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.55)", // 어두운 투명 오버레이
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContentCard: {
    width: "100%",
    maxHeight: "82%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    // 그림자 (iOS & Android)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
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
    paddingBottom: 8,
  },
  inputGroup: {
    marginBottom: 12,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  imageCountText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6E8B8B",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#1A1A1A",
  },
  textArea: {
    height: 100,
  },
  locationInputRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  locationBtn: {
    backgroundColor: Colors.inactive,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 4,
  },
  locationBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  imagePickerRow: {
    flexDirection: "row",
  },
  addImageBtn: {
    width: 68,
    height: 68,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderStyle: "dashed",
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    gap: 2,
  },
  addImageText: {
    fontSize: 11,
    color: "#6E8B8B",
    fontWeight: "500",
  },
  modalButtonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#64748B",
  },
  submitButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  headerSubtitle: { fontSize: 13, color: "#6E8B8B", marginTop: 4 },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    backgroundColor: "#E4ECEC",
    borderRadius: 12,
    padding: 4,
    marginTop: 12,
    marginBottom: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: { backgroundColor: Colors.card },
  tabText: { fontSize: 13, color: "#6E8B8B", fontWeight: "600" },
  activeTabText: { color: Colors.primary, fontWeight: "700" },
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  reportCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(26, 58, 58, 0.08)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#1A3A3A", flex: 1 },
  createdAtText: { fontSize: 12, color: "#999", marginLeft: 8 },
  cardContent: { fontSize: 14, color: "#6E8B8B", marginTop: 6 },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 4,
  },
  addressText: { fontSize: 12, color: "#6E8B8B" },
  emptyContainer: { alignItems: "center", marginTop: 80, gap: 10 },
  emptyText: { color: "#6E8B8B", fontSize: 14 },
  fab: {
    position: "absolute",
    bottom: 125,
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
  fabText: { color: "#FFFFFF", fontWeight: "700", fontSize: 15 },
});
