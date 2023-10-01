import { Tabs } from "expo-router/tabs";
import { View } from "react-native";
import {
  useFonts,
  NotoSerifJP_500Medium,
} from "@expo-google-fonts/noto-serif-jp";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function AppLayout() {
  let [fontsLoaded] = useFonts({
    NotoSerifJP_500Medium,
  });
  if (!fontsLoaded) {
    return <View />;
  }
  return (
    <SafeAreaProvider>
      <Tabs>
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            href: "/",
            tabBarIcon: () => <FontAwesome size={20} name="home" />,
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: "bold",
            },
          }}
        />
        <Tabs.Screen
          name="scoreboard"
          options={{
            title: "Scoreboard",
            href: "/scoreboard",
            tabBarIcon: () => <FontAwesome size={20} name="clipboard" />,
            tabBarLabelStyle: { fontSize: 12, fontWeight: "bold" },
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}
