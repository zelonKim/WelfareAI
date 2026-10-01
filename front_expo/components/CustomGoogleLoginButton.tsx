import { SocialLoginButtonProps } from "@/types/common/SocialLoginButtonProps";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";


export function CustomGoogleLoginButton({ onPress }: SocialLoginButtonProps) {
  return (
    <TouchableOpacity
      style={styles.googleButton}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.contentContainer}>
        <Image
          source={require("@/assets/images/google_logo.png")}
          style={styles.logo}
        />
        <Text style={styles.googleButtonText}>Google로 로그인</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    width: "100%",

    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 18,
    height: 18,
    marginRight: 10,
    resizeMode: "contain",
  },
  googleButtonText: {
    color: "#1F1F1F", // Google 공식 텍스트 컬러
    fontSize: 16,
    fontWeight: "600",
  },
});
