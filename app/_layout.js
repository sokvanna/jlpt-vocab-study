import { Tabs } from "expo-router/tabs";
import { View } from "react-native";
import {
  useFonts,
  NotoSerifJP_500Medium,
} from "@expo-google-fonts/noto-serif-jp";

export default function AppLayout() {
  let [fontsLoaded] = useFonts({
    NotoSerifJP_500Medium,
  });
  if (!fontsLoaded) {
    return <View />;
  }
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          href: "/",
          tabBarIconStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="scoreboard"
        options={{
          href: "/scoreboard",
          tabBarIconStyle: { display: "none" },
        }}
      />
    </Tabs>
  );
}
