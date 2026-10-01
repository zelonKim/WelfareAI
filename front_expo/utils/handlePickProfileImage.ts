import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

export const handlePickProfileImage = async (
  setSelectedImageUri: (uri: string) => void,
) => {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    Alert.alert("권한 필요", "사진첩 접근 권한이 필요합니다.");
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (!result.canceled && result.assets[0]) {
    setSelectedImageUri(result.assets[0].uri);
  }
};
