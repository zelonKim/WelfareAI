import { getPolicies } from "@/api/policy/getPolicies";
import { PolicyListItem } from "@/components/PolicyListItem";
import { CATEGORIES, Category } from "@/constants/Category";
import Colors from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { useInfiniteQuery } from "@tanstack/react-query";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import {
  BotMessageSquare,
  ChevronLeft,
  Search,
  Settings,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GuestScreen() {
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>("");
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("전체");
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, [selectedCategory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  const handleSelectCategory = (name: Category) => {
    setSelectedCategory(name);
  };

  const handleRequireLogin = (tabName: string) => {
    Alert.alert(
      "로그인 필요",
      `'${tabName}' 기능은 로그인이 필요한 서비스입니다.`,
      [
        { text: "취소", style: "cancel" },
        {
          text: "로그인 페이지로 이동",

          onPress: () => router.replace("/login"),
        },
      ],
    );
  };

  //////////////////////////////////////////////////////////////////////////

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isPending,
    refetch,
  } = useInfiniteQuery({
    queryKey: [
      "policies",
      { keyword: debouncedKeyword, category: selectedCategory },
    ],
    queryFn: ({ pageParam = 1 }) =>
      getPolicies({
        pageNo: pageParam,
        numOfRows: 10,
        category: selectedCategory,
        keyword: debouncedKeyword,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const maxPages = Math.ceil(lastPage.totalCount / 10);
      const nextPage = allPages.length + 1;
      return nextPage <= maxPages ? nextPage : undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 60 * 24,
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const totalCount = data?.pages[0]?.totalCount;
  const isInitialLoading = isPending || (isFetching && !data);

  //////////////////////////////////////////////////////////////////////////

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 상단 앱 타이틀 & 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/login")}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ChevronLeft size={24} color={Colors.text || "#0f172a"} />
        </TouchableOpacity>
        <View style={styles.headerTitleRow}>
          <View style={styles.aiBadge}>
            <Feather name="file-text" size={22} color={Colors.point} />
          </View>
          <Text style={styles.headerTitle}>복지 지원 정책</Text>
        </View>
      </View>

      <View style={styles.container}>
        {/* 검색어 입력 필드 */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Text style={styles.searchIcon}>
              <Search size={20} color={Colors.inactive} />
            </Text>
            <TextInput
              style={styles.searchInput}
              placeholder="검색어를 입력해 보세요."
              placeholderTextColor="#94a3b8"
              value={keyword}
              onChangeText={setKeyword}
              clearButtonMode="while-editing"
            />
          </View>
        </View>

        {/* 가로 스크롤 카테고리 바 */}
        <View style={styles.categoryWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryContainer}
          >
            {CATEGORIES.map((cate) => {
              const isSelected = selectedCategory === cate;
              return (
                <TouchableOpacity
                  key={cate || "all"}
                  style={[
                    styles.categoryChip,
                    isSelected && styles.selectedChip,
                  ]}
                  onPress={() => handleSelectCategory(cate)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      isSelected && styles.selectedCategoryText,
                    ]}
                  >
                    {cate}
                    {isSelected && (
                      <Text style={styles.countText}>
                        {" "}
                        {isFetching && !data ? (
                          <ActivityIndicator
                            size="small"
                            style={{ marginLeft: 6, marginTop: 12 }}
                          />
                        ) : totalCount !== undefined ? (
                          ` (${totalCount})`
                        ) : (
                          ""
                        )}
                      </Text>
                    )}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <FlatList
          ref={flatListRef}
          data={data?.pages.flatMap((page) => page.items) || []}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator size="small" style={{ marginVertical: 16 }} />
            ) : null
          }
          keyExtractor={(item) => item.id}
          renderItem={PolicyListItem}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            isInitialLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}></Text>
                <Text style={styles.emptyTitle}>검색 결과가 없습니다</Text>
                <Text style={styles.emptySub}>
                  다른 검색어나 다른 카테고리를 선택해 보세요.
                </Text>
              </View>
            )
          }
        />
      </View>

      <View style={styles.tabBarContainer}>
        <View style={styles.blurContainer}>
          <BlurView
            tint="light"
            intensity={60}
            style={StyleSheet.absoluteFillObject}
          />
        </View>

        {/* 1. 설정 (로그인 필요) */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => handleRequireLogin("설정")}
        >
          <View style={styles.iconContainer}>
            <Settings size={22} color={Colors.inactive || "#94a3b8"} />
          </View>
          <Text style={styles.tabLabel}>설정</Text>
        </TouchableOpacity>

        {/* 2. 제보 (로그인 필요) */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => handleRequireLogin("제보")}
        >
          <View style={styles.iconContainer}>
            <Feather
              name="bell"
              size={22}
              color={Colors.inactive || "#94a3b8"}
            />
          </View>
          <Text style={styles.tabLabel}>제보</Text>
        </TouchableOpacity>

        {/* 3. 상담 (로그인 필요) */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => handleRequireLogin("상담")}
        >
          <View style={styles.iconContainer}>
            <BotMessageSquare size={24} color={Colors.inactive || "#94a3b8"} />
          </View>
          <Text style={styles.tabLabel}>상담</Text>
        </TouchableOpacity>

        {/* 4. 정책 (현재 활성화 상태) */}
        <TouchableOpacity style={styles.tabItem} activeOpacity={1}>
          <View style={[styles.iconContainer, styles.activeIconBg]}>
            <Feather
              name="file-text"
              size={22}
              color={Colors.primary || "#1A3A3A"}
            />
          </View>
          <Text style={[styles.tabLabel, styles.activeTabLabel]}>정책</Text>
        </TouchableOpacity>

        {/* 5. 모임 (로그인 필요) */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => handleRequireLogin("모임")}
        >
          <View style={styles.iconContainer}>
            <Feather
              name="users"
              size={22}
              color={Colors.inactive || "#94a3b8"}
            />
          </View>
          <Text style={styles.tabLabel}>모임</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

//////////////////////////////////////////////////////////////////////////

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F2F6F6",
  },
  container: {
    flex: 1,
    backgroundColor: "#F2F6F6",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 52,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(26, 58, 58, 0.06)",
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

  // Search
  searchContainer: {
    marginBottom: 12,
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
    marginTop: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1e293b",
    paddingVertical: 0,
  },

  categoryWrapper: {
    marginBottom: 14,
    marginHorizontal: -16,
  },
  categoryContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  selectedChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    shadowColor: Colors.primaryLight,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748b",
  },
  selectedCategoryText: {
    color: "#ffffff",
    fontWeight: "700",
  },

  listContent: {
    paddingBottom: 100, // 탭바에 아이템이 가려지지 않도록 여백
    gap: 12,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 120,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#334155",
  },
  emptySub: {
    fontSize: 13,
    color: "#94a3b8",
    marginTop: 4,
  },
  countText: {
    fontSize: 11,
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    paddingVertical: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    padding: 4,
  },

  /* 탭바 관련 추가 스타일 */
  tabBarContainer: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? "5%" : "6%",
    width: "90%",
    marginHorizontal: "5%",
    height: 68,
    borderRadius: 32,
    backgroundColor: Colors.card || "#ffffff",
    borderTopWidth: 0,
    elevation: 4,
    marginBottom: Platform.OS === "android" ? 12 : 3,
    shadowColor: Colors.primary || "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  blurContainer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 32,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.card || "#ffffff",
  },
  tabItem: {
    height: 64,
    paddingTop: 6,
    paddingBottom: 6,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 32,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  activeIconBg: {
    backgroundColor: "rgba(22, 101, 52, 0.12)",
  },
  tabLabel: {
    fontSize: Platform.OS === "ios" ? 12 : 9,
    fontWeight: "600",
    marginTop: 4,
    color: Colors.inactive || "#94a3b8",
  },
  activeTabLabel: {
    color: Colors.primary || "#1A3A3A",
    fontWeight: "700",
  },
});
