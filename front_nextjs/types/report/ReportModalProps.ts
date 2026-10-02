export interface ReportModalProps {
  visible: boolean;
  onClose: () => void;
  reportedUserId?: string;
  initialUserName?: string;
}