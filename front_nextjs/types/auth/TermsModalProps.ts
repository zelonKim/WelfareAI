export interface TermsModalProps {
  visible: boolean;
  type: "terms" | "privacy" | "marketing" | null;
  onClose: () => void;
}