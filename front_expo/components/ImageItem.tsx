import { ImageItemProps } from "@/types/common/ImageItemProps";
import { Image } from "expo-image";
import { X } from "lucide-react-native"; 
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";


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
        onLoadStart={() => setLoading(true)} 
        onLoadEnd={() => setLoading(false)} 
        onError={() => setLoading(false)} 
      />

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
    width: 68, 
    height: 68, 
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  imageLoadingOverlay: {
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: "#EFEFEF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1, 
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
