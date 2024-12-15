import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          height: "7%",
        },
        tabBarLabelStyle: {
          fontSize: 14,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="items"
        options={{
          title: "Order",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="fast-food" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tables"
        options={{
          title: "Reserve Table",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="table-restaurant" size={35} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(account)"
        options={{ 
            headerShown: false, href: null,
            tabBarStyle: {
                display: "none"
            }
        }}
      />
    </Tabs>
  );
};

export default _layout;
