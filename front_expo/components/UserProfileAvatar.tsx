// components/UserProfileAvatar.tsx
import { Colors } from "@/constants/Colors"; // 프로젝트 설정 경로
import { Ban, ShieldAlert, User as UserIcon } from "lucide-react-native"; // 사용 중인 아이콘 패키지
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface UserProfileAvatarProps {
  userId?: string | number;
  profileImage?: string | null;
  nickname?: string;
  size?: number;
  iconSize?: number;
  isPopoverVisible?: boolean;
  onProfilePress?: () => void;
  onClosePopover?: () => void;
  onReportPress?: (nickname: string) => void;
  onBlockPress?: (nickname: string) => void;
}

export const UserProfileAvatar: React.FC<UserProfileAvatarProps> = ({
  profileImage,
  nickname = "사용자",
  size = 36,
  iconSize = 20,
  isPopoverVisible = false,
  onProfilePress,
  onClosePopover,
  onReportPress,
  onBlockPress,
}) => {
  return (
    <View style={[styles.profileWrapper, { width: size, height: size }]}>
      {/* 프로필 이미지 클릭 */}
      <TouchableOpacity onPress={onProfilePress} activeOpacity={0.8}>
        {profileImage ? (
          <Image
            source={{ uri: profileImage }}
            style={[
              styles.profileImage,
              { width: size, height: size, borderRadius: size / 2 },
            ]}
          />
        ) : (
          <View
            style={[
              styles.defaultProfileImage,
              { width: size, height: size, borderRadius: size / 2 },
            ]}
          >
            <UserIcon size={iconSize} color={Colors.primary} />
          </View>
        )}
      </TouchableOpacity>

      {/* 신고 / 차단 플로팅 팝업 */}
      {isPopoverVisible && (
        <>
          {/* 외부 터치 시 닫기 레이어 */}
          <TouchableOpacity
            style={styles.fullScreenOverlay}
            activeOpacity={1}
            onPress={onClosePopover}
          />

          <View style={[styles.popoverMenu, { left: size + 8 }]}>
            <TouchableOpacity
              style={styles.popoverItem}
              onPress={() => onReportPress?.(nickname)}
            >
              <ShieldAlert size={16} color="#FF3B30" />
              <Text style={styles.popoverText}>신고</Text>
            </TouchableOpacity>

            <View style={styles.popoverDivider} />

            <TouchableOpacity
              style={styles.popoverItem}
              onPress={() => onBlockPress?.(nickname)}
            >
              <Ban size={16} color="#FF3B30" />
              <Text style={styles.popoverText}>차단</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  profileWrapper: {
    position: "relative",
    zIndex: 999,
  },
  profileImage: {
    backgroundColor: "#E9ECEF",
  },
  defaultProfileImage: {
    backgroundColor: Colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenOverlay: {
    position: "absolute",
    top: -SCREEN_HEIGHT,
    left: -SCREEN_WIDTH,
    width: SCREEN_WIDTH * 2,
    height: SCREEN_HEIGHT * 2,
    backgroundColor: "transparent",
    zIndex: 1000,
  },
  popoverMenu: {
    position: "absolute",
    top: 20,
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
    zIndex: 1001,
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
});
