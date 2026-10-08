import { UseMutateFunction } from "@tanstack/react-query";

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
  uploadImageMutation: UseMutateFunction<string, Error, FormData, unknown>;
  uploadImagePending?: boolean;
  createReportPending?: boolean;
  handleGetCurrentLocation: (setters: {
    setLatitude: React.Dispatch<React.SetStateAction<number | undefined>>;
    setLongitude: React.Dispatch<React.SetStateAction<number | undefined>>;
    setAddress: React.Dispatch<React.SetStateAction<string>>;
  }) => void;
  handlePickImage: (props: {
    files?: File[];
    setImages: React.Dispatch<React.SetStateAction<string[]>>;
    uploadImageMutation: UseMutateFunction<string, Error, FormData, unknown>;
  }) => void;
  handleRemoveImage: (index: number) => void;
  handleCreateReport: () => void;
}
