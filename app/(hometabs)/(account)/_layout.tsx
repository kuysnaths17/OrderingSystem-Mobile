import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack screenOptions={
            {
                headerTintColor: "white",
                headerTitleStyle: {
                    fontWeight: "bold",
                    
                },
                headerTitleAlign: "center"
            }
        }>
            <Stack.Screen name="index" options={{headerShown: false}} />
            <Stack.Screen name="login" options={{
                headerTransparent: true,
                headerTitle: "",
                headerTintColor: "#368EEF",
            }} />
            <Stack.Screen name="register" options={{
                headerTransparent: true,
                headerTitle: "",
                headerTintColor: "#368EEF",
            }} />
            <Stack.Screen name="forgotpassword" options={{
                headerTransparent: true,
                headerTitle: "",
                headerTintColor: "#368EEF",
            }} />
        </Stack>
    )
}