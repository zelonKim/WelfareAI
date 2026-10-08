import { UseMutateFunction } from "@tanstack/react-query";

export interface HandlePickImageProps {
  files?: File[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  uploadImageMutation: UseMutateFunction<string, Error, FormData, unknown>;
}
