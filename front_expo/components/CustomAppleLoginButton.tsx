
import { SocialLoginButtonProps } from "@/types/common/SocialLoginButtonProps";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";


export function CustomAppleLoginButton({ onPress }: SocialLoginButtonProps) {
  return (
    <TouchableOpacity
      style={styles.appleButton}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.contentContainer}>
        <Ionicons
          name="logo-apple"
          size={20}
          color="#FFFFFF"
          style={styles.logo}
        />
        <Text style={styles.appleButtonText}>Apple로 로그인</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  appleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    width: "100%",
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    marginRight: 8,
    marginBottom: 2,
  },
  appleButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
