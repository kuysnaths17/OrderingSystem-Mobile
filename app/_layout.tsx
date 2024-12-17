import { Stack } from "expo-router";
import "../global.css";
import { CartProvider } from "@/constants/cartContext";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from "react";

export default function RootLayout() {
  useEffect(() => {
    const prepare = async () => {
      await SplashScreen.preventAutoHideAsync();
      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 2000)); // Adjust as needed
      await SplashScreen.hideAsync();
    };

    prepare();
  }, []);
  return (
    <CartProvider>
      <Stack>
        <Stack.Screen name="(hometabs)" options={{ headerShown: false }} />
      </Stack>
    </CartProvider>
  );
}
