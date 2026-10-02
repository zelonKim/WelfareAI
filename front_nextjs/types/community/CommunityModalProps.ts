import { CommunityType } from "./CommunityPost";

export interface CommunityModalProps {
  modalType: string;
  visible: boolean;
  onClose: () => void;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  notice?: string;
  setNotice?: React.Dispatch<React.SetStateAction<string>>;
  communityType?: CommunityType;
  setCommunityType?: React.Dispatch<React.SetStateAction<CommunityType>>;
  createCommunityPending?: boolean;
  handleCreateCommunity: () => void;
}
