import { StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import n3 from "../db/n3.json";
import { TouchableOpacity } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  let fontSize = 24;
  let paddingVertical = 6;

  const [vocabulary, setVocabulary] = useState([]);
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

  const setInitialState = () => {
    const vocabWithScore = n3.map(function (ele) {
      return { ...ele, score: 0 };
    });
    storeData(vocabWithScore);
    setVocabulary(vocabWithScore);
  };

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("n3Vocab", jsonValue);
    } catch (e) {
      console.log("error saving", e);
    }
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("n3Vocab");
      if (jsonValue !== null) {
        setVocabulary(JSON.parse(jsonValue));
      } else {
        setInitialState();
      }
    } catch (e) {
      setInitialState();
      // error reading value
    }
  };

  const clearAll = async () => {
    try {
      await AsyncStorage.clear();
      setInitialState();
    } catch (e) {
      // clear error
    }

    console.log("Done.");
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <View style={styles.container}>
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

      <TouchableOpacity onPress={clearAll}>
        <Text>Clear</Text>
      </TouchableOpacity>
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
