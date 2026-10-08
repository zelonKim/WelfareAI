export interface UserProfileAvatarProps {
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
