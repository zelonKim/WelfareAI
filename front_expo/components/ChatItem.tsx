import Colors from "@/constants/Colors";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/constants/ScreenSize";
import { ChatItemProps } from "@/types/community/ChatItemProps";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { UserProfileAvatar } from "./UserProfileAvatar";

export const ChatItem = ({
  currentUserId,
  handleDelete,
  item,
  handleProfilePress,
  activePopoverItemId,
  setActivePopoverItemId,
  handleReportPress,
  handleBlockPress,
  blockedList,
}: ChatItemProps) => {
  const isMyMessage = item.userId === currentUserId;
  return (
    <View
      style={[
        styles.messageRow,
        isMyMessage ? styles.myMessageRow : styles.otherMessageRow,
      ]}
    >
      {!isMyMessage ? (
        <View style={{ flexDirection: "column", gap: 6 }}>
          <View style={styles.otherMessageContainer}>
            <UserProfileAvatar
              profileImage={item.user?.profileImage}
              nickname={item.user?.nickname}
              size={32}
              iconSize={18}
              isPopoverVisible={activePopoverItemId === item.id}
              onProfilePress={() => handleProfilePress(item)}
              onClosePopover={() => setActivePopoverItemId(null)}
              onReportPress={handleReportPress}
              onBlockPress={handleBlockPress}
            />
            <View>
              <Text style={styles.senderName}>
                {item.user?.nickname || "익명"}
              </Text>
            </View>
          </View>

          <View style={styles.messageBubbleContainer}>
            <View style={[styles.messageBubble, styles.otherBubble]}>
              <Text style={[styles.messageText, styles.otherMessageText]}>
                {item.message}
              </Text>
            </View>

            <Text style={styles.timeText}>
              {new Date(item.createdAt).toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        </View>
      ) : (
        /* 내 메시지인 경우 */
        <View style={styles.messageBubbleContainer}>
          <Text style={styles.timeText}>
            {new Date(item.createdAt).toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>

          <View style={[styles.messageBubble, styles.myBubble]}>
            <TouchableOpacity
              onLongPress={() => handleDelete(item.id)}
              activeOpacity={0.8}
            >
              <Text style={[styles.messageText, styles.myMessageText]}>
                {item.message}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  messageRow: {
    marginBottom: 12,
    maxWidth: "80%",
  },
  myMessageRow: {
    alignSelf: "flex-end",
  },
  otherMessageRow: {
    alignSelf: "flex-start",
  },
  senderName: {
    fontSize: 12,
    color: "#718096",
    marginBottom: 4,
    marginLeft: 2,
  },
  messageBubbleContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
  },
  deleteButton: {
    padding: 4,
  },
  messageBubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  myBubble: {
    backgroundColor: "#FF6C4B",
    borderBottomRightRadius: 2,
  },
  otherBubble: {
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  myMessageText: {
    color: "#FFFFFF",
  },
  otherMessageText: {
    color: "#2D3748",
  },
  timeText: {
    fontSize: 10,
    color: "#A0AEC0",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 15,
    color: "#1A202C",
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FF6C4B",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#CBD5E1",
  },

  otherMessageContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.inactive,
  },
  defaultProfileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EDF2F7",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  popoverMenu: {
    position: "absolute",
    top: 25, // 프로필 높이에 맞게 미세 조정
    left: 40, // 프로필 이미지 너비(36px) + 여백
    width: 130, // 고정 너비를 주면 텍스트 길이에 따라 레이아웃이 변하지 않음
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#E9ECEF",
    zIndex: 1001, // 오버레이보다 위에 렌더링

    // 그림자 (iOS & Android)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
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
  fullScreenOverlay: {
    position: "absolute",
    top: -SCREEN_HEIGHT,
    left: -SCREEN_WIDTH,
    width: SCREEN_WIDTH * 2,
    height: SCREEN_HEIGHT * 2,
    backgroundColor: "transparent",
    zIndex: 1000,
  },
});
