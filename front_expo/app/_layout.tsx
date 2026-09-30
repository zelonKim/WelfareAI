import { APIProvider } from "@/api/api-provider";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

const GeneralTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.background,
  },
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const response = Notifications.useLastNotificationResponse();

  useEffect(() => {
    if (
      response &&
      response.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER
    ) {
      // 백엔드에서 보내준 data 객체 추출
      const data = response.notification.request.content.data;

      // data.url 값이 존재하면 해당 페이지로 이동
      if (data?.url) {
        router.push(data.url as any);
      }
    }
  }, [response]);

  return (
    <ThemeProvider value={GeneralTheme}>
      <APIProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen
            name="crisisReportDetail"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="communityDetail"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        </Stack>
      </APIProvider>
    </ThemeProvider>
  );
}
