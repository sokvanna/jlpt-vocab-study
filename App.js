import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import n3 from "./db/n3.json";
import { TouchableOpacity } from "react-native";

export default function App() {
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

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <TouchableOpacity onPress={handleRandomSelection}>
        <Text>Start</Text>
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
