import { Stack } from "expo-router"

const _layout = () => {
  return (
    <Stack>
        <Stack.Screen name="index" options={{headerShown:false}}/>
        <Stack.Screen name="paymentwebview" options={{headerShown:false}}/>
    </Stack>
  )
}

export default _layout