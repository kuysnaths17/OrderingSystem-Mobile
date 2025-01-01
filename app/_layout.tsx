import { Stack } from "expo-router";
import "../global.css";
import { CartProvider } from "@/constants/cartContext";
import { MMKV, useMMKVBoolean, useMMKVString } from "react-native-mmkv";
import { getUser } from "@/constants/storageUtils";
import { useState } from "react";

export default function RootLayout() {
  const [userId, setUserId] = useMMKVString("userId");

  return (
    <CartProvider userId={userId}>
        <Stack>
          <Stack.Screen name="(hometabs)" options={{ headerShown: false }} />
        </Stack>
    </CartProvider>
  );
}
