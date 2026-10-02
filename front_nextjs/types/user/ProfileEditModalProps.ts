export interface ProfileEditModalProps {
  visible: boolean;
  initialNickname: string;
  initialAvatarUri?: string | null;
  isLoading: boolean;
  onClose: () => void;
  onPickImage: () => void;
  onSave: (data: { nickname: string; imageUri?: string | null }) => void;
  onPending: boolean;
  onRemoveImage?: () => void;
  selectedImageUri?: string | null;
}
