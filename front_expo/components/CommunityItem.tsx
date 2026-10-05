import Colors from "@/constants/Colors";
import { CommunityPost } from "@/types/community/CommunityPost";
import { Image } from "expo-image";
import { router } from "expo-router";
import { UserIcon, Users } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const CommunityItem = ({ item }: { item: CommunityPost }) => {
  const approvedCount = item._count?.members ?? 0;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => router.push(`/communityDetail/${item.id}`)}
    >
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.typeBadge,
            item.type === "VOLUNTEER"
              ? styles.volunteerBadge
              : styles.selfHelpBadge,
          ]}
        >
          <Text
            style={[
              styles.typeBadgeText,
              item.type === "VOLUNTEER"
                ? styles.volunteerBadgeText
                : styles.selfHelpBadgeText,
            ]}
          >
            {item.type === "VOLUNTEER" ? "봉사" : "소통"}
          </Text>
        </View>

        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>
      </View>

      <Text style={styles.cardContent} numberOfLines={2}>
        {item.content}
      </Text>

      <View style={styles.cardFooter}>
        <View style={styles.badgeContainer}>
          {item.host?.profileImage ? (
            <Image
              source={{ uri: item.host.profileImage }}
              style={styles.avatar}
            />
          ) : (
            <View
              style={[
                styles.avatar,
                { justifyContent: "center", alignItems: "center" },
              ]}
            >
              <UserIcon size={20} color={Colors.primary} />
            </View>
          )}
          <Text style={styles.hostText}>{item.host?.nickname || "익명"}</Text>
        </View>

        <View style={styles.memberInfo}>
          <Users size={14} color="#8E99A3" />
          <Text style={styles.memberText}>{approvedCount}명</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
    marginLeft: 6,
  },
  cardDate: {
    fontSize: 13,
    color: "#8E99A3",
  },
  cardContent: {
    fontSize: 14,
    color: "#5C6870",
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.background,
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 24,
    backgroundColor: Colors.primaryLight,
    marginRight: 2,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  volunteerBadge: {
    backgroundColor: "#FFEFEA",
  },
  selfHelpBadge: {
    backgroundColor: "#FFEFEA",
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  volunteerBadgeText: {
    color: Colors.point,
  },
  selfHelpBadgeText: {
    color: Colors.point,
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
});
