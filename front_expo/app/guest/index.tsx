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

        {/* 3. AI 상담 (로그인 필요) */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => handleRequireLogin("AI 상담")}
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
