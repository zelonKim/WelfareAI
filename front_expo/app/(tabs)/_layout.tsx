import Colors from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { BotMessageSquare, Settings } from "lucide-react-native";
import { Platform, StyleSheet, View } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary, 
        tabBarInactiveTintColor: Colors.inactive, 
        tabBarStyle: {
          position: "absolute",
          bottom: "5%",
          width: "90%",
          marginHorizontal: "5%",
          height: 68,
          borderRadius: 32,
          backgroundColor: Colors.card,
          borderTopWidth: 0,
          elevation: 1,
          marginBottom: Platform.OS === "android" ? 12 : 0,
          shadowColor: Colors.primary,
          shadowOffset: { width: 6, height: 6 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
        },
        tabBarItemStyle: {
          height: 64,
          paddingTop: 6,
          paddingBottom: 6,
          justifyContent: "center",
          alignItems: "center",
        },

        tabBarBackground: () => (
          <View style={styles.blurContainer}>
            <BlurView
              tint="light"
              intensity={60}
              style={StyleSheet.absoluteFillObject}
            />
          </View>
        ),

        tabBarLabelStyle: {
          fontSize: Platform.OS === "ios" ? 12 : 9,
          fontWeight: "600",
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="mypage"
        options={{
          title: "설정",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[styles.iconContainer, focused && styles.activeIconBg]}
            >
              <Settings size={22} color={color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="crisisReport"
        options={{
          title: "제보",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[styles.iconContainer, focused && styles.activeIconBg]}
            >
              <Feather name="bell" size={22} color={color} />
            </View>
          ),
        }}
      />

      {/* 3. AI상담 */}
      <Tabs.Screen
        name="index"
        options={{
          title: "상담",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[styles.iconContainer, focused && styles.activeIconBg]}
            >
              <BotMessageSquare size={24} color={color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="policy"
        options={{
          title: "정책",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[styles.iconContainer, focused && styles.activeIconBg]}
            >
              <Feather name="file-text" size={22} color={color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="community"
        options={{
          title: "모임",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[styles.iconContainer, focused && styles.activeIconBg]}
            >
              <Feather name="users" size={22} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  blurContainer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 32,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.card,
    backgroundColor: Colors.card,
  },
  iconContainer: {
    width: 36,
    height: 32,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  activeIconBg: {
    backgroundColor: "rgba(22, 101, 52, 0.12)",
  },
});
