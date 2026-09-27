export interface CrisisReportModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  setTitle: (text: string) => void;
  content: string;
  setContent: (text: string) => void;
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  setLatitude: React.Dispatch<React.SetStateAction<number | undefined>>;
  setLongitude: React.Dispatch<React.SetStateAction<number | undefined>>;
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  uploadImageMutation: any;
  uploadImagePending?: boolean;
  createReportPending?: boolean;
  handleGetCurrentLocation: (setters: {
    setLatitude: React.Dispatch<React.SetStateAction<number | undefined>>;
    setLongitude: React.Dispatch<React.SetStateAction<number | undefined>>;
    setAddress: React.Dispatch<React.SetStateAction<string>>;
  }) => void;
  handlePickImage: (props: {
    setImages: React.Dispatch<React.SetStateAction<string[]>>;
    uploadImageMutation: any;
  }) => void;
  handleRemoveImage: (index: number) => void;
  handleCreateReport: () => void;
}
