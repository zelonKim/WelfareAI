import { Image } from "expo-image";
import { X } from "lucide-react-native"; 
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface ImageItemProps {
  uri: string;
  onRemove: () => void;
}

export const ImageItem = ({ uri, onRemove }: ImageItemProps) => {
  const [loading, setLoading] = useState(true);

  if (!uri) return null;

  return (
    <View style={styles.imagePreviewContainer}>
      {loading && (
        <View style={styles.imageLoadingOverlay}>
          <ActivityIndicator size="small" color="#6E8B8B" />
        </View>
      )}

      <Image
        source={{ uri }}
        style={styles.imagePreview}
        onLoadStart={() => setLoading(true)} // 로딩 시작
        onLoadEnd={() => setLoading(false)} // 로딩 완료 (성공/실패 모두)
        onError={() => setLoading(false)} // 에러 발생 시에도 로딩 해제
      />

      {/* 삭제 버튼 */}
      <TouchableOpacity style={styles.removeImageBtn} onPress={onRemove}>
        <X size={12} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  imagePreviewContainer: {
    position: "relative",
    marginRight: 5,
    width: 68, // 사용중인 이미지 너비
    height: 68, // 사용중인 이미지 높이
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  imageLoadingOverlay: {
    ...StyleSheet.absoluteFillObject, // absolute top/left/right/bottom: 0 과 동일
    backgroundColor: "#EFEFEF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1, // 이미지 위에 덮이도록 지정
  },
  removeImageBtn: {
    position: "absolute",
    zIndex: 100,
    top: 0,
    right: -6,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 10,
    padding: 3,
  },
});
