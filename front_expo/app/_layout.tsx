import { APIProvider } from "@/api/api-provider";
import { useColorScheme } from "@/components/useColorScheme.web";
import Colors from "@/constants/Colors";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { KeyboardProvider } from "react-native-keyboard-controller";
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
      const data = response.notification.request.content.data;

      if (data?.url) {
        router.push(data.url as any);
      }
    }
  }, [response]);

  return (
    <>
      <StatusBar style="dark" />
      <ThemeProvider value={GeneralTheme}>
        <KeyboardProvider>
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
              <Stack.Screen name="donation" options={{ headerShown: false }} />
              <Stack.Screen name="agreement" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: "modal" }} />
            </Stack>
          </APIProvider>
        </KeyboardProvider>
      </ThemeProvider>
    </>
  );
}
