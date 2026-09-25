import { UseMutateFunction } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

interface HandlePickImageProps {
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  uploadImageMutation: UseMutateFunction<string, Error, FormData, unknown>;
}

export const handlePickImage = async ({
  setImages,
  uploadImageMutation,
}: HandlePickImageProps) => {
  const permissionResult =
    await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permissionResult.granted) {
    Alert.alert("권한 필요", "사진을 선택하려면 앨범 접근 권한이 필요합니다.");
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (!result.canceled && result.assets[0]) {
    const asset = result.assets[0];

    const formData = new FormData();
    formData.append("image", {
      uri: asset.uri,
      name: asset.fileName || `image_${Date.now()}.jpg`,
      type: asset.mimeType || "image/jpeg",
    } as any);

    uploadImageMutation(formData, {
      onSuccess: (imageUrl) => {
        const imageUrlWithCacheBust = `${imageUrl}?t=${Date.now()}`;
        setImages((prev) => [...prev, imageUrlWithCacheBust]);
      },
    });
  }
};
