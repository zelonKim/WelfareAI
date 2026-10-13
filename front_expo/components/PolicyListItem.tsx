import Colors from "@/constants/Colors";
import { PolicyItem } from "@/types/policy/PolicyItem";
import { ExternalLink } from "lucide-react-native";
import React from "react";
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export const PolicyListItem = ({ item }: { item: PolicyItem }) => {
  const displayUrl =
    item?.detailUrl && item.detailUrl.trim() !== ""
      ? item.detailUrl
      : "https://www.bokjiro.go.kr";

  const handlePress = () => {
    if (displayUrl) {
      Linking.openURL(displayUrl);
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.85}
    >
      {/* 왼쪽 포인트 브랜드 바 */}
      <View style={styles.leftBar} />

      <View style={styles.contentContainer}>
        {/* 1. 상단 타이틀 & 온라인 신청 배지 */}
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
        </View>

        {/* 2. 요약 텍스트 */}
        <Text style={styles.summary}>
          {item.summary || "상세 내용을 확인하려면 터치하세요."}
        </Text>

        {/* 3. 공식 출처 URL (구글 심사용 핵심 요소) */}
        <View style={styles.infoRow}>
          <View style={styles.urlWrapper}>
            <Text style={styles.sourceLabel}>
              <ExternalLink
                size={11}
                color={Colors.primary}
                style={{ marginLeft: 3 }}
              />{" "}
              공식 출처 :
            </Text>
            <Text style={styles.sourceUrl} numberOfLines={1}>
              {displayUrl}
            </Text>
          </View>
        </View>

        {/* 4. 면책 조항 (은은하게 가독성 확보) */}
        <Text style={styles.disclaimerText} numberOfLines={1}>
          ※ 본 앱은 정부를 대표하지 않으며, 정확한 요건은 공식 누리집을
          참고하세요.
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f1f5f9",
    marginVertical: 3,
    marginHorizontal: 16,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  leftBar: {
    width: 4,
    backgroundColor: "#1A3A3A",
  },
  contentContainer: {
    flex: 1,
    paddingVertical: 14, // 상하 패딩을 여유 있게 조정 (10 -> 14)
    paddingHorizontal: 14, // 좌우 패딩 미세 조정 (12 -> 14)
    gap: 6, // 내부 요소 간 간격 여유 확보 (4 -> 6)
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 1,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: Colors.primary,
    marginRight: 6,
    letterSpacing: -0.3,
  },
  badge: {
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#d1fae5",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#059669",
  },
  summary: {
    fontSize: 12.5,
    color: "#475569",
    lineHeight: 18, 
  },
  infoRow: {
    marginTop: 2,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f1f3f6",
  },
  urlWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  sourceLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#a1a1aa",
    marginRight: 4,
  },
  sourceUrl: {
    flexShrink: 1,
    fontSize: 11,
    color: "#475569",
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  disclaimerText: {
    fontSize: 9,
    color: "#a1a1aa",
    letterSpacing: -0.3,
    marginTop: 1,
  },
});
