import { getPolicies } from "@/api/policy/getPolicies";
import { PolicyListItem } from "@/components/PolicyListItem";
import { CATEGORIES, Category } from "@/constants/Category";
import Colors from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Search } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PolicyScreen() {
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

  //////////////////////////////////////////////////////////////////////////

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
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

  //////////////////////////////////////////////////////////////////////////

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 상단 앱 타이틀 & 헤더 */}

      <View style={styles.header}>
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
              placeholder="검색어를 입력해주세요."
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
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}></Text>
              <Text style={styles.emptyTitle}>검색 결과가 없습니다</Text>
              <Text style={styles.emptySub}>
                다른 검색어나 다른 카테고리를 선택해 보세요.
              </Text>
            </View>
          }
        />
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
    paddingBottom: 68,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
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

  fetchingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eff6ff",
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 10,
    gap: 6,
  },
  fetchingText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "500",
  },

  listContent: {
    paddingBottom: 20,
    gap: 12,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardAccentBar: {
    width: 5,
    backgroundColor: Colors.primaryLight,
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
    marginRight: 8,
    letterSpacing: -0.3,
  },
  badgeOnline: {
    backgroundColor: "#dcfce7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeOnlineText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#15803d",
  },
  cardSummary: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 19,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f8fafc",
  },
  tagGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  tagText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
  dotSeparator: {
    marginHorizontal: 6,
    color: "#cbd5e1",
    fontSize: 10,
  },
  centerState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingStateText: {
    marginTop: 12,
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  errorStateIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  errorStateTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },
  errorStateSub: {
    fontSize: 13,
    color: "#94a3b8",
    marginTop: 4,
    textAlign: "center",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
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

  // Pagination
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
  },
  pageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.point,
    borderWidth: 1,
    borderColor: Colors.point,
  },
  pageButtonDisabled: {
    backgroundColor: "#f1f5f9",
    borderColor: "#e2e8f0",
  },
  pageButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.card,
  },
  pageButtonTextDisabled: {
    color: "#94a3b8",
  },
  pageBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.pointCard,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  pageCurrentText: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.point,
  },
  pageTotalText: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.inactive,
  },
  countText: {
    fontSize: 11,
    fontWeight: "500",
  },
});
