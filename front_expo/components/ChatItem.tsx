import Colors from "@/constants/Colors";
import { ChatMessage } from "@/types/community/ChatMessage";
import { Image } from "expo-image";
import { UserIcon } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const ChatItem = ({
  currentUserId,
  handleDelete,
  item,
}: {
  currentUserId?: string;
  handleDelete: (messageId: string) => void;
  item: ChatMessage;
}) => {
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
            {item.user?.profileImage ? (
              <Image
                source={{ uri: item.user.profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.defaultProfileImage}>
                <UserIcon size={18} color={Colors.primary} />
              </View>
            )}

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
});
