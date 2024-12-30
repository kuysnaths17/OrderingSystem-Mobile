import { Stack } from "expo-router";
import "../global.css";
import { CartProvider } from "@/constants/cartContext";


export default function RootLayout() {
  return (
    <CartProvider>
      <Stack>
        <Stack.Screen name="(hometabs)" options={{ headerShown: false }} />
      </Stack>
    </CartProvider>
  );
}
