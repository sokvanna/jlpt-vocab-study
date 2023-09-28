import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import n3 from "./db/n3.json";
import AppLoading from "expo-app-loading";

import { TouchableOpacity } from "react-native";
import {
  useFonts,
  NotoSerifJP_500Medium,
} from "@expo-google-fonts/noto-serif-jp";

export default function App() {
  let [fontsLoaded] = useFonts({
    NotoSerifJP_500Medium,
  });
  let fontSize = 24;
  let paddingVertical = 6;

  const [randomSelection, setRandomSelection] = useState([]);

  const getRandomObjects = (arr, count) => {
    const selectedObjects = [];
    const copyOfArr = [...arr];

    if (count > arr.length) {
      throw new Error("Count should not exceed the length of the array");
    }

    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * copyOfArr.length);
      const randomObject = copyOfArr.splice(randomIndex, 1)[0];
      selectedObjects.push(randomObject);
    }

    return selectedObjects;
  };

  const handleRandomSelection = () => {
    const newRandomSelection = getRandomObjects(n3, 40);
    setRandomSelection(newRandomSelection);
  };

  console.log("test", randomSelection);
  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <TouchableOpacity onPress={handleRandomSelection}>
        <Text
          style={{
            fontSize,
            paddingVertical,
            fontFamily: "NotoSerifJP_500Medium",
          }}
        >
          Start 香り
        </Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
