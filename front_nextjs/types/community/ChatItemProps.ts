import { BlockedItem } from "../block/BlockedItem";
import { ChatMessage } from "./ChatMessage";

export interface ChatItemProps {
  currentUserId?: string;
  handleDelete: (messageId: string) => void;
  item: ChatMessage;
  handleProfilePress: (item: ChatMessage) => void;
  activePopoverItemId: string | null;
  setActivePopoverItemId: (id: string | null) => void;
  handleReportPress: (nickname: string) => void;
  handleBlockPress: (nickname: string) => void;
  blockedList: BlockedItem[];
}
