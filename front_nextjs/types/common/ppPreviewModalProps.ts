export interface AppPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  androidUrl: string;
  iosUrl: string;
  modalOS: string;
}
