import Colors from "@/constants/Colors";
import { Text, View } from "react-native";

export default function PolicyScreen() {
  return (
    <View
      style={{
        backgroundColor: Colors.background,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>복지 정책 목록</Text>
    </View>
  );
}
