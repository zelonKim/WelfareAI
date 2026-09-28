import Colors from "@/constants/Colors";
import { PolicyItem } from "@/types/policy/PolicyItem";
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export const PolicyListItem = ({ item }: { item: PolicyItem }) => (
  <TouchableOpacity
    style={styles.card}
    activeOpacity={0.6}
    onPress={() => item.detailUrl && Linking.openURL(item.detailUrl)}
  >
    <View style={styles.cardAccentBar} />
    <View style={styles.cardContent}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>
        {item.isOnlineApply && (
          <View style={styles.badgeOnline}>
            <Text style={styles.badgeOnlineText}>온라인신청</Text>
          </View>
        )}
      </View>

      <Text style={styles.cardSummary}>
        {item.summary || "상세 내용을 확인하려면 터치하세요."}
      </Text>

      <View style={styles.cardFooter}>
        <View style={styles.tagGroup}>
          <Text style={styles.tagText}>{item.department}</Text>
          {item.supportCycle && (
            <>
              <Text style={styles.dotSeparator}>•</Text>
              <Text style={styles.tagText}>{item.supportCycle}</Text>
            </>
          )}
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
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
    backgroundColor: Colors.primary,
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
});
